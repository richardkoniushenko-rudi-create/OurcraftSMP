import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import ServerStatusPill from "./ServerStatusPill";

export default function ServerInfo({ info, status }) {
  const rows = [
    { k: "Server Name", v: info?.name || "Ourcraft SMP" },
    { k: "Server IP", v: info?.ip || "play.ourcraft.online" },
    { k: "Version", v: `Minecraft Java ${info?.version || "1.21.11"}` },
    { k: "Modloader", v: "Fabric" },
    { k: "Gamemode", v: info?.gamemode || "Survival (SMP)" },
    { k: "Max Players", v: info?.max_players ?? 200 },
    { k: "CPU", v: info?.cpu || "AMD Ryzen 7 6800H" },
    { k: "RAM", v: info?.ram || "32 GB DDR5" },
    { k: "Discord Members", v: status?.discord_members ?? 0 },
    { k: "Uptime (30d)", v: info?.uptime || "99.9%" },
  ];

  const rules = [
    "No griefing, stealing or PvP without consent.",
    "Keep chat chill — no harassment, slurs or spam.",
    "Use the modpack as provided; no client exploits.",
    "Claim your base with /claim to protect your builds.",
    "Report issues in #support on Discord.",
  ];

  return (
    <section data-testid="server-info" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Server Info</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
          <h2 className="font-pixel text-4xl md:text-5xl text-white">
            The <span className="text-[#22c55e]">essentials</span>
          </h2>
          <ServerStatusPill status={status} />
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="block-card overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/10 bg-[#0d0d0f] flex items-center justify-between">
              <span className="font-pixel text-xl text-white">/specs</span>
              <div className="flex items-center gap-2" data-testid="specs-status-mini">
                <span
                  className={`w-2 h-2 ${status?.online ? "bg-[#22c55e] animate-pulse-soft" : "bg-red-500"}`}
                />
                <span
                  className={`font-accent text-[9px] uppercase tracking-[0.2em] ${
                    status?.online ? "text-[#22c55e]" : "text-red-400"
                  }`}
                >
                  {status?.online ? "Live" : "Offline"}
                </span>
              </div>
            </div>
            <dl className="divide-y divide-white/5">
              {rows.map((r) => (
                <div
                  key={r.k}
                  data-testid={`spec-${r.k.toLowerCase().replace(/[^a-z]/g, "-")}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02]"
                >
                  <dt className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/50">
                    {r.k}
                  </dt>
                  <dd className="font-pixel text-xl text-white">{r.v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="block-card p-6"
            >
              <span className="overline">Server Rules</span>
              <h3 className="font-pixel text-3xl text-white mt-2">
                Play fair, have fun
              </h3>
              <ul className="mt-4 space-y-3">
                {rules.map((r, i) => (
                  <li
                    key={i}
                    data-testid={`rule-${i}`}
                    className="flex gap-3 text-white/75"
                  >
                    <span className="font-pixel text-xl text-[#22c55e] leading-none">
                      ■
                    </span>
                    <span className="text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.a
              href={info?.management_panel_url || "https://management_panel.mcboost.online/"}
              target="_blank"
              rel="noreferrer"
              data-testid="mgmt-panel-cta"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="block-card p-6 group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-block-lg transition-transform duration-150 bg-gradient-to-br from-[#22c55e]/5 to-[#111113]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="overline">Staff Only</span>
                  <h3 className="font-pixel text-3xl text-white mt-2">
                    Mods Panel
                  </h3>
                  <p className="text-white/60 text-sm mt-2">
                    Restricted area for server moderators — restart the server,
                    manage mods and view logs. Regular players don't need this.
                  </p>
                </div>
                <ExternalLink
                  className="text-[#22c55e] group-hover:translate-x-1 transition-transform"
                  size={28}
                />
              </div>
              <div className="mt-4 font-accent text-xs text-[#22c55e]">
                management_panel.mcboost.online →
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
