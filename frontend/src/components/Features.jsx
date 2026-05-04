import { motion } from "framer-motion";
import { FEATURES, FEATURES_BG, MODS_BG } from "../constants";

const BG_MAP = {
  0: FEATURES_BG,
  3: MODS_BG,
};

const ACCENT_HEX = {
  emerald: "#22c55e",
  diamond: "#06b6d4",
  dirt: "#8b5a2b",
};

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
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={`${f.span} col-span-1 relative overflow-hidden block-card p-6 md:p-8 min-h-[220px] md:min-h-[260px] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-block-lg transition-transform duration-150`}
              data-testid={`feature-${f.title.toLowerCase().replace(/ /g, "-")}`}
              style={
                BG_MAP[i]
                  ? {
                      backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.85), rgba(10,10,10,0.6)), url(${BG_MAP[i]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <span
                className="font-accent text-[10px] uppercase tracking-[0.2em]"
                style={{ color: ACCENT_HEX[f.accent] }}
              >
                {"▸ "}Feature 0{i + 1}
              </span>
              <h3 className="font-pixel text-3xl md:text-4xl text-white mt-3">
                {f.title}
              </h3>
              <p className="text-white/70 mt-3 max-w-md">{f.body}</p>
              <div
                className="absolute bottom-4 right-4 w-4 h-4"
                style={{ background: ACCENT_HEX[f.accent] }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
