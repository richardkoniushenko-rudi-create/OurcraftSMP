import { useEffect, useRef, useState } from "react";

/**
 * Custom pixel cursor:
 * - Follows the mouse with a pickaxe PNG
 * - Rotates slightly on click (mousedown)
 * - Becomes bigger on interactive elements (buttons, links)
 * - Hidden on touch devices
 */
export default function CustomCursor() {
  const ref = useRef(null);
  const [pressing, setPressing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const render = () => {
      if (el) el.style.transform = `translate3d(${x - 16}px, ${y - 2}px, 0)`;
      raf = 0;
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) setVisible(true);
      if (!raf) raf = requestAnimationFrame(render);

      const target = e.target;
      const interactive =
        target?.closest?.(
          'a, button, [role="button"], .block-btn, .block-btn-ghost, summary, label, input[type="checkbox"], input[type="radio"], select, [data-cursor="pointer"]',
        );
      setHovering(!!interactive);
    };

    const onDown = () => setPressing(true);
    const onUp = () => setPressing(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
      if (raf) cancelAnimationFrame(raf);
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-testid="custom-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        width: 32,
        height: 32,
        opacity: visible ? 1 : 0,
        transition: "opacity 150ms ease",
      }}
    >
      <img
        src="/cursor-pickaxe.png"
        alt=""
        draggable={false}
        style={{
          width: hovering ? 38 : 32,
          height: hovering ? 38 : 32,
          imageRendering: "pixelated",
          transform: `rotate(${pressing ? -35 : hovering ? -8 : 0}deg) scale(${pressing ? 0.9 : 1})`,
          transformOrigin: "4px 4px",
          transition:
            "transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1.2), width 160ms ease, height 160ms ease",
          filter: pressing
            ? "drop-shadow(0 0 6px rgba(34, 197, 94, 0.9))"
            : "drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.6))",
        }}
      />
    </div>
  );
}
