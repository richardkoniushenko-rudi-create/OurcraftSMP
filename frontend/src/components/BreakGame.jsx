import { useEffect, useMemo, useState } from "react";
import { X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BreakGame
 * ---------
 * A small minigame: click (or drag) to break the grid of blocks and reveal
 * a Minecraft-themed image underneath. Uses the pickaxe cursor already
 * provided by <CustomCursor /> so the experience feels native.
 *
 * Props:
 *   open      - boolean, controls visibility
 *   onClose   - callback
 *   imageUrl  - reward image revealed beneath the grid
 */
const COLS = 8;
const ROWS = 6;
const BLOCK_TYPES = [
  // dirt / grass / stone palette
  { top: "#6bc34a", side: "#6b4a23", accent: "#5aa33d" }, // grass block
  { top: "#6b4a23", side: "#55391b", accent: "#7a5a2e" }, // dirt
  { top: "#8a8a8a", side: "#6a6a6a", accent: "#9a9a9a" }, // stone
  { top: "#6b4a23", side: "#55391b", accent: "#7a5a2e" }, // dirt
];

function pickPattern(i) {
  // stable per-cell pattern so each block looks slightly unique
  const t = BLOCK_TYPES[i % BLOCK_TYPES.length];
  return t;
}

export default function BreakGame({ open, onClose, imageUrl }) {
  const [broken, setBroken] = useState(() => Array(COLS * ROWS).fill(false));
  const [hits, setHits] = useState(() => Array(COLS * ROWS).fill(0));
  const [dragging, setDragging] = useState(false);

  const total = COLS * ROWS;
  const brokenCount = broken.filter(Boolean).length;
  const progress = Math.round((brokenCount / total) * 100);

  useEffect(() => {
    if (!open) {
      // reset state when closed
      setBroken(Array(total).fill(false));
      setHits(Array(total).fill(0));
    }
  }, [open, total]);

  useEffect(() => {
    const onUp = () => setDragging(false);
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  const hitBlock = (i) => {
    setBroken((prev) => {
      if (prev[i]) return prev;
      const nh = [...hits];
      nh[i] = (nh[i] || 0) + 1;
      setHits(nh);
      if (nh[i] >= 3) {
        const nb = [...prev];
        nb[i] = true;
        return nb;
      }
      return prev;
    });
  };

  const reset = () => {
    setBroken(Array(total).fill(false));
    setHits(Array(total).fill(0));
  };

  const won = brokenCount === total;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="break-game"
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="block-card p-4 md:p-6 max-w-3xl w-full bg-[#0d0d0f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="overline">Easter Egg · Minigame</div>
                <div className="font-pixel text-2xl md:text-3xl text-white leading-none mt-1">
                  {won ? "You found the secret!" : "Break the blocks"}
                </div>
                <div className="text-white/50 text-xs mt-1">
                  {won
                    ? "Screenshot this and share it in Discord 👀"
                    : "Click (or click-drag) to mine. 3 hits per block."}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  data-testid="break-reset"
                  onClick={reset}
                  className="block-btn-ghost !px-3 !py-2"
                  aria-label="Reset"
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  data-testid="break-close"
                  onClick={onClose}
                  className="block-btn !px-3 !py-2"
                  aria-label="Close"
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[#1a1a1d] mb-3">
              <div
                className="h-full bg-[#22c55e] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Arena */}
            <div
              className="relative w-full"
              style={{ aspectRatio: `${COLS} / ${ROWS}` }}
              onMouseLeave={() => setDragging(false)}
            >
              {/* Reward image */}
              <img
                src={imageUrl}
                alt="Hidden reward"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ imageRendering: "auto" }}
                draggable={false}
              />
              {/* Dark veil fading as progress increases */}
              <div
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: Math.max(0, 0.55 - progress / 250) }}
              />

              {/* Block grid */}
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                }}
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
              >
                {broken.map((isBroken, i) => (
                  <Block
                    key={i}
                    idx={i}
                    broken={isBroken}
                    hits={hits[i] || 0}
                    onHit={() => hitBlock(i)}
                    dragging={dragging}
                  />
                ))}
              </div>

              {won && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none"
                >
                  <div className="font-pixel text-3xl md:text-4xl text-[#22c55e] bg-black/70 px-4 py-2 border border-[#22c55e]/40 shadow-block">
                    +1 Diamond Achievement
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-white/50 font-accent uppercase tracking-wider">
              <span data-testid="break-progress">{brokenCount}/{total} blocks</span>
              <span>{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ idx, broken, hits, onHit, dragging }) {
  const t = useMemo(() => pickPattern(idx), [idx]);
  const [flash, setFlash] = useState(false);

  const trigger = () => {
    onHit();
    setFlash(true);
    setTimeout(() => setFlash(false), 140);
  };

  return (
    <button
      type="button"
      aria-label="Block"
      disabled={broken}
      onMouseDown={trigger}
      onMouseEnter={() => {
        if (dragging && !broken) trigger();
      }}
      className="relative select-none"
      style={{
        background: broken ? "transparent" : t.side,
        borderTop: broken ? "none" : `3px solid ${t.top}`,
        borderBottom: broken ? "none" : `2px solid #00000055`,
        borderRight: broken ? "none" : `2px solid #00000055`,
        borderLeft: broken ? "none" : `2px solid ${t.accent}`,
        transition: "opacity 120ms ease",
        opacity: broken ? 0 : 1,
        cursor: broken ? "default" : "inherit",
      }}
    >
      {/* noise texture */}
      {!broken && (
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${t.accent}55 1px, transparent 1px)`,
            backgroundSize: "4px 4px",
            opacity: 0.5,
          }}
        />
      )}
      {/* crack overlay */}
      {!broken && hits > 0 && (
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.75) 48% 52%, transparent 52%)," +
              "linear-gradient(-45deg, transparent 48%, rgba(0,0,0,0.6) 48% 52%, transparent 52%)",
            backgroundSize: hits === 1 ? "14px 14px" : "10px 10px",
            opacity: hits === 1 ? 0.35 : hits === 2 ? 0.75 : 1,
          }}
        />
      )}
      {/* flash */}
      {flash && (
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-white/30"
        />
      )}
    </button>
  );
}
