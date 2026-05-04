import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import ThemedIcon from "../components/ThemedIcon";
import starter from "../data/starter.json";

export default function StarterGuidePage() {
  return (
    <div data-testid="starter-page" className="pt-28">
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Starter Guide</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>

          <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            Your first <span className="text-[#22c55e]">hour.</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl">
            A friendly walkthrough for fresh joiners. Edit this guide in{" "}
            <code className="text-[#22c55e]">data/starter.json</code>.
          </p>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {starter.steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="block-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-10 h-10 flex items-center justify-center bg-[#22c55e]/15 text-[#22c55e]"
                    aria-hidden
                  >
                    <ThemedIcon name={s.icon} size={18} />
                  </span>
                  <div className="font-pixel text-4xl text-[#22c55e]/15 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="font-pixel text-2xl text-white mt-3">
                  {s.title}
                </h3>
                <p className="text-white/70 text-sm mt-2">{s.body}</p>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="font-pixel text-3xl text-white">FAQ</h2>
            <div className="mt-4 block-card p-6">
              <Accordion type="single" collapsible className="w-full">
                {starter.faq.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`faq-${i}`}
                    className="border-white/10"
                  >
                    <AccordionTrigger className="hover:no-underline font-pixel text-lg text-white">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/how-to-play" className="block-btn">
              How to Join →
            </Link>
            <Link to="/" className="block-btn-ghost">
              Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
