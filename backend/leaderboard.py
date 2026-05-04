"""
Public leaderboards stored in MongoDB.
- Creeper Hunt high scores
- Egg-collection counts (built from egg_claims)
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

from eggs import is_valid_mc_username

logger = logging.getLogger("ourcraft.leaderboard")


async def submit_creeper_score(
    db: AsyncIOMotorDatabase,
    mc_username: str,
    score: int,
    ip: str,
) -> dict:
    if not is_valid_mc_username(mc_username):
        return {"ok": False, "reason": "Invalid Minecraft username (3–16 chars, letters/digits/_)."}
    if not isinstance(score, int) or score < 0 or score > 999:
        return {"ok": False, "reason": "Invalid score."}

    mc_lower = mc_username.strip().lower()
    existing = await db.creeper_scores.find_one(
        {"mc_username_lower": mc_lower}, {"_id": 0, "score": 1}
    )
    new_best = bool(not existing or score > (existing.get("score") or 0))
    if new_best:
        await db.creeper_scores.update_one(
            {"mc_username_lower": mc_lower},
            {
                "$set": {
                    "mc_username": mc_username.strip(),
                    "mc_username_lower": mc_lower,
                    "score": score,
                    "ip": ip,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            },
            upsert=True,
        )
    return {"ok": True, "new_best": new_best}


async def top_creeper_scores(db: AsyncIOMotorDatabase, limit: int = 20) -> List[dict]:
    cursor = db.creeper_scores.find({}, {"_id": 0, "ip": 0}).sort("score", -1).limit(limit)
    return [d async for d in cursor]


async def top_egg_collectors(db: AsyncIOMotorDatabase, limit: int = 20) -> List[dict]:
    pipeline = [
        {
            "$group": {
                "_id": "$mc_username_lower",
                "mc_username": {"$first": "$mc_username"},
                "count": {"$sum": 1},
                "rewards": {"$push": "$reward"},
                "last_claimed": {"$max": "$claimed_at"},
            }
        },
        {"$sort": {"count": -1, "last_claimed": 1}},
        {"$limit": limit},
        {
            "$project": {
                "_id": 0,
                "mc_username": 1,
                "count": 1,
                "rewards": 1,
                "last_claimed": 1,
            }
        },
    ]
    cursor = db.egg_claims.aggregate(pipeline)
    return [d async for d in cursor]
