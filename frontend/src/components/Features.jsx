import { motion } from "framer-motion";
import { Heart, Mountain, Castle, Sword, Cog } from "lucide-react";
import { FEATURES_BG, MODS_BG } from "../constants";

const FEATURES = [
  {
    title: "Vanilla Heart",
    body: "Server-side mods that expand gameplay without breaking the vanilla feel — no client install required for most players.",
    icon: Heart,
    accent: "#ef4444",
    span: "md:col-span-7",
    progress: 100,
    progressLabel: "Stable",
  },
  {
    title: "Modded Muscle",
    body: "Performance + tech mods like Sodium, Lithium, Create on top — optional client mods add even more.",
    icon: Cog,
    accent: "#22c55e",
    span: "md:col-span-5",
    progress: 95,
    progressLabel: "Live",
  },
  {
    title: "Custom Terrain",
    body: "Towering mountains, hidden aquifers, floating isles — Terralith + Tectonic make every biome interesting.",
    icon: Mountain,
    accent: "#06b6d4",
    span: "md:col-span-4",
    progress: 90,
    progressLabel: "Worldgen",
    bg: FEATURES_BG,
  },
  {
    title: "Custom Structures",
    body: "Dungeons, villages and towers rebuilt from the ground up with unique loot tables.",
    icon: Castle,
    accent: "#8b5a2b",
    span: "md:col-span-4",
    progress: 88,
    progressLabel: "Looting",
  },
  {
    title: "Adventure Ready",
    body: "Better combat, expanded enemies, raidable structures. Bring friends.",
    icon: Sword,
    accent: "#f59e0b",
    span: "md:col-span-4",
    progress: 80,
    progressLabel: "Combat",
    bg: MODS_BG,
  },
];

export default function Features() {
  return (
    <section data-testid="features" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Why Ourcraft</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>
        <h2 className="font-pixel text-4xl md:text-5xl text-white max-w-2xl">
          Vanilla heart. <span className="text-[#22c55e]">Modded muscle.</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-4">
          {FEATURES.map((f, i) => {
            const Ic = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`${f.span} col-span-1 relative overflow-hidden block-card p-6 md:p-8 min-h-[220px] md:min-h-[260px]`}
                data-testid={`feature-${f.title.toLowerCase().replace(/ /g, "-")}`}
                title={f.body}
                style={
                  f.bg
                    ? {
                        backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.86), rgba(10,10,10,0.55)), url(${f.bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ background: `${f.accent}1f`, color: f.accent }}
                    aria-hidden
                  >
                    <Ic size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-pixel text-3xl md:text-4xl text-white">
                      {f.title}
                    </h3>
                  </div>
                </div>
                <p className="text-white/70 mt-4 max-w-md">{f.body}</p>

                {/* Progress bar */}
                <div className="absolute bottom-5 left-6 right-6">
                  <div className="flex items-center justify-between font-accent text-[9px] uppercase tracking-[0.2em] mb-1.5">
                    <span style={{ color: f.accent }}>{f.progressLabel}</span>
                    <span className="text-white/50">{f.progress}%</span>
                  </div>
                  <div className="h-1 bg-[#1a1a1d]">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${f.progress}%`, background: f.accent }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
