import { motion } from "framer-motion";
import { Activity, Users, Gauge, Globe } from "lucide-react";

export default function LiveStatus({ status, info }) {
  const items = [
    {
      label: "Server Status",
      value: status?.online ? "Online" : "Offline",
      sub: status?.bot_ready ? "Bot connected" : "Bot initializing",
      icon: <Activity size={18} />,
      ok: !!status?.online,
    },
    {
      label: "Players Online",
      value: status?.players_online ?? 0,
      sub: `of ${status?.max_players ?? info?.max_players ?? 100} slots`,
      icon: <Users size={18} />,
      ok: true,
    },
    {
      label: "Discord Online",
      value: status?.discord_online ?? 0,
      sub: `${status?.discord_members ?? 0} total members`,
      icon: <Globe size={18} />,
      ok: true,
    },
    {
      label: "Uptime",
      value: info?.uptime || "99.9%",
      sub: "last 30 days",
      icon: <Gauge size={18} />,
      ok: true,
    },
  ];

  return (
    <section data-testid="live-status" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Live</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>

        <h2 className="font-pixel text-4xl md:text-5xl text-white">
          Server <span className="text-[#22c55e]">Pulse</span>
        </h2>
        <p className="text-white/60 mt-2 max-w-xl">
          Real-time data streamed from our Discord bot inside the Ourcraft guild.
        </p>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              data-testid={`status-card-${it.label.toLowerCase().replace(/ /g, "-")}`}
              className="block-card p-5 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-block-lg transition-transform duration-150"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 flex items-center justify-center ${
                    it.ok ? "bg-[#22c55e]/15 text-[#22c55e]" : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {it.icon}
                </div>
                {it.ok && (
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse-soft" />
                )}
              </div>
              <div className="mt-5 font-accent text-[10px] uppercase tracking-[0.2em] text-white/50">
                {it.label}
              </div>
              <div className="font-pixel text-4xl text-white leading-none mt-1">
                {it.value}
              </div>
              <div className="text-xs text-white/50 mt-1">{it.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
