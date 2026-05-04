"""
Easter-egg system:
 - A static registry of eggs (id, name, reward, description)
 - Claim flow: validates that this IP + MC username hasn't already claimed the egg
 - Sends a webhook message to the admin channel on successful claim
 - MC username validation (Minecraft Java allows 3-16 chars, letters/digits/underscore)
"""
from __future__ import annotations

import os
import re
import logging
from datetime import datetime, timezone
from typing import Optional

import aiohttp
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger("ourcraft.eggs")


EGGS = {
    "hero_creeper": {
        "name": "Hidden Creeper",
        "reward": "Stack of Oak Logs",
        "emoji": "🟩",
        "hint": "Peeking from a dark corner of the hero.",
    },
    "live_diamond": {
        "name": "Rogue Diamond",
        "reward": "3x Diamonds",
        "emoji": "💎",
        "hint": "Someone buried a diamond inside the live-status cards.",
    },
    "gallery_ruby": {
        "name": "Lost Ruby",
        "reward": "1x Netherite Ingot",
        "emoji": "💍",
        "hint": "A ruby is wedged between gallery tiles.",
    },
    "mods_golden_apple": {
        "name": "Golden Apple",
        "reward": "1x Enchanted Golden Apple",
        "emoji": "🍏",
        "hint": "Hiding on the mods page — taste of glitter.",
    },
    "footer_emerald": {
        "name": "Emerald Shard",
        "reward": "Stack of Emeralds",
        "emoji": "🟢",
        "hint": "A shard is glued somewhere in the footer.",
    },
    "minigame_diamond_pickaxe": {
        "name": "Legendary Diamond Pickaxe",
        "reward": "Diamond Pickaxe (Efficiency V, Unbreaking III)",
        "emoji": "⛏",
        "hint": "Only earned by winning a minigame at full speed.",
    },
}


MC_USERNAME_RE = re.compile(r"^[A-Za-z0-9_]{3,16}$")


def is_valid_mc_username(username: str) -> bool:
    return bool(username) and bool(MC_USERNAME_RE.match(username.strip()))


async def claim_egg(
    db: AsyncIOMotorDatabase,
    egg_id: str,
    mc_username: str,
    ip: str,
) -> dict:
    """
    Returns dict: { ok: bool, reason?: str, reward?: str, already_claimed?: bool }
    Once an (egg_id, mc_username) OR (egg_id, ip) combination exists, it's blocked.
    """
    egg = EGGS.get(egg_id)
    if not egg:
        return {"ok": False, "reason": "Unknown easter egg."}
    if not is_valid_mc_username(mc_username):
        return {
            "ok": False,
            "reason": "Please enter a valid Minecraft Java username (3–16 chars, letters/digits/_).",
        }

    mc_lower = mc_username.strip().lower()

    # Check by username OR ip
    existing = await db.egg_claims.find_one(
        {
            "egg_id": egg_id,
            "$or": [{"mc_username_lower": mc_lower}, {"ip": ip}],
        },
        {"_id": 0},
    )
    if existing:
        return {
            "ok": False,
            "already_claimed": True,
            "reason": "This egg has already been claimed from this account or device.",
        }

    claim_doc = {
        "egg_id": egg_id,
        "mc_username": mc_username.strip(),
        "mc_username_lower": mc_lower,
        "ip": ip,
        "reward": egg["reward"],
        "claimed_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        await db.egg_claims.insert_one(claim_doc)
    except Exception as e:  # noqa: BLE001
        logger.warning("egg_claims insert failed: %s", e)
        return {"ok": False, "reason": "Could not save claim, try again."}

    webhook_url = os.environ.get("DISCORD_ADMIN_WEBHOOK_URL", "").strip()
    if webhook_url:
        try:
            payload = {
                "username": "Ourcraft Easter Egg",
                "embeds": [
                    {
                        "title": f"{egg['emoji']} {egg['name']} claimed!",
                        "description": (
                            f"**Player:** `{mc_username.strip()}`\n"
                            f"**Reward:** {egg['reward']}\n"
                            f"**Egg:** `{egg_id}`\n"
                            f"**IP:** `{ip}`"
                        ),
                        "color": 0x22C55E,
                        "timestamp": claim_doc["claimed_at"],
                    }
                ],
            }
            async with aiohttp.ClientSession() as sess:
                await sess.post(webhook_url, json=payload, timeout=aiohttp.ClientTimeout(total=10))
        except Exception as e:  # noqa: BLE001
            logger.warning("admin webhook failed: %s", e)

    return {"ok": True, "reward": egg["reward"]}


async def send_chat_webhook(
    content: str,
    username: str,
    avatar_url: Optional[str] = None,
) -> bool:
    """Post a message to the configured chat webhook as the given visitor."""
    url = os.environ.get("DISCORD_CHAT_WEBHOOK_URL", "").strip()
    if not url:
        return False
    payload = {
        "username": f"[Web] {username}"[:80],
        "content": content[:300],
        "allowed_mentions": {"parse": []},
    }
    if avatar_url:
        payload["avatar_url"] = avatar_url
    try:
        async with aiohttp.ClientSession() as sess:
            async with sess.post(
                url, json=payload, timeout=aiohttp.ClientTimeout(total=10)
            ) as r:
                return 200 <= r.status < 300
    except Exception as e:  # noqa: BLE001
        logger.warning("chat webhook failed: %s", e)
        return False
