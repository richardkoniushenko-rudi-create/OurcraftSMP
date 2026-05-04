from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, Query, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from discord_bot import (  # noqa: E402
    start_bot,
    stop_bot,
    get_public_state,
    get_recent_messages,
)
from chat_filter import validate_message, ALLOWED_TOPICS_HINT  # noqa: E402
from eggs import EGGS, claim_egg, send_chat_webhook, is_valid_mc_username  # noqa: E402

# MongoDB
mongo_url = os.environ["MONGO_URL"]
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ["DB_NAME"]]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await start_bot()
    try:
        yield
    finally:
        await stop_bot()
        mongo_client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class ServerInfo(BaseModel):
    name: str
    tagline: str
    ip: str
    version: str
    modpack: str
    max_players: int
    management_panel_url: str
    discord_invite_url: str
    gamemode: str
    uptime: str
    cpu: str
    ram: str


class ServerStatus(BaseModel):
    online: bool
    players_online: int
    max_players: int
    discord_online: int
    discord_members: int
    bot_ready: bool
    bot_status_text: Optional[str] = None
    last_sync: Optional[str] = None


class ChatMessage(BaseModel):
    id: str
    author: str
    avatar: Optional[str] = None
    content: str
    bot: bool
    timestamp: str
    channel: str


class ChannelListItem(BaseModel):
    id: str
    name: str


class SendMessageIn(BaseModel):
    content: str
    nickname: Optional[str] = "Anon"
    avatar_url: Optional[str] = None


class SendMessageOut(BaseModel):
    sent: bool
    reason: Optional[str] = None
    hint: Optional[str] = None


class ClaimEggIn(BaseModel):
    egg_id: str
    mc_username: str


class ClaimEggOut(BaseModel):
    ok: bool
    reward: Optional[str] = None
    reason: Optional[str] = None
    already_claimed: Optional[bool] = None


class EggInfo(BaseModel):
    id: str
    name: str
    reward: str
    emoji: str
    hint: str


class DiscordInfo(BaseModel):
    guild_name: Optional[str]
    guild_icon: Optional[str]
    member_count: int
    online_count: int
    invite_url: str
    active_channel_name: Optional[str] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Ourcraft SMP API"}


@api_router.get("/server/info", response_model=ServerInfo)
async def server_info():
    return ServerInfo(
        name="Ourcraft SMP",
        tagline="Modded Survival with Custom Terrain & Structures",
        ip=os.environ.get("MINECRAFT_SERVER_IP", "play.ourcraft.online"),
        version=os.environ.get("MINECRAFT_VERSION", "1.21.1"),
        modpack=os.environ.get("MINECRAFT_MODPACK", "Mounts of Mayhem"),
        max_players=int(os.environ.get("MINECRAFT_MAX_PLAYERS", "200")),
        management_panel_url=os.environ.get(
            "MANAGEMENT_PANEL_URL", "https://management_panel.mcboost.online/"
        ),
        discord_invite_url=os.environ.get(
            "DISCORD_INVITE_URL", "https://discord.gg/pFj6mZubVu"
        ),
        gamemode="Survival (SMP)",
        uptime="99.9%",
        cpu=os.environ.get("SERVER_CPU", "AMD Ryzen 7 6800H"),
        ram=os.environ.get("SERVER_RAM", "32 GB DDR5"),
    )


@api_router.get("/server/status", response_model=ServerStatus)
async def server_status():
    s = get_public_state()
    bot_ready = bool(s.get("ready", False))
    return ServerStatus(
        online=bot_ready,
        players_online=int(s.get("players_online", 0) or 0),
        max_players=int(os.environ.get("MINECRAFT_MAX_PLAYERS", "200")),
        discord_online=int(s.get("online_count", 0) or 0),
        discord_members=int(s.get("member_count", 0) or 0),
        bot_ready=bool(s.get("ready", False)),
        bot_status_text=s.get("bot_status_text"),
        last_sync=s.get("last_sync"),
    )


@api_router.get("/discord/info", response_model=DiscordInfo)
async def discord_info():
    s = get_public_state()
    return DiscordInfo(
        guild_name=s.get("guild_name"),
        guild_icon=s.get("guild_icon"),
        member_count=int(s.get("member_count", 0) or 0),
        online_count=int(s.get("online_count", 0) or 0),
        invite_url=os.environ.get("DISCORD_INVITE_URL", "https://discord.gg/pFj6mZubVu"),
        active_channel_name=s.get("active_channel_name"),
    )


@api_router.get("/discord/channels", response_model=List[ChannelListItem])
async def discord_channels():
    from discord_bot import state as bot_state  # noqa: WPS433
    return [ChannelListItem(**c) for c in bot_state.channels]


@api_router.get("/discord/chat", response_model=List[ChatMessage])
async def discord_chat(limit: int = Query(20, ge=1, le=50)):
    return get_recent_messages(limit)


# Rate limiting: per-IP cooldown
_last_sent: dict = {}
_COOLDOWN_SECONDS = 15


@api_router.post("/discord/send", response_model=SendMessageOut)
async def discord_send(payload: SendMessageIn, request: Request):
    from time import monotonic

    client_ip = request.client.host if request.client else "unknown"
    now = monotonic()
    last = _last_sent.get(client_ip, 0)
    if now - last < _COOLDOWN_SECONDS:
        wait = int(_COOLDOWN_SECONDS - (now - last))
        return SendMessageOut(
            sent=False,
            reason=f"Please wait {wait}s before sending another message.",
            hint=ALLOWED_TOPICS_HINT,
        )

    ok, reason = validate_message(payload.content)
    if not ok:
        return SendMessageOut(sent=False, reason=reason, hint=ALLOWED_TOPICS_HINT)

    sent = await send_chat_webhook(
        payload.content.strip(),
        payload.nickname or "Anon",
        payload.avatar_url,
    )
    if not sent:
        return SendMessageOut(
            sent=False,
            reason="Chat webhook isn't configured — try again in a moment.",
            hint=ALLOWED_TOPICS_HINT,
        )
    _last_sent[client_ip] = now
    return SendMessageOut(sent=True, hint=ALLOWED_TOPICS_HINT)


@api_router.get("/easter/eggs", response_model=List[EggInfo])
async def list_eggs():
    return [
        EggInfo(id=k, name=v["name"], reward=v["reward"], emoji=v["emoji"], hint=v["hint"])
        for k, v in EGGS.items()
    ]


@api_router.post("/easter/claim", response_model=ClaimEggOut)
async def claim_easter_egg(payload: ClaimEggIn, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    result = await claim_egg(db, payload.egg_id, payload.mc_username, client_ip)
    return ClaimEggOut(**result)


@api_router.get("/easter/check/{egg_id}")
async def check_egg_claimed(egg_id: str, request: Request):
    """Has this IP already claimed this egg? Frontend uses this to disable
    the claim button if the user already unlocked it."""
    client_ip = request.client.host if request.client else "unknown"
    found = await db.egg_claims.find_one(
        {"egg_id": egg_id, "ip": client_ip}, {"_id": 0}
    )
    return {"claimed": bool(found)}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
