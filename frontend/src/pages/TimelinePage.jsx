import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Lock } from "lucide-react";
import timeline from "../data/timeline.json";

export default function TimelinePage() {
  return (
    <div data-testid="timeline-page" className="pt-28">
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Timeline · World History</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>

          <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            The <span className="text-[#22c55e]">Story</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl">
            Every season, every milestone. Click any chapter to expand. Edit
            entries in <code className="text-[#22c55e]">data/timeline.json</code>.
          </p>

          <div className="mt-10 relative">
            {/* vertical rail */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#22c55e] via-[#06b6d4] to-transparent" />
            <div className="space-y-6">
              {timeline.seasons.map((s, i) => {
                const current = s.id === "current";
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="relative pl-12"
                  >
                    <span
                      className={`absolute left-1.5 top-2 w-5 h-5 ${
                        current
                          ? "bg-[#22c55e] animate-pulse-soft"
                          : "bg-[#1a1a1d] border-2 border-[#22c55e]/50"
                      }`}
                      aria-hidden
                    />
                    <div className="block-card p-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
                            {s.date}
                          </div>
                          <div className="font-pixel text-2xl text-white mt-1">
                            {s.name}
                          </div>
                        </div>
                        {current && (
                          <span className="font-accent text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-[#22c55e] text-black">
                            Live now
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-sm mt-3">{s.summary}</p>
                      <ul className="mt-3 grid sm:grid-cols-2 gap-1.5">
                        {s.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-sm text-white/65"
                          >
                            <span className="text-[#22c55e] font-pixel">■</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Map embed placeholder */}
          <div className="mt-12 block-card p-6 bg-gradient-to-br from-[#06b6d4]/10 to-transparent">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="overline">Live World Map</div>
                <div className="font-pixel text-2xl text-white mt-2">
                  Dynmap / BlueMap
                </div>
                <p className="text-white/60 text-sm mt-2 max-w-xl">
                  Reserved spot for your live map. Add the URL to{" "}
                  <code className="text-[#06b6d4]">backend/.env</code> as{" "}
                  <code className="text-[#06b6d4]">MAP_URL</code> and we'll
                  embed it here.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 font-accent text-[10px] uppercase tracking-[0.2em]">
                <Lock size={11} />
                Coming Soon
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/" className="block-btn-ghost">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
