import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BreakGame from "./BreakGame";
import { HERO_BG } from "../constants";

/**
 * Collection of site-wide Minecraft easter eggs:
 *
 *   1. Konami code  ↑ ↑ ↓ ↓ ← → ← → B A   → opens the block-breaking minigame
 *   2. Type "diamond" anywhere on the keyboard  → flashes diamond toast
 *   3. Type "creeper" anywhere on the keyboard  → creeper hiss + shake screen
 *   4. /secret in URL hash (#secret)           → opens the minigame directly
 *   5. Konami also gets a surprise
 *
 * This component is mounted once at the app root and listens globally.
 */
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function playHiss() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!window.__ourcraftAudio) window.__ourcraftAudio = new Ctx();
    const ctx = window.__ourcraftAudio;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    // Fizzling noise
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.9, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.95);

    // Boom!
    setTimeout(() => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.35);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    }, 900);
  } catch {
    /* ignore */
  }
}

function shakeBody() {
  const el = document.body;
  el.style.transition = "transform 60ms";
  let t = 0;
  const id = setInterval(() => {
    t++;
    if (t > 20) {
      el.style.transform = "";
      clearInterval(id);
      return;
    }
    const dx = (Math.random() - 0.5) * 8;
    const dy = (Math.random() - 0.5) * 8;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, 60);
}

export default function EasterEggs() {
  const [gameOpen, setGameOpen] = useState(false);
  const konamiIdx = useRef(0);
  const typedRef = useRef("");

  useEffect(() => {
    const onKey = (e) => {
      // Ignore typing inside inputs
      const target = e.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Konami
      const expected = KONAMI[konamiIdx.current];
      if (
        e.key === expected ||
        (expected.length === 1 && e.key.toLowerCase() === expected)
      ) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          toast.success("You unlocked the secret minigame! ⛏", {
            description: "Break the blocks to reveal a hidden image.",
          });
          setGameOpen(true);
        }
      } else {
        konamiIdx.current = 0;
      }

      // Typed sequence buffer
      if (e.key.length === 1) {
        typedRef.current = (typedRef.current + e.key.toLowerCase()).slice(-12);
        if (typedRef.current.includes("diamond")) {
          typedRef.current = "";
          toast("💎 Diamond found!", {
            description: "Pssst… try the Konami code for a secret.",
          });
        } else if (typedRef.current.includes("creeper")) {
          typedRef.current = "";
          toast("Ssssss…");
          playHiss();
          shakeBody();
        } else if (typedRef.current.includes("secret")) {
          typedRef.current = "";
          setGameOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // URL hash #secret or #minigame opens the game
  useEffect(() => {
    const check = () => {
      if (["#secret", "#minigame", "#break"].includes(window.location.hash)) {
        setGameOpen(true);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  // Expose globally so the logo can trigger it too
  useEffect(() => {
    window.__openOurcraftGame = () => setGameOpen(true);
    return () => {
      delete window.__openOurcraftGame;
    };
  }, []);

  return (
    <BreakGame
      open={gameOpen}
      onClose={() => setGameOpen(false)}
      imageUrl={HERO_BG}
    />
  );
}
