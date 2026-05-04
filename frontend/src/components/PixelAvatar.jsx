/**
 * PixelAvatar
 * -----------
 * Deterministic 3×3 pixel identicon from any string (nickname).
 * Symmetrical (left mirror) so they look more like real sprites.
 */
const PALETTE = [
  "#22c55e", // emerald
  "#06b6d4", // diamond
  "#f59e0b", // gold
  "#ec4899", // ruby
  "#a78bfa", // amethyst
  "#ef4444", // redstone
  "#8b5a2b", // dirt
  "#fb923c", // copper
  "#94a3b8", // iron
];

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

export default function PixelAvatar({ name = "", size = 32 }) {
  const hash = hashStr(name || "anon");
  const bg = "#0d0d0f";
  const fg = PALETTE[hash % PALETTE.length];
  const fg2 = PALETTE[(hash >> 4) % PALETTE.length];
  // Use hash bits to decide which of the left-half cells are filled
  // Grid is 3 cols × 3 rows. Cols 0 and 2 mirror; col 1 is center.
  // We need 2 cols × 3 rows = 6 bits.
  const cells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const bit = (hash >> (row * 2 + col)) & 1;
      cells.push({ row, col, on: bit === 1 });
    }
  }
  // extra accent bit for secondary colour
  const useTwo = (hash >> 7) & 1;

  const CELL = size / 3;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 3 3"
      shapeRendering="crispEdges"
      style={{
        background: bg,
        display: "block",
        borderRadius: 2,
        imageRendering: "pixelated",
      }}
      aria-label={`avatar for ${name}`}
    >
      {cells.map(({ row, col, on }, i) => {
        if (!on) return null;
        const useAccent = useTwo && (i % 2 === 0);
        const fill = useAccent ? fg2 : fg;
        return (
          <g key={i}>
            <rect x={col} y={row} width="1" height="1" fill={fill} />
            <rect x={2 - col} y={row} width="1" height="1" fill={fill} />
          </g>
        );
      })}
    </svg>
  );
}
