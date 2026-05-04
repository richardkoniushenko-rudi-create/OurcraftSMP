/**
 * Embeddable version of the block-break reveal minigame.
 * A smaller, inline variant suitable for the /minigames subpage
 * (while the modal version at <BreakGame /> remains for easter eggs).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Confetti from "./Confetti";
import { toast } from "sonner";

const COLS = 10;
const ROWS = 6;

const BLOCK_TYPES = [
  { top: "#6bc34a", side: "#6b4a23", accent: "#5aa33d" },
  { top: "#6b4a23", side: "#55391b", accent: "#7a5a2e" },
  { top: "#8a8a8a", side: "#6a6a6a", accent: "#9a9a9a" },
];

function pickPattern(i) {
  return BLOCK_TYPES[i % BLOCK_TYPES.length];
}

export default function BlockBreakInline({ imageUrl, title, caption }) {
  const total = COLS * ROWS;
  const [broken, setBroken] = useState(() => Array(total).fill(false));
  const [hits, setHits] = useState(() => Array(total).fill(0));
  const [dragging, setDragging] = useState(false);
  const brokenCount = broken.filter(Boolean).length;
  const progress = Math.round((brokenCount / total) * 100);
  const won = brokenCount === total;
  const confettiRef = useRef(null);
  const wonRef = useRef(false);

  useEffect(() => {
    if (won && !wonRef.current) {
      wonRef.current = true;
      confettiRef.current?.fireFromBottom?.(180);
      toast.success(`You uncovered: ${title}`, {
        description: "Bragging rights unlocked.",
      });
    }
    if (!won && wonRef.current) wonRef.current = false;
  }, [won, title]);

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
    wonRef.current = false;
  };

  return (
    <div data-testid="block-break-inline" className="block-card p-4 md:p-5 bg-[#0b0b0d]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="overline">{title}</div>
          <div className="font-pixel text-2xl text-white mt-1">
            Break to reveal
          </div>
          <div className="text-xs text-white/50 mt-1">
            {caption || "Click or drag. 3 hits per block."}
          </div>
        </div>
        <button
          data-testid="bb-reset"
          onClick={reset}
          className="block-btn-ghost !px-3 !py-2"
          title="Reset"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="h-2 bg-[#1a1a1d] mb-3">
        <div
          className="h-full bg-[#22c55e] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="relative w-full"
        style={{ aspectRatio: `${COLS} / ${ROWS}` }}
        onMouseLeave={() => setDragging(false)}
      >
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: Math.max(0, 0.5 - progress / 300) }}
        />
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
            <BBlock
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none"
          >
            <div className="font-pixel text-xl md:text-2xl text-[#22c55e] bg-black/70 px-3 py-1.5 border border-[#22c55e]/40 shadow-block">
              Revealed!
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-white/50 font-accent uppercase tracking-wider">
        <span data-testid="bb-progress">
          {brokenCount}/{total} blocks
        </span>
        <span>{progress}%</span>
      </div>
      <Confetti ref={confettiRef} />
    </div>
  );
}

function BBlock({ idx, broken, hits, onHit, dragging }) {
  const t = useMemo(() => pickPattern(idx), [idx]);
  return (
    <button
      type="button"
      aria-label="Block"
      disabled={broken}
      onMouseDown={onHit}
      onMouseEnter={() => {
        if (dragging && !broken) onHit();
      }}
      className="relative select-none"
      style={{
        background: broken ? "transparent" : t.side,
        borderTop: broken ? "none" : `3px solid ${t.top}`,
        borderBottom: broken ? "none" : `2px solid #00000055`,
        borderRight: broken ? "none" : `2px solid #00000055`,
        borderLeft: broken ? "none" : `2px solid ${t.accent}`,
        opacity: broken ? 0 : 1,
        transition: "opacity 120ms",
      }}
    >
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
    </button>
  );
}
