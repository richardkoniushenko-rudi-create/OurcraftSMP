import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GALLERY } from "../constants";

export default function Gallery() {
  const [active, setActive] = useState(null);

  return (
    <section data-testid="gallery" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Gallery</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>
        <h2 className="font-pixel text-4xl md:text-5xl text-white">
          Snapshots from <span className="text-[#22c55e]">the SMP</span>
        </h2>
        <p className="text-white/60 mt-2 max-w-xl">
          Built by the community. Click any thumbnail to enlarge.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.map((g, i) => (
            <motion.button
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.06 }}
              data-testid={`gallery-item-${i}`}
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden block-card aspect-[4/3] ${
                i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-[8/6]" : ""
              }`}
            >
              <img
                src={g.url}
                alt={g.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <span className="font-pixel text-xl text-white leading-tight">
                  {g.title}
                </span>
                <span className="font-accent text-[9px] uppercase tracking-[0.2em] text-[#22c55e]">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="gallery-lightbox"
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button
              data-testid="gallery-close-btn"
              className="absolute top-6 right-6 text-white bg-[#22c55e] p-2"
              onClick={(e) => {
                e.stopPropagation();
                setActive(null);
              }}
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={GALLERY[active].url}
              alt={GALLERY[active].title}
              className="max-h-[85vh] max-w-6xl object-contain shadow-block-lg border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
