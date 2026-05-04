import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MOD_CATEGORIES, MODS_BY_CAT, MODS_BG } from "../constants";
import CategoryIcon from "./CategoryIcon";

export default function Mods() {
  const totalMods = Object.values(MODS_BY_CAT).reduce(
    (a, arr) => a + arr.length,
    0,
  );

  return (
    <section data-testid="mods-section" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Modpack</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>
        <h2 className="font-pixel text-4xl md:text-5xl text-white">
          The <span className="text-[#22c55e]">Mods</span> &amp; Datapacks
        </h2>
        <p className="text-white/60 mt-2 max-w-xl">
          {totalMods} mods across {MOD_CATEGORIES.length} categories. Browse by
          type or jump to the full guide.
        </p>

        <div className="mt-10 grid lg:grid-cols-[1fr_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {MOD_CATEGORIES.map((c) => {
              const count = (MODS_BY_CAT[c.key] || []).length;
              return (
                <Link
                  key={c.key}
                  to={`/mods?cat=${c.key}`}
                  data-testid={`home-cat-${c.key}`}
                  className="block-card p-4 group"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{
                      background: `${c.color}18`,
                      color: c.color,
                    }}
                    aria-hidden
                  >
                    <CategoryIcon name={c.icon} size={20} />
                  </div>
                  <div className="font-pixel text-2xl text-white leading-none">
                    {c.label}
                  </div>
                  <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
                    {count} mod{count === 1 ? "" : "s"}
                  </div>
                </Link>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative min-h-[300px] overflow-hidden block-card flex flex-col justify-end p-6"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.6), rgba(10,10,10,0.2)), url(${MODS_BG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
              Full Guide
            </div>
            <div className="font-pixel text-3xl md:text-4xl text-white mt-1">
              Every mod, every tip.
            </div>
            <Link
              to="/mods"
              data-testid="explore-mods-btn"
              className="block-btn mt-5 self-start"
            >
              Explore All Mods <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
