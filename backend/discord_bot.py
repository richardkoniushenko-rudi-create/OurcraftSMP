"""
Ourcraft Discord Bot
====================
Runs inside the FastAPI event loop as a background task.
- Tracks guild member/online counts (via gateway presence intent)
- Falls back to Discord widget.json for presence_count (no intents required)
- Listens to a designated chat channel for in-game chat bridged messages
- Reads bot's own presence/activity text to derive player count (format: "X players online")
- Exposes getters used by FastAPI endpoints
"""
from __future__ import annotations

import asyncio
import logging
import os
import re
from collections import deque
from datetime import datetime, timezone
from typing import Optional

import aiohttp
import discord

logger = logging.getLogger("ourcraft.discord")

# ---------------------------------------------------------------------------
# Shared in-memory state (read by the FastAPI routes)
# ---------------------------------------------------------------------------
class BotState:
    def __init__(self) -> None:
        self.ready: bool = False
        self.guild_name: Optional[str] = None
        self.guild_icon: Optional[str] = None
        self.member_count: int = 0
        self.online_count: int = 0
        self.players_online: int = 0
        self.player_names: list[str] = []
        self.bot_status_text: Optional[str] = None
        self.last_sync: Optional[str] = None
        self.channels: list[dict] = []
        self.chat_messages: deque = deque(maxlen=50)
        self.active_channel_id: Optional[int] = None
        self.active_channel_name: Optional[str] = None

    def to_public(self) -> dict:
        return {
            "ready": self.ready,
            "guild_name": self.guild_name,
            "guild_icon": self.guild_icon,
            "member_count": self.member_count,
            "online_count": self.online_count,
            "players_online": self.players_online,
            "player_names": self.player_names[:20],
            "bot_status_text": self.bot_status_text,
            "last_sync": self.last_sync,
            "active_channel_name": self.active_channel_name,
        }


state = BotState()

# ---------------------------------------------------------------------------
# Bot setup
# ---------------------------------------------------------------------------
intents = discord.Intents.default()
intents.guilds = True
intents.members = True
intents.message_content = True
intents.presences = True

bot = discord.Client(intents=intents)

PLAYER_RE = re.compile(r"(\d+)\s*(?:/\s*\d+)?\s*players?", re.IGNORECASE)


def _guild_id() -> Optional[int]:
    raw = os.environ.get("DISCORD_GUILD_ID")
    try:
        return int(raw) if raw else None
    except ValueError:
        return None


def _chat_channel_id() -> Optional[int]:
    raw = os.environ.get("DISCORD_CHAT_CHANNEL_ID")
    try:
        return int(raw) if raw else None
    except ValueError:
        return None


async def _sync_guild() -> None:
    gid = _guild_id()
    if not gid:
        return
    guild = bot.get_guild(gid)
    if guild is None:
        try:
            guild = await bot.fetch_guild(gid)
        except Exception as e:  # noqa: BLE001
            logger.warning("Failed to fetch guild %s: %s", gid, e)
            return

    state.guild_name = guild.name
    state.guild_icon = str(guild.icon.url) if guild.icon else None
    state.member_count = guild.member_count or 0

    # Online count (requires members + presences intent)
    online = 0
    for m in guild.members:
        if m.status != discord.Status.offline and not m.bot:
            online += 1
    if online:
        state.online_count = online

    # Pick a default active channel (most recent text channel visible)
    preferred_id = _chat_channel_id()
    active_channel = None
    if preferred_id:
        active_channel = guild.get_channel(preferred_id)

    # If not explicitly configured, try to find a minecraft/chat-like channel
    if active_channel is None:
        keywords = ["minecraft", "mc-chat", "mc_chat", "ingame", "in-game", "game-chat", "chat", "smp"]
        for kw in keywords:
            for ch in guild.text_channels:
                name_l = ch.name.lower()
                if kw in name_l:
                    active_channel = ch
                    break
            if active_channel is not None:
                break

    channels_info = []
    for ch in guild.text_channels:
        channels_info.append({"id": str(ch.id), "name": ch.name})
        if active_channel is None:
            active_channel = ch
    state.channels = channels_info

    if active_channel is not None:
        state.active_channel_id = active_channel.id
        state.active_channel_name = active_channel.name
        # Prime the cache with recent messages
        try:
            recent = []
            async for msg in active_channel.history(limit=25):
                recent.append(_format_message(msg))
            recent.reverse()
            state.chat_messages.clear()
            state.chat_messages.extend(recent)
        except Exception as e:  # noqa: BLE001
            logger.warning("Failed to load history from #%s: %s", active_channel.name, e)

    state.last_sync = datetime.now(timezone.utc).isoformat()


def _format_message(msg: discord.Message) -> dict:
    author_name = msg.author.display_name or msg.author.name
    avatar = None
    try:
        avatar = str(msg.author.display_avatar.url) if msg.author.display_avatar else None
    except Exception:  # noqa: BLE001
        avatar = None
    content = msg.clean_content or ""
    if not content:
        if msg.attachments:
            content = f"[sent {len(msg.attachments)} attachment(s)]"
        elif msg.embeds:
            e = msg.embeds[0]
            content = e.title or e.description or "[embed]"
        elif msg.stickers:
            content = f"[sticker: {msg.stickers[0].name}]"
    return {
        "id": str(msg.id),
        "author": author_name,
        "avatar": avatar,
        "content": content,
        "bot": bool(msg.author.bot),
        "timestamp": msg.created_at.astimezone(timezone.utc).isoformat(),
        "channel": msg.channel.name if hasattr(msg.channel, "name") else "",
    }


