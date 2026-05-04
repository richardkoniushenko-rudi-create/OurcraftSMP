/**
 * Canvas-based pixel confetti/sprinkles burst.
 * Call `fire()` from the parent; particles settle and fade automatically.
 *
 * Usage:
 *   const confettiRef = useRef();
 *   <Confetti ref={confettiRef} />
 *   // later:
 *   confettiRef.current.fire({ origin: {x: 500, y: 400} });
 */
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const COLORS = [
  "#22c55e", "#06b6d4", "#f59e0b", "#ec4899",
  "#a78bfa", "#ef4444", "#fb923c", "#ffffff",
];

const Confetti = forwardRef(function Confetti(_, ref) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const fit = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const tick = (now) => {
      const dt = Math.min(0.033, (now - (lastTimeRef.current || now)) / 1000);
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const live = [];
      for (const p of particlesRef.current) {
        p.vy += 260 * dt; // gravity
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.life -= dt;
        if (p.life <= 0 || p.y > window.innerHeight + 40) continue;

        const alpha = Math.min(1, p.life / 0.7);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        live.push(p);
      }
      particlesRef.current = live;

      if (live.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    // Expose via ref
    ref.current = {
      fire(opts = {}) {
        const { origin, count = 80, spread = Math.PI * 1.5, power = 520 } = opts;
        const ox = origin?.x ?? window.innerWidth / 2;
        const oy = origin?.y ?? window.innerHeight / 2;
        for (let i = 0; i < count; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
          const speed = power * (0.5 + Math.random() * 0.7);
          particlesRef.current.push({
            x: ox,
            y: oy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 10,
            size: 6 + Math.random() * 8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 1.6 + Math.random() * 1.2,
          });
        }
        if (!rafRef.current) {
          lastTimeRef.current = 0;
          rafRef.current = requestAnimationFrame(tick);
        }
      },
      fireFromBottom(count = 160) {
        // Two fountains from the bottom corners
        this.fire({
          origin: { x: window.innerWidth * 0.2, y: window.innerHeight + 20 },
          count: count / 2,
          spread: Math.PI * 0.9,
          power: 720,
        });
        this.fire({
          origin: { x: window.innerWidth * 0.8, y: window.innerHeight + 20 },
          count: count / 2,
          spread: Math.PI * 0.9,
          power: 720,
        });
      },
    };

    return () => {
      window.removeEventListener("resize", fit);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ref]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 300,
      }}
    />
  );
});

export default Confetti;
