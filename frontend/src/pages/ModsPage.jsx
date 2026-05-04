import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Database } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  MOD_CATEGORIES,
  MODS_BY_CAT,
  DATAPACKS,
  MODS_BG,
} from "../constants";

const SECTIONS = [
  { key: "mods", label: "Mods", icon: <Package size={14} /> },
  { key: "datapacks", label: "Datapacks", icon: <Database size={14} /> },
];

export default function ModsPage() {
  const [section, setSection] = useState("mods");
  const [cat, setCat] = useState("terrain");

  const totalMods = useMemo(
    () => Object.values(MODS_BY_CAT).reduce((a, arr) => a + arr.length, 0),
    [],
  );

  return (
    <div data-testid="mods-page" className="pt-28">
      <section className="section-pad pt-0">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Mods · Datapacks</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div>
              <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
                Mods & <span className="text-[#22c55e]">Datapacks</span>
              </h1>
              <p className="text-white/60 mt-4 max-w-xl">
                Every mod in the official Ourcraft modpack, organised by
                category. Datapacks are server-side tweaks that work without
                any client install.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Stat label="Total Mods" value={totalMods} />
                <Stat label="Categories" value={MOD_CATEGORIES.length} />
                <Stat label="Datapacks" value={DATAPACKS.length} />
              </div>
            </div>

            <div
              className="hidden lg:block relative min-h-[260px] overflow-hidden block-card"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.5), rgba(10,10,10,0.1)), url(${MODS_BG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden
            >
              <div className="absolute bottom-5 left-5 right-5">
                <div className="overline">No crashes</div>
                <div className="font-pixel text-2xl text-white mt-1">
                  No lag. Pure SMP.
                </div>
              </div>
            </div>
          </div>

          {/* Section switcher */}
          <div className="mt-12 flex flex-wrap gap-2">
            {SECTIONS.map((s) => {
              const active = section === s.key;
              return (
                <button
                  key={s.key}
                  data-testid={`section-tab-${s.key}`}
                  onClick={() => setSection(s.key)}
                  className={`flex items-center gap-2 px-4 py-2 font-accent text-xs uppercase tracking-[0.2em] border shadow-block-sm transition-transform ${
                    active
                      ? "bg-[#22c55e] text-black border-transparent"
                      : "bg-[#111113] text-white/70 border-white/10 hover:-translate-x-[2px] hover:-translate-y-[2px]"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              );
            })}
          </div>

          {section === "mods" && (
            <ModsSection cat={cat} setCat={setCat} />
          )}
          {section === "datapacks" && <DatapacksSection />}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="block-card px-4 py-3">
      <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
        {label}
      </div>
      <div className="font-pixel text-2xl text-white leading-none mt-1">
        {value}
      </div>
    </div>
  );
}

function ModsSection({ cat, setCat }) {
  const mods = MODS_BY_CAT[cat] || [];
  const activeCat = MOD_CATEGORIES.find((c) => c.key === cat);

  return (
    <div className="mt-8">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MOD_CATEGORIES.map((c) => {
          const active = cat === c.key;
          return (
            <button
              key={c.key}
              data-testid={`cat-${c.key}`}
              onClick={() => setCat(c.key)}
              className="px-4 py-2 font-accent text-[10px] uppercase tracking-[0.2em] border transition-all"
              style={{
                background: active ? c.color : "#111113",
                color: active ? "#0a0a0a" : "rgba(255,255,255,0.7)",
                borderColor: active ? c.color : "rgba(255,255,255,0.1)",
                boxShadow: active
                  ? `4px 4px 0 rgba(0,0,0,0.5)`
                  : "2px 2px 0 rgba(0,0,0,0.6)",
              }}
            >
              {c.label}
              <span className="ml-2 opacity-60">
                {(MODS_BY_CAT[c.key] || []).length}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={cat}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="block-card p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-3 h-3"
            style={{ background: activeCat?.color }}
            aria-hidden
          />
          <h3 className="font-pixel text-3xl text-white">
            {activeCat?.label}
          </h3>
          <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/40">
            {mods.length} mod{mods.length === 1 ? "" : "s"}
          </span>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {mods.map((m, i) => (
            <AccordionItem
              key={m.name}
              value={`mod-${cat}-${i}`}
              data-testid={`mod-item-${m.name.toLowerCase().replace(/[^a-z]/g, "-")}`}
              className="border-white/10"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span
                    className="font-accent text-[9px] uppercase tracking-[0.2em] px-2 py-1"
                    style={{
                      background: `${activeCat?.color}1a`,
                      color: activeCat?.color,
                    }}
                  >
                    {activeCat?.label}
                  </span>
                  <span className="font-pixel text-2xl text-white">
                    {m.name}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                <p>{m.description}</p>
                <div className="mt-3 flex gap-3 border-l-2 pl-3" style={{ borderColor: activeCat?.color }}>
                  <span
                    className="font-accent text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: activeCat?.color }}
                  >
                    Tip
                  </span>
                  <span className="text-sm text-white/80">{m.tip}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}

function DatapacksSection() {
  return (
    <div className="mt-8 grid md:grid-cols-2 gap-4">
      {DATAPACKS.map((d, i) => {
        const c = MOD_CATEGORIES.find((x) => x.key === d.category);
        return (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            data-testid={`datapack-${d.name.toLowerCase().replace(/[^a-z]/g, "-")}`}
            className="block-card p-5 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-block-lg transition-transform duration-150"
          >
            <div className="flex items-center justify-between">
              <span
                className="font-accent text-[9px] uppercase tracking-[0.2em] px-2 py-0.5"
                style={{
                  background: `${c?.color || "#22c55e"}1a`,
                  color: c?.color || "#22c55e",
                }}
              >
                {c?.label || d.category}
              </span>
              <Database size={14} className="text-white/30" />
            </div>
            <h3 className="font-pixel text-2xl text-white mt-3">{d.name}</h3>
            <p className="text-white/65 text-sm mt-2">{d.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
