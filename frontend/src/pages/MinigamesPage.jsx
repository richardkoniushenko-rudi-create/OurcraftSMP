/**
 * /minigames subpage
 * -------------------
 * Central hub for all Ourcraft minigames.
 */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Lock, CheckCircle2, Trophy } from "lucide-react";
import CreeperHunt from "../components/CreeperHunt";
import BlockBreakInline from "../components/BlockBreakInline";
import { HERO_BG } from "../constants";
import { API } from "../lib/api";

export default function MinigamesPage() {
  const [eggs, setEggs] = useState([]);
  const [claimedMap, setClaimedMap] = useState({});

  useEffect(() => {
    axios.get(`${API}/easter/eggs`).then((r) => {
      setEggs(r.data || []);
      (r.data || []).forEach((e) => {
        axios
          .get(`${API}/easter/check/${e.id}`)
          .then((res) => setClaimedMap((m) => ({ ...m, [e.id]: !!res.data?.claimed })))
          .catch(() => {});
      });
    });
  }, []);

  const foundCount = Object.values(claimedMap).filter(Boolean).length;
  const total = eggs.length;

  return (
    <div data-testid="minigames-page" className="pt-28">
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Minigames · Easter Eggs</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
            <div>
              <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
                The <span className="text-[#22c55e]">Arcade</span>
              </h1>
              <p className="text-white/60 mt-4 max-w-xl">
                Play quick minigames right here. Find hidden easter eggs around
                the site and claim Minecraft rewards with your in-game
                username. Each reward can only be claimed once per device.
              </p>
            </div>
            <div className="block-card p-5">
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-[#f59e0b]" />
                <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#f59e0b]">
                  Egg Hunt Progress
                </span>
              </div>
              <div className="font-pixel text-4xl text-white mt-1">
                {foundCount}/{total}
              </div>
              <div className="h-2 mt-3 bg-[#1a1a1d]">
                <div
                  className="h-full bg-[#f59e0b] transition-all"
                  style={{ width: `${total ? (foundCount / total) * 100 : 0}%` }}
                />
              </div>
              <div className="text-xs text-white/50 mt-2">
                Explore every page to find them all.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creeper Hunt section already has its own container */}
      <CreeperHunt />

      {/* Block Break inline game */}
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Minigame · Mine</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>
          <h2 className="font-pixel text-4xl md:text-5xl text-white">
            Block <span className="text-[#22c55e]">Reveal</span>
          </h2>
          <p className="text-white/60 mt-2 max-w-xl">
            Mine every block to uncover a hidden Ourcraft scene. Drag across
            the grid for fast mining.
          </p>
          <div className="mt-8">
            <BlockBreakInline
              imageUrl={HERO_BG}
              title="Hidden Scene"
              caption="Click or click-drag. 3 hits per block."
            />
          </div>
        </div>
      </section>

      {/* Easter Egg Tracker */}
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Easter Egg Tracker</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>
          <h2 className="font-pixel text-4xl md:text-5xl text-white">
            Find them <span className="text-[#22c55e]">all</span>
          </h2>
          <p className="text-white/60 mt-2 max-w-xl">
            {total} secrets are hidden across the website. Each reveals a
            claimable reward. Click any egg below if you know its location —
            otherwise, happy hunting!
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {eggs.map((e) => {
              const found = !!claimedMap[e.id];
              return (
                <div
                  key={e.id}
                  data-testid={`egg-card-${e.id}`}
                  className="block-card p-5 flex gap-4 items-start"
                  style={{
                    borderColor: found
                      ? "rgba(34,197,94,0.35)"
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-11 h-11 flex items-center justify-center text-2xl"
                    style={{
                      background: found ? "#22c55e15" : "#1a1a1d",
                      color: found ? "#22c55e" : "rgba(255,255,255,0.5)",
                    }}
                    aria-hidden
                  >
                    {found ? <CheckCircle2 size={22} /> : <Lock size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-pixel text-xl text-white">
                        {found ? `${e.emoji} ${e.name}` : "???"}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      {found ? e.hint : "Locked — find it on the site!"}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-0.5 bg-[#22c55e]/10 border border-[#22c55e]/30">
                      <span className="font-accent text-[9px] uppercase tracking-[0.2em] text-[#22c55e]">
                        Reward
                      </span>
                      <span className="font-pixel text-sm text-white">
                        {found ? e.reward : "???"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link to="/" className="block-btn-ghost">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
