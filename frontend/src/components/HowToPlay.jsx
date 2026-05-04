import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Download, Server, Zap } from "lucide-react";
import { toast } from "sonner";
import { HOW_TO_PLAY } from "../constants";

const STEPS = [
  {
    step: "01",
    title: "Get Minecraft Java",
    body: "Own Minecraft: Java Edition on a PC. Bedrock isn't supported.",
    icon: Server,
  },
  {
    step: "02",
    title: "Install Fabric",
    body: "Download the Fabric loader for the server's exact version (1.21.11). Vanilla won't connect.",
    icon: Download,
  },
  {
    step: "03",
    title: "(Optional) Client Mods",
    body: "Ourcraft is server-side. You can play vanilla. For 256-chunk render distance and FPS, install Sodium, Iris, and Simple Voxel-style optimisers — all OK with us.",
    icon: Zap,
  },
  {
    step: "04",
    title: "Add the Server & Join",
    body: "Multiplayer → Add Server → paste the IP → hit Join. See you at spawn!",
    icon: Server,
  },
];

export default function HowToPlay({ info }) {
  const [copied, setCopied] = useState(false);
  const ip = info?.ip || "play.ourcraft.online";

  const copyIp = async () => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      toast.success("IP copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy IP");
    }
  };

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
          Ourcraft is server-side first — no modpack required. Three short
          steps and you'll be mining diamonds with the crew.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => {
            const Ic = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                data-testid={`step-${s.step}`}
                className="block-card p-6 relative"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-10 h-10 flex items-center justify-center bg-[#22c55e]/10 text-[#22c55e]"
                    aria-hidden
                  >
                    <Ic size={18} />
                  </span>
                  <div className="font-pixel text-5xl text-[#22c55e]/15 leading-none">
                    {s.step}
                  </div>
                </div>
                <h3 className="font-pixel text-2xl text-white mt-3">{s.title}</h3>
                <p className="text-white/70 text-sm mt-2">{s.body}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 block-card p-6 md:p-8 bg-gradient-to-br from-[#111113] to-[#151517]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="overline">Ready?</div>
              <div className="flex items-center flex-wrap gap-3 mt-2">
                <div className="font-pixel text-3xl text-white">
                  Connect to{" "}
                  <span className="text-[#22c55e]">{ip}</span>
                </div>
                <button
                  data-testid="htp-copy-ip"
                  onClick={copyIp}
                  className="block-btn !py-2 !px-3 !text-[10px]"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy IP"}
                </button>
              </div>
              <div className="text-white/60 text-sm mt-2">
                Minecraft Java {info?.version || "1.21.11"} · Fabric · Server-side modded
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
