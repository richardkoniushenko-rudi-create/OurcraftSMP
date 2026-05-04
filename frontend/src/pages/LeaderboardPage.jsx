import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Trophy, Search, Crown, Egg } from "lucide-react";
import PixelAvatar from "../components/PixelAvatar";
import { API } from "../lib/api";

export default function LeaderboardPage() {
  const [tab, setTab] = useState("creeper");
  const [creeper, setCreeper] = useState([]);
  const [eggs, setEggs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([
      axios.get(`${API}/leaderboard/creeper`).catch(() => ({ data: [] })),
      axios.get(`${API}/leaderboard/eggs`).catch(() => ({ data: [] })),
    ]).then(([c, e]) => {
      if (!alive) return;
      setCreeper(c.data || []);
      setEggs(e.data || []);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const list = tab === "creeper" ? creeper : eggs;
  const filtered = filter
    ? list.filter((r) =>
        r.mc_username.toLowerCase().includes(filter.toLowerCase()),
      )
    : list;

  return (
    <div data-testid="leaderboard-page" className="pt-28">
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Public Leaderboard</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
            <div>
              <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
                The <span className="text-[#22c55e]">Hall</span>
              </h1>
              <p className="text-white/60 mt-4 max-w-xl">
                Public rankings — Creeper Hunt high scores and Easter Egg
                collectors. Climb the board and brag in Discord.
              </p>
            </div>
            <div className="block-card p-5">
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-[#f59e0b]" />
                <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#f59e0b]">
                  Top players
                </span>
              </div>
              <div className="font-pixel text-4xl text-white mt-1">
                {creeper.length + eggs.length}
              </div>
              <div className="text-xs text-white/50 mt-1">
                Total entries across both leaderboards
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12 flex flex-wrap gap-2">
            <TabBtn active={tab === "creeper"} onClick={() => setTab("creeper")} icon={<Trophy size={13} />}>
              Creeper Hunt
            </TabBtn>
            <TabBtn active={tab === "eggs"} onClick={() => setTab("eggs")} icon={<Egg size={13} />}>
              Egg Collectors
            </TabBtn>
          </div>

          {/* Search */}
          <div className="mt-6 flex items-center gap-2 bg-[#111113] border border-white/10 px-3 py-2 max-w-md">
            <Search size={14} className="text-white/40" />
            <input
              data-testid="leaderboard-search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search username…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>

          {/* Table */}
          <div className="mt-6 block-card overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_120px_140px] px-5 py-3 border-b border-white/10 bg-[#0d0d0f] font-accent text-[10px] uppercase tracking-[0.2em] text-white/50">
              <div>Rank</div>
              <div>Player</div>
              <div className="text-right">{tab === "creeper" ? "Score" : "Eggs"}</div>
              <div className="text-right">Updated</div>
            </div>
            {loading && (
              <div className="px-5 py-8 text-center text-white/40">Loading…</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-white/40">
                No entries yet. Be the first!
              </div>
            )}
            {filtered.map((r, i) => (
              <div
                key={r.mc_username + i}
                data-testid={`row-${i}`}
                className={`grid grid-cols-[60px_1fr_120px_140px] items-center px-5 py-3 border-b border-white/5 ${
                  i === 0 ? "bg-[#22c55e]/5" : ""
                }`}
              >
                <div className="font-pixel text-2xl" style={{ color: i === 0 ? "#f59e0b" : i === 1 ? "#a8a8a8" : i === 2 ? "#cd7f32" : "#a1a1aa" }}>
                  #{i + 1}
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <PixelAvatar name={r.mc_username} size={28} />
                  <div className="font-pixel text-lg text-white truncate">
                    {r.mc_username}
                  </div>
                </div>
                <div className="text-right font-pixel text-2xl text-[#22c55e]">
                  {tab === "creeper" ? r.score : r.count}
                </div>
                <div className="text-right text-xs text-white/40">
                  {r.updated_at
                    ? new Date(r.updated_at).toLocaleDateString()
                    : r.last_claimed
                    ? new Date(r.last_claimed).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/minigames" className="block-btn-ghost">
              ← Back to Minigames
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

function TabBtn({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 font-accent text-[10px] uppercase tracking-[0.2em] border transition-all"
      style={{
        background: active ? "#22c55e" : "#111113",
        color: active ? "#0a0a0a" : "rgba(255,255,255,0.7)",
        borderColor: active ? "#22c55e" : "rgba(255,255,255,0.1)",
        boxShadow: active
          ? "4px 4px 0 rgba(0,0,0,0.5)"
          : "2px 2px 0 rgba(0,0,0,0.6)",
      }}
    >
      {icon}
      {children}
    </button>
  );
}
