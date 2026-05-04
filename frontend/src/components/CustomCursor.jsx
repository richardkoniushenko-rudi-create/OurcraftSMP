import { useEffect, useRef, useState } from "react";

/**
 * Custom pixel cursor:
 * - Diamond pickaxe PNG follows the mouse
 * - Rotates & plays "thunk" sound on click (Web Audio - no file needed)
 * - Scales up on interactive elements
 * - Disabled on touch devices
 */

function playThunk() {
  try {
    // Lazy create AudioContext, reuse across clicks
    if (!window.__ourcraftAudio) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      window.__ourcraftAudio = new Ctx();
    }
    const ctx = window.__ourcraftAudio;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const now = ctx.currentTime;

    // Noise burst (the "thunk" attack)
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 800;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.15);

    // Low thump (body)
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {
    /* silent */
  }
}

export default function CustomCursor() {
  const ref = useRef(null);
  const [pressing, setPressing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const render = () => {
      if (el) el.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      raf = 0;
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) setVisible(true);
      if (!raf) raf = requestAnimationFrame(render);

      const target = e.target;
      const interactive = target?.closest?.(
        'a, button, [role="button"], .block-btn, .block-btn-ghost, summary, label, input[type="checkbox"], input[type="radio"], select, [data-cursor="pointer"]',
      );
      setHovering(!!interactive);
    };

    const onDown = () => {
      setPressing(true);
      playThunk();
    };
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
          width: hovering ? 40 : 32,
          height: hovering ? 40 : 32,
          imageRendering: "pixelated",
          transform: `rotate(${pressing ? -35 : hovering ? -10 : 0}deg) scale(${pressing ? 0.85 : 1})`,
          transformOrigin: "6px 6px",
          transition:
            "transform 110ms cubic-bezier(0.2, 0.8, 0.2, 1.3), width 180ms ease, height 180ms ease, filter 150ms ease",
          filter: pressing
            ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.95))"
            : "drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.55))",
        }}
      />
    </div>
  );
}