def _parse_player_count(text: Optional[str]) -> Optional[int]:
    if not text:
        return None
    m = PLAYER_RE.search(text)
    if not m:
        return None
    try:
        return int(m.group(1))
    except ValueError:
        return None


async def _poll_widget() -> None:
    """Fetch Discord widget.json periodically — gives accurate online count
    even without Presence Intent, as long as widget is enabled on the guild."""
    gid = _guild_id()
    if not gid:
        return
    url = f"https://discord.com/api/guilds/{gid}/widget.json"
    async with aiohttp.ClientSession() as session:
        while not bot.is_closed():
            try:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as r:
                    if r.status == 200:
                        data = await r.json()
                        pc = data.get("presence_count")
                        if isinstance(pc, int) and pc > 0:
                            state.online_count = pc
                        if data.get("name") and not state.guild_name:
                            state.guild_name = data["name"]
            except Exception as e:  # noqa: BLE001
                logger.debug("Widget poll error: %s", e)
            await asyncio.sleep(45)


async def _poll_bot_status() -> None:
    """Periodically read the bot's own activity text to pull player count."""
    while not bot.is_closed():
        try:
            gid = _guild_id()
            me = None
            if gid:
                guild = bot.get_guild(gid)
                if guild:
                    me = guild.me
            if me and me.activities:
                activity = me.activities[0]
                text = getattr(activity, "name", None) or getattr(activity, "state", None)
                state.bot_status_text = text
                count = _parse_player_count(text)
                if count is not None:
                    state.players_online = count
        except Exception as e:  # noqa: BLE001
            logger.debug("Status poll error: %s", e)
        await asyncio.sleep(30)


# ---------------------------------------------------------------------------
# Discord events
# ---------------------------------------------------------------------------
@bot.event
async def on_ready() -> None:
    logger.info("Discord bot logged in as %s", bot.user)
    state.ready = True
    await _sync_guild()
    bot.loop.create_task(_poll_bot_status())
    bot.loop.create_task(_poll_widget())


@bot.event
async def on_message(msg: discord.Message) -> None:
    if not msg.guild:
        return
    if msg.guild.id != _guild_id():
        return
    if state.active_channel_id and msg.channel.id != state.active_channel_id:
        return
    state.chat_messages.append(_format_message(msg))


@bot.event
async def on_presence_update(before: discord.Member, after: discord.Member) -> None:
    # Keep online count roughly current
    if after.guild and after.guild.id == _guild_id():
        guild = after.guild
        online = sum(1 for m in guild.members if m.status != discord.Status.offline and not m.bot)
        if online:
            state.online_count = online


@bot.event
async def on_member_join(member: discord.Member) -> None:
    if member.guild.id == _guild_id():
        state.member_count = member.guild.member_count or state.member_count


@bot.event
async def on_member_remove(member: discord.Member) -> None:
    if member.guild.id == _guild_id():
        state.member_count = max(0, (member.guild.member_count or state.member_count))


# ---------------------------------------------------------------------------
# Runner used by FastAPI lifespan
# ---------------------------------------------------------------------------
_bot_task: Optional[asyncio.Task] = None


async def start_bot() -> None:
    token = os.environ.get("DISCORD_BOT_TOKEN")
    if not token:
        logger.warning("DISCORD_BOT_TOKEN not set; Discord bot disabled.")
        return
    global _bot_task

    async def _runner() -> None:
        try:
            await bot.start(token)
        except discord.LoginFailure as e:
            logger.error("Discord login failed: %s", e)
        except Exception as e:  # noqa: BLE001
            logger.exception("Discord bot crashed: %s", e)

    _bot_task = asyncio.create_task(_runner())


async def stop_bot() -> None:
    try:
        if not bot.is_closed():
            await bot.close()
    except Exception:  # noqa: BLE001
        pass
    if _bot_task:
        _bot_task.cancel()


async def send_web_message(content: str, nickname: str = "Anon") -> bool:
    """Send a message to the active chat channel on behalf of a website visitor.

    The message is prefixed so Discord moderators can identify it as coming
    from the website (not from an in-game player).
    """
    if not state.ready or not state.active_channel_id:
        return False
    safe_nick = re.sub(r"[^A-Za-z0-9_\- ]", "", nickname or "Anon").strip()[:16] or "Anon"
    formatted = f"**[Web · {safe_nick}]** {content}"
    try:
        channel = bot.get_channel(state.active_channel_id)
        if channel is None:
            return False
        await channel.send(formatted, allowed_mentions=discord.AllowedMentions.none())
        return True
    except Exception as e:  # noqa: BLE001
        logger.warning("send_web_message failed: %s", e)
        return False


def get_recent_messages(limit: int = 20) -> list[dict]:
    msgs = list(state.chat_messages)[-limit:]
    return msgs


def get_public_state() -> dict:
    return state.to_public()
