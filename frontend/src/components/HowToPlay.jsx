import { motion } from "framer-motion";
import { HOW_TO_PLAY } from "../constants";

export default function HowToPlay({ info }) {
  return (
    <section data-testid="how-to-play" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Getting Started</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>
        <h2 className="font-pixel text-4xl md:text-5xl text-white">
          How to <span className="text-[#22c55e]">Join</span>
        </h2>
        <p className="text-white/60 mt-2 max-w-xl">
          Four short steps and you'll be mining diamonds with the crew. If you
          get stuck, our Discord can help in under a minute.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_TO_PLAY.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              data-testid={`step-${s.step}`}
              className="block-card p-6 relative hover:-translate-x-1 hover:-translate-y-1 hover:shadow-block-lg transition-transform duration-150"
            >
              <div className="font-pixel text-6xl text-[#22c55e]/20 leading-none">
                {s.step}
              </div>
              <h3 className="font-pixel text-2xl text-white mt-2">{s.title}</h3>
              <p className="text-white/70 text-sm mt-3">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 block-card p-6 md:p-8 bg-gradient-to-br from-[#111113] to-[#151517]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="overline">Ready?</div>
              <div className="font-pixel text-3xl text-white mt-1">
                Connect to{" "}
                <span className="text-[#22c55e]">
                  {info?.ip || "play.ourcraft.online"}
                </span>
              </div>
              <div className="text-white/60 text-sm mt-1">
                Minecraft Java {info?.version || "1.21.1"} · {info?.modpack || "Mounts of Mayhem"} · Fabric
              </div>
            </div>
            <a
              href={info?.discord_invite_url || "https://discord.gg/pFj6mZubVu"}
              target="_blank"
              rel="noreferrer"
              data-testid="htp-discord-btn"
              className="block-btn"
            >
              Need Help? Join Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
