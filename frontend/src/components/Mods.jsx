import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { MODS, MODS_BG } from "../constants";

export default function Mods() {
  return (
    <section data-testid="mods-section" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Modpack</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>
        <h2 className="font-pixel text-4xl md:text-5xl text-white">
          The <span className="text-[#22c55e]">Mods</span> & How to use them
        </h2>
        <p className="text-white/60 mt-2 max-w-xl">
          Every mod below is in the official Ourcraft modpack. Expand any item
          for a quick usage tip.
        </p>

        <div className="mt-10 grid lg:grid-cols-[1fr_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="block-card p-6 md:p-8"
          >
            <Accordion type="single" collapsible className="w-full">
              {MODS.map((m, i) => (
                <AccordionItem
                  key={m.name}
                  value={`mod-${i}`}
                  data-testid={`mod-item-${m.name.toLowerCase().replace(/[^a-z]/g, "-")}`}
                  className="border-white/10"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <span className="font-accent text-[9px] uppercase tracking-[0.2em] text-[#22c55e] bg-[#22c55e]/10 px-2 py-1">
                        {m.tag}
                      </span>
                      <span className="font-pixel text-2xl text-white">
                        {m.name}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    <p>{m.description}</p>
                    <div className="mt-3 flex gap-3 border-l-2 border-[#22c55e] pl-3">
                      <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
                        Tip
                      </span>
                      <span className="text-sm text-white/80">{m.tip}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative min-h-[400px] overflow-hidden block-card"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.55), rgba(10,10,10,0.2)), url(${MODS_BG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute bottom-6 left-6 right-6">
              <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
                {MODS.length} hand-picked mods
              </div>
              <div className="font-pixel text-3xl md:text-4xl text-white mt-1">
                No crashes. No lag. Pure SMP.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
