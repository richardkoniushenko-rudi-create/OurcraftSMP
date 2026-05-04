"""
Relaxed chat filter for the website -> Discord webhook.
Drops the "must be a question" rule the user asked us to remove,
keeps only profanity blocking + length cap.
"""
from __future__ import annotations

import re
from typing import Tuple

_PROFANITY = [
    "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt",
    "pussy", "nigger", "nigga", "faggot", "fag", "retard", "retarded",
    "whore", "slut", "cock", "wank", "jerk off", "motherfucker",
    "kys", "kill yourself", "suicide", "rape", "rapist", "nazi", "hitler",
]

_REPLACEMENTS = str.maketrans({
    "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t",
    "@": "a", "$": "s", "!": "i",
})


def _normalise(text: str) -> str:
    t = text.lower().translate(_REPLACEMENTS)
    t = re.sub(r"[^a-z0-9 ?!'.,]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def _contains_profanity(text: str) -> bool:
    norm = _normalise(text)
    padded = " " + norm + " "
    return any((" " + w + " ") in padded for w in _PROFANITY)


def validate_message(content: str) -> Tuple[bool, str]:
    if not content or not isinstance(content, str):
        return False, "Message is empty."
    stripped = content.strip()
    if len(stripped) < 1:
        return False, "Message is empty."
    if len(stripped) > 300:
        return False, "Message is too long (max 300 characters)."
    if _contains_profanity(stripped):
        return False, "Your message contains language that isn't allowed here."
    return True, ""


ALLOWED_TOPICS_HINT = (
    "Chat freely about Ourcraft! Just keep it friendly — profanity is blocked."
)
