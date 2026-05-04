import { Link } from "react-router-dom";
import { Gavel, Shield, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ThemedIcon from "../components/ThemedIcon";
import rules from "../data/rules.json";

export default function RulesPage({ info }) {
  const discordUrl = info?.discord_invite_url || "https://discord.gg/pFj6mZubVu";

  return (
    <div data-testid="rules-page" className="pt-28">
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Rules · Updated {rules.updated}</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>

          <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            Play <span className="text-[#22c55e]">fair.</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl">
            One simple rulebook for the whole community. These apply to the
            server <em>and</em> our Discord. Edit them in{" "}
            <code className="text-[#22c55e]">data/rules.json</code>.
          </p>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <RuleColumn
              title="Minecraft Rules"
              icon={<Gavel size={18} />}
              rules={rules.minecraft}
              accent="#22c55e"
            />
            <RuleColumn
              title="Discord Rules"
              icon={<Shield size={18} />}
              rules={rules.discord}
              accent="#06b6d4"
            />
          </div>

          <div className="mt-10 block-card p-6 md:p-8 bg-gradient-to-br from-[#22c55e]/10 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="overline">Need a Mod?</div>
                <div className="font-pixel text-3xl text-white mt-2">
                  Report a player or issue
                </div>
                <div className="text-white/60 text-sm mt-2">
                  Use <span className="text-[#22c55e]">/report</span> in-game,
                  or jump into <span className="text-[#22c55e]">#support</span> on Discord.
                </div>
              </div>
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="report-discord"
                className="block-btn"
              >
                Report on Discord <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/" className="block-btn-ghost">← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function RuleColumn({ title, icon, rules: list, accent }) {
  return (
    <div className="block-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-10 h-10 flex items-center justify-center"
          style={{ background: `${accent}1f`, color: accent }}
          aria-hidden
        >
          {icon}
        </span>
        <h2 className="font-pixel text-3xl text-white">{title}</h2>
      </div>
      <div className="space-y-3">
        {list.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex gap-3 px-3 py-3 bg-[#0d0d0f] border border-white/5"
          >
            <span
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
              style={{ background: `${accent}15`, color: accent }}
              aria-hidden
            >
              <ThemedIcon name={r.icon} size={14} />
            </span>
            <div>
              <div className="font-pixel text-lg text-white leading-tight">
                {i + 1}. {r.title}
              </div>
              <div className="text-white/65 text-sm mt-1">{r.body}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
