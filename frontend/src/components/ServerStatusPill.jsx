/**
 * ServerStatusPill
 * ----------------
 * Shows the live server status with an animated indicator:
 * - Green pulsing dot + ascending signal bars when online
 * - Red dot + crossed-out bars when offline
 */
export default function ServerStatusPill({ status }) {
  const online = !!status?.online;
  const bars = [6, 10, 14, 18]; // bar heights in px

  return (
    <div
      data-testid="server-status-pill"
      className={`inline-flex items-center gap-3 px-4 py-2 border shadow-block-sm ${
        online
          ? "bg-[#22c55e]/10 border-[#22c55e]/30"
          : "bg-red-500/10 border-red-500/30"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Dot */}
      <span className="relative flex items-center">
        <span
          className={`w-2.5 h-2.5 ${online ? "bg-[#22c55e]" : "bg-red-500"}`}
        />
        {online && (
          <span className="absolute inset-0 w-2.5 h-2.5 bg-[#22c55e] animate-ping opacity-60" />
        )}
      </span>

      {/* Label */}
      <span
        className={`font-accent text-[10px] uppercase tracking-[0.25em] ${
          online ? "text-[#22c55e]" : "text-red-400"
        }`}
      >
        {online ? "Server Online" : "Server Offline"}
      </span>

      {/* Signal bars */}
      <div className="flex items-end gap-[3px] h-5 relative">
        {bars.map((h, i) => (
          <span
            key={i}
            className={online ? "bg-[#22c55e]" : "bg-red-500/50"}
            style={{
              width: 3,
              height: h,
              opacity: online ? 0.35 + i * 0.22 : 0.5,
              animation: online ? `barPulse 1.4s ease-in-out ${i * 0.12}s infinite` : undefined,
            }}
          />
        ))}
        {/* Red X overlay when offline */}
        {!online && (
          <>
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className="block bg-red-500"
                style={{
                  width: "120%",
                  height: 2,
                  transform: "rotate(-28deg)",
                  transformOrigin: "center",
                }}
              />
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className="block bg-red-500"
                style={{
                  width: "120%",
                  height: 2,
                  transform: "rotate(28deg)",
                  transformOrigin: "center",
                }}
              />
            </span>
          </>
        )}
      </div>

      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.55); }
        }
      `}</style>
    </div>
  );
}
