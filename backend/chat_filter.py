"""
Chat content filter for /api/discord/send
-----------------------------------------
Strict filter:
  1. Profanity + slurs are rejected (not just censored — we refuse to forward them)
  2. Message must look like a question about the SMP
     (contains at least one allowed topic keyword / phrase)
  3. Length between 3 and 240 chars
"""
from __future__ import annotations

import re
from typing import Tuple

# Conservative profanity list. We do substring match with word boundaries.
_PROFANITY = [
    # mild → strong; leetspeak fallback handled by normalisation
    "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt",
    "pussy", "nigger", "nigga", "faggot", "fag", "retard", "retarded",
    "whore", "slut", "cock", "wank", "jerk off", "motherfucker",
    "kys", "kill yourself", "suicide", "rape", "rapist", "nazi", "hitler",
]

# Allowed topic keywords — message must contain at least one of these
# (or be a generic greeting / question form) to be forwarded.
_TOPIC_KEYWORDS = [
    # About the SMP
    "smp", "ourcraft", "server", "mod", "modpack", "datapack", "pack",
    "mc", "minecraft", "vanilla", "fabric", "forge",
    # Getting started
    "begin", "start", "starter", "starting", "newbie", "new here",
    "join", "joining", "how do i", "how to", "how can i",
    "download", "install", "ram", "allocate", "launcher",
    # Evaluating the server
    "worth", "should i", "should we", "recommend", "review", "opinion",
    "what do you", "what do u", "what do ya", "whats", "what's",
    "like about", "love about", "cool", "fun", "best", "favorite",
    "favourite", "good", "awesome",
    # Community
    "player", "players", "community", "friends", "staff", "mod team",
    "rules", "event", "events", "discord",
    # Q words
    "help", "question", "?", "hello", "hi ", "hey", "hey!", "hiya",
    "gm", "good morning", "gn", "good night",
]

_REPLACEMENTS = str.maketrans({
    "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t",
    "@": "a", "$": "s", "!": "i",
})


def _normalise(text: str) -> str:
    t = text.lower()
    t = t.translate(_REPLACEMENTS)
    t = re.sub(r"[^a-z0-9 ?!'.,]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def _contains_profanity(text: str) -> bool:
    norm = _normalise(text)
    padded = " " + norm + " "
    for word in _PROFANITY:
        pattern = " " + word + " "
        if pattern in padded:
            return True
    return False


def _has_allowed_topic(text: str) -> bool:
    norm = _normalise(text)
    if not norm:
        return False
    for kw in _TOPIC_KEYWORDS:
        if kw in norm:
            return True
    return False


def validate_message(content: str) -> Tuple[bool, str]:
    """Returns (is_ok, reason). reason is '' when ok."""
    if not content or not isinstance(content, str):
        return False, "Message is empty."
    stripped = content.strip()
    if len(stripped) < 3:
        return False, "Message is too short."
    if len(stripped) > 240:
        return False, "Message is too long (max 240 characters)."
    if _contains_profanity(stripped):
        return False, "Your message contains language that isn't allowed here."
    if not _has_allowed_topic(stripped):
        return (
            False,
            "Please keep it to questions about the SMP — how to join, what's cool here, whether it's worth joining, etc.",
        )
    return True, ""


ALLOWED_TOPICS_HINT = (
    "You can ask: what's cool about this SMP · how to begin · is it worth joining · "
    "what mods are in the pack · server rules · events · anything Ourcraft-related."
)
