import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Users, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { LOGO_URL, HERO_BG } from "../constants";

export default function Hero({ info, status, discordUrl }) {
  const [copied, setCopied] = useState(false);
  const ip = info?.ip || "play.ourcraft.online";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      toast.success("IP copied to clipboard!");
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      toast.error("Could not copy IP");
    }
  };

  return (
    <section
      data-testid="hero"
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-[#0a0a0a]" />

      <div className="container-oc relative">
        <div className="grid lg:grid-cols-[1fr_auto] items-center gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-2 h-2 bg-[#22c55e] animate-pulse-soft" />
              <span className="overline">
                {status?.online ? "Server Online" : "Checking status..."}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-pixel text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-white"
            >
              Build. Survive. <br />
              <span className="text-[#22c55e]">Together.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-white/70 text-base md:text-lg"
            >
              {info?.tagline || "Modded Survival with Custom Terrain & Structures"}.
              Join a close-knit SMP where every block counts.
            </motion.p>

            {/* IP widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <div
                data-testid="ip-widget"
                className="flex items-center bg-[#111113] border border-white/10 shadow-block"
              >
                <div className="px-4 py-3 border-r border-white/10">
                  <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
                    Server IP
                  </div>
                  <div
                    data-testid="server-ip-text"
                    className="font-pixel text-2xl text-white leading-none mt-0.5"
                  >
                    {ip}
                  </div>
                </div>
                <button
                  data-testid="copy-ip-button"
                  onClick={handleCopy}
                  className="h-full px-5 py-4 bg-[#22c55e] text-black font-accent text-xs uppercase tracking-[0.2em] hover:bg-[#16a34a] transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="ml-2 hidden sm:inline">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>
              </div>
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="hero-discord-btn"
                className="block-btn-ghost"
              >
                Join Discord
              </a>
            </motion.div>

            {/* Live stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid grid-cols-3 gap-4 max-w-md"
            >
              <StatBadge
                icon={<Users size={14} />}
                label="Players"
                value={`${status?.players_online ?? "—"}/${
                  status?.max_players ?? info?.max_players ?? "—"
                }`}
                testId="stat-players"
              />
              <StatBadge
                icon={<MessageCircle size={14} />}
                label="Discord"
                value={status?.discord_online ?? "—"}
                testId="stat-discord-online"
              />
              <StatBadge
                icon={<span className="font-pixel text-xs">v</span>}
                label="Version"
                value={info?.version || "—"}
                testId="stat-version"
              />
            </motion.div>

            {info?.modpack && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/30"
                data-testid="modpack-badge"
              >
                <span className="w-1.5 h-1.5 bg-[#22c55e]" />
                <span className="font-accent text-[10px] uppercase tracking-[0.25em] text-[#22c55e]">
                  Modpack · {info.modpack}
                </span>
              </motion.div>
            )}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative animate-float">
              <div className="absolute -inset-4 bg-[#22c55e]/10 blur-3xl -z-10" />
              <img
                src={LOGO_URL}
                alt="Ourcraft SMP"
                className="w-80 h-80 object-contain drop-shadow-[8px_8px_0_rgba(0,0,0,0.6)]"
                style={{ imageRendering: "auto" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatBadge({ icon, label, value, testId }) {
  return (
    <div
      data-testid={testId}
      className="block-card px-3 py-3 flex flex-col gap-1"
    >
      <div className="flex items-center gap-1.5 text-[#22c55e]">
        {icon}
        <span className="font-accent text-[9px] uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <div className="font-pixel text-2xl text-white leading-none">{value}</div>
    </div>
  );
}
