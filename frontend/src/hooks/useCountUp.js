import { useEffect, useRef, useState } from "react";

/**
 * useCountUp
 * ----------
 * Animates a numeric value from its current rendered number up to `target`
 * over `duration` ms. Smoothly handles updates (e.g. when stats change
 * periodically we animate from current to new).
 */
export default function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof target !== "number" || Number.isNaN(target)) return;
    const start = prevRef.current;
    const delta = target - start;
    const t0 = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + delta * eased;
      setValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        prevRef.current = target;
      }
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
