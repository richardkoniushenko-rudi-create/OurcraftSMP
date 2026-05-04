import { Link } from "react-router-dom";
import { Lock, Heart, Gem, Crown } from "lucide-react";

const ACTIVE = false; // toggle here to enable the page
const TIERS = [
  { name: "Bronze", color: "#cd7f32", price: "$3", perks: ["Discord role", "Coloured chat"] },
  { name: "Silver", color: "#a8a8a8", price: "$6", perks: ["+ /nick", "+ /hat", "Priority queue"] },
  { name: "Gold",   color: "#f59e0b", price: "$12", perks: ["+ Cosmetic particles", "Early event access", "Custom emote"] },
];

export default function SupportUsPage() {
  return (
    <div data-testid="support-page" className="pt-28">
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Support Us</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
            <div>
              <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
                Keep us <span className="text-[#22c55e]">running.</span>
              </h1>
              <p className="text-white/60 mt-4 max-w-xl">
                Ourcraft is hosted, maintained and modded by friends in their
                free time. If you'd like to help cover hosting and unlock a
                couple of cosmetic perks — soon you'll be able to pitch in.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 font-accent text-[10px] uppercase tracking-[0.2em]">
                <Lock size={12} />
                Inactive — coming soon
              </div>
            </div>

            <div className="block-card p-5">
              <div className="overline">Server goal</div>
              <div className="font-pixel text-3xl text-white mt-2">
                Hardware Upgrade
              </div>
              <div className="mt-3 h-2 bg-[#1a1a1d]">
                <div
                  className="h-full bg-[#22c55e] transition-all"
                  style={{ width: "0%" }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/50 font-accent uppercase tracking-wider">
                <span>$0</span>
                <span>Goal: $250 / month</span>
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {TIERS.map((t) => (
              <div
                key={t.name}
                data-testid={`tier-${t.name.toLowerCase()}`}
                className="block-card p-5 relative overflow-hidden"
              >
                {!ACTIVE && (
                  <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                      <Lock size={12} />
                      Inactive
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ background: `${t.color}1f`, color: t.color }}
                  >
                    {t.name === "Bronze" && <Heart size={18} />}
                    {t.name === "Silver" && <Gem size={18} />}
                    {t.name === "Gold" && <Crown size={18} />}
                  </div>
                  <div className="font-pixel text-2xl text-white">{t.price}</div>
                </div>
                <h3 className="font-pixel text-3xl text-white mt-3">{t.name}</h3>
                <ul className="mt-3 space-y-1.5">
                  {t.perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-[#22c55e] font-pixel">■</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled
                  className="block-btn mt-5 w-full opacity-50 pointer-events-none"
                >
                  Support {t.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/" className="block-btn-ghost">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
