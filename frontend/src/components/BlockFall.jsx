import { useEffect, useRef } from "react";

/**
 * BlockFall
 * ---------
 * A low-cost ambient background: a handful of falling pixel "blocks" behind
 * the content. Pure canvas so it's GPU-friendly. Fixed-position, z-index -1,
 * pointer-events none — never interferes with anything.
 */
const BLOCK_COLORS = [
  "rgba(34,197,94,0.10)",   // grass
  "rgba(139,90,43,0.10)",   // dirt
  "rgba(100,116,139,0.10)", // stone
  "rgba(6,182,212,0.10)",   // diamond
  "rgba(245,158,11,0.10)",  // gold
];

export default function BlockFall({ density = 20 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let blocks = [];

    const rand = (a, b) => a + Math.random() * (b - a);

    const reset = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(6, Math.min(density, 40));
      blocks = new Array(count).fill(0).map(() => spawn(true));
    };

    const spawn = (initial = false) => ({
      x: rand(0, window.innerWidth),
      y: initial
        ? rand(-window.innerHeight, 0)
        : -rand(20, window.innerHeight),
      size: rand(14, 28),
      vy: rand(12, 38), // px/s
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.25, 0.25),
      color: BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)],
      opacity: rand(0.25, 0.55),
    });

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        b.y += b.vy * dt;
        b.rot += b.vr * dt;

        if (b.y - b.size > window.innerHeight) {
          blocks[i] = spawn(false);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = b.opacity;
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
        // 1px border for that pixel feel
        ctx.globalAlpha = b.opacity * 1.2;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };

    reset();
    window.addEventListener("resize", reset);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", reset);
      cancelAnimationFrame(raf);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
}
