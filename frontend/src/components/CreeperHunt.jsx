import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import axios from "axios";
import Confetti from "./Confetti";
import { toast } from "sonner";
import { API } from "../lib/api";

/**
 * CreeperHunt — a small "whack-a-mole" style minigame embedded at the bottom
 * of the site. Creepers pop up from a 4×3 grid; tap them before they hiss away.
 * Reach 10 hits in 30 s to win and trigger a confetti shower.
 */
const COLS = 4;
const ROWS = 3;
const CELLS = COLS * ROWS;
const GAME_DURATION = 45;
const WIN_SCORE = 12;

const STORAGE_BEST = "ourcraft.game.best";

function randInt(n) {
  return Math.floor(Math.random() * n);
}

export default function CreeperHunt() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [active, setActive] = useState(-1);
  const [won, setWon] = useState(false);
  const [lastHit, setLastHit] = useState({ idx: -1, key: 0 });
  const confettiRef = useRef(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_BEST);
      if (saved) setBest(parseInt(saved, 10) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setActive(-1);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);

  useEffect(() => {
    if (!running) return;
    const pop = () => {
      let next = randInt(CELLS);
      if (next === active) next = (next + 1) % CELLS;
      setActive(next);
    };
    pop();
    // Speed ramps from 1600ms (very slow) at start to 230ms (frantic) at end
    const progress = 1 - timeLeft / GAME_DURATION;
    // ease-in cubic so the speed-up feels dramatic in the last 10 seconds
    const eased = progress * progress * progress;
    const interval = Math.max(230, Math.round(1600 - eased * 1370));
    const id = setInterval(pop, interval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, active, timeLeft]);

  useEffect(() => {
    if (!running && score > 0 && score >= WIN_SCORE && !won) {
      setWon(true);
      confettiRef.current?.fireFromBottom?.(200);
      toast.success("You beat the Creeper Hunt! 🎉", {
        description: `Score: ${score} · Best: ${Math.max(best, score)}`,
      });
      try {
        const newBest = Math.max(best, score);
        window.localStorage.setItem(STORAGE_BEST, String(newBest));
        setBest(newBest);
      } catch {
        /* ignore */
      }
    }
    if (!running && score > 0 && timeLeft <= 0 && !won) {
      // Game finished but didn't hit win score — still offer to submit
      try {
        const newBest = Math.max(best, score);
        window.localStorage.setItem(STORAGE_BEST, String(newBest));
        setBest(newBest);
      } catch {
        /* ignore */
      }
    }
  }, [running, score, won, best, timeLeft]);

  const submitScore = async () => {
    const username = window.prompt(
      "Enter your Minecraft Java username to submit your score to the public leaderboard:",
    );
    if (!username) return;
    try {
      const r = await axios.post(`${API}/leaderboard/creeper`, {
        mc_username: username.trim(),
        score,
      });
      if (r.data?.ok) {
        toast.success(
          r.data.new_best
            ? `New personal best on the leaderboard!`
            : `Score recorded — your previous best is higher.`,
        );
      } else {
        toast.error(r.data?.reason || "Could not submit score.");
      }
    } catch {
      toast.error("Could not reach the server.");
    }
  };

  const start = () => {
    setWon(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActive(-1);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setWon(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActive(-1);
  };

  const hit = (i, e) => {
    if (!running || i !== active) return;
    setScore((s) => {
      const ns = s + 1;
      // Persist best continuously
      if (ns > best) {
        try {
          window.localStorage.setItem(STORAGE_BEST, String(ns));
        } catch {
          /* ignore */
        }
        setBest(ns);
      }
      return ns;
    });
    setLastHit({ idx: i, key: Date.now() });
    // Confetti burst at the click location
    const rect = e.currentTarget.getBoundingClientRect();
    confettiRef.current?.fire?.({
      origin: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
      count: 24,
      power: 380,
    });
    setActive(-1);
  };

  return (
    <section
      data-testid="creeper-hunt"
      id="minigame"
      className="section-pad pt-6 pb-24"
    >
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Minigame</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-start">
          <div>
            <h2 className="font-pixel text-4xl md:text-5xl text-white">
              Creeper <span className="text-[#22c55e]">Hunt</span>
            </h2>
            <p className="text-white/60 mt-2 max-w-xl">
              Click the creeper before it hisses away. Hit {WIN_SCORE} in{" "}
              {GAME_DURATION} seconds to win a fireworks display. Your best
              score is saved on this device.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Stat label="Time" value={`${timeLeft}s`} />
              <Stat label="Score" value={score} />
              <Stat label="Best" value={best} color="#06b6d4" />
              <Stat label="Target" value={WIN_SCORE} color="#f59e0b" />
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              {!running && (
                <button
                  data-testid="minigame-start"
                  onClick={start}
                  className="block-btn"
                >
                  <Sparkles size={14} /> {won || score > 0 ? "Play again" : "Start"}
                </button>
              )}
              {!running && score > 0 && (
                <button
                  data-testid="minigame-submit"
                  onClick={submitScore}
                  className="block-btn-ghost"
                >
                  Submit to Leaderboard
                </button>
              )}
              <button
                data-testid="minigame-reset"
                onClick={reset}
                className="block-btn-ghost"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {won && (
              <div className="mt-5 block-card p-4 bg-gradient-to-br from-[#22c55e]/5 to-transparent">
                <div className="font-pixel text-2xl text-[#22c55e]">
                  + Diamond Achievement
                </div>
                <div className="text-white/60 text-sm mt-1">
                  Share your score in Discord — bragging rights unlocked.
                </div>
              </div>
            )}
          </div>

          <div
            className="block-card p-4 bg-[#0b0b0d] select-none"
            style={{ aspectRatio: `${COLS} / ${ROWS}` }}
          >
            <div
              className="grid gap-2 h-full"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              }}
            >
              {Array.from({ length: CELLS }, (_, i) => (
                <Hole
                  key={i}
                  idx={i}
                  active={running && i === active}
                  onHit={(e) => hit(i, e)}
                  lastHit={lastHit.idx === i ? lastHit.key : 0}
                  running={running}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Confetti ref={confettiRef} />
    </section>
  );
}

function Stat({ label, value, color = "#22c55e" }) {
  return (
    <div className="block-card px-4 py-3">
      <div
        className="font-accent text-[10px] uppercase tracking-[0.2em]"
        style={{ color }}
      >
        {label}
      </div>
      <div className="font-pixel text-2xl text-white leading-none mt-1">
        {value}
      </div>
    </div>
  );
}

function Hole({ idx, active, onHit, lastHit, running }) {
  return (
    <button
      type="button"
      data-testid={`hole-${idx}`}
      onMouseDown={onHit}
      className="relative overflow-hidden flex items-center justify-center border-2 transition-colors"
      style={{
        background: "#1a1a1d",
        borderColor: active ? "#22c55e" : "rgba(255,255,255,0.08)",
        borderRadius: 2,
      }}
    >
      {/* grass top when inactive */}
      {!active && (
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: "#22c55e", opacity: 0.5 }}
          aria-hidden
        />
      )}
      {active && <CreeperFace hit={lastHit} />}
      {!running && (
        <span className="font-accent text-[9px] uppercase tracking-[0.2em] text-white/20">
          rest
        </span>
      )}
    </button>
  );
}

/** Small pixel creeper face drawn with divs for a cheap sprite */
function CreeperFace({ hit }) {
  return (
    <motion.div
      key={hit || "face"}
      initial={{ scale: 0.5, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
      className="relative w-[68%] h-[68%]"
      style={{
        background: "#3ea04b",
        boxShadow: "inset 4px -4px 0 rgba(0,0,0,0.18)",
      }}
    >
      {/* eyes */}
      <div className="absolute left-[18%] top-[25%] w-[18%] h-[20%] bg-black" />
      <div className="absolute right-[18%] top-[25%] w-[18%] h-[20%] bg-black" />
      {/* mouth */}
      <div className="absolute left-[32%] top-[52%] w-[36%] h-[14%] bg-black" />
      <div className="absolute left-[22%] top-[66%] w-[18%] h-[22%] bg-black" />
      <div className="absolute right-[22%] top-[66%] w-[18%] h-[22%] bg-black" />
    </motion.div>
  );
}
