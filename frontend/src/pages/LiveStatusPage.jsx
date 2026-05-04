import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { fetchServerStatus, fetchServerInfo } from "../lib/api";
import ServerStatusPill from "../components/ServerStatusPill";

export default function LiveStatusPage({ info: initialInfo, status: initialStatus }) {
  const [info, setInfo] = useState(initialInfo || null);
  const [status, setStatus] = useState(initialStatus || null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const [s, i] = await Promise.all([
        fetchServerStatus(),
        fetchServerInfo(),
      ]);
      setStatus(s);
      setInfo(i);
      setUpdatedAt(new Date());
    } catch {
      /* ignore */
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, []);

  const indicator = !status?.online
    ? { color: "#ef4444", label: "Offline", icon: <WifiOff size={14} /> }
    : (status?.players_online || 0) > 80
    ? { color: "#f59e0b", label: "Busy", icon: <Wifi size={14} /> }
    : { color: "#22c55e", label: "Online", icon: <Wifi size={14} /> };

  const motd = `${info?.name || "Ourcraft SMP"} — ${info?.tagline || "Modded survival"}`;

  return (
    <div data-testid="live-page" className="pt-28">
      <section className="section-pad pt-4">
        <div className="container-oc">
          <div className="flex items-center gap-3 mb-6">
            <span className="overline">Live Status</span>
            <div className="pixel-divider flex-1 max-w-xs" />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-pixel text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
                Live <span className="text-[#22c55e]">Status</span>
              </h1>
              <p className="text-white/60 mt-3 max-w-xl">
                Real-time server data via the Discord bot. Refreshes every 30
                seconds; click the refresh icon for a manual update.
              </p>
            </div>
            <ServerStatusPill status={status} />
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat
              label="Players Online"
              value={status?.players_online ?? 0}
              sub={`of ${status?.max_players ?? 200} slots`}
              color="#22c55e"
            />
            <Stat
              label="Discord Online"
              value={status?.discord_online ?? 0}
              sub={`${status?.discord_members ?? 0} total members`}
              color="#06b6d4"
            />
            <Stat
              label="TPS"
              value={"—"}
              sub="Requires server-side metrics plugin"
              color="#94a3b8"
            />
            <Stat
              label="Uptime"
              value={info?.uptime || "99.9%"}
              sub="last 30 days"
              color="#f59e0b"
            />
          </div>

          <div className="mt-6 grid lg:grid-cols-[2fr_1fr] gap-6">
            <div className="block-card p-5">
              <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
                MOTD
              </div>
              <div className="font-pixel text-2xl text-white mt-2">{motd}</div>
              <div className="mt-4 text-sm text-white/60 leading-relaxed">
                Server IP: <span className="text-[#22c55e]">{info?.ip}</span>
                <br />
                Version: Minecraft Java {info?.version} · Fabric · Server-side modded
                <br />
                Hardware: {info?.cpu} · {info?.ram}
              </div>
            </div>
            <div className="block-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-9 h-9 flex items-center justify-center"
                    style={{ background: `${indicator.color}1f`, color: indicator.color }}
                  >
                    {indicator.icon}
                  </span>
                  <div>
                    <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/50">
                      Indicator
                    </div>
                    <div
                      className="font-pixel text-2xl"
                      style={{ color: indicator.color }}
                    >
                      {indicator.label}
                    </div>
                  </div>
                </div>
                <button
                  data-testid="refresh-btn"
                  onClick={refresh}
                  className="block-btn-ghost !px-3 !py-2"
                  title="Refresh"
                >
                  <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                </button>
              </div>
              <div className="mt-4 text-xs text-white/40">
                Last updated: {updatedAt ? updatedAt.toLocaleTimeString() : "—"}
              </div>
            </div>
          </div>

          <div className="mt-8 block-card p-6 bg-gradient-to-br from-[#06b6d4]/10 to-transparent">
            <div className="overline">Map</div>
            <div className="font-pixel text-3xl text-white mt-2">
              Live World Map
            </div>
            <p className="text-white/60 text-sm mt-2 max-w-xl">
              Dynmap / BlueMap link is reserved here. When ready, paste the
              live URL in <code className="text-[#06b6d4]">backend/.env</code> as{" "}
              <code className="text-[#06b6d4]">MAP_URL</code> and we'll embed
              it automatically.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 font-accent text-[10px] uppercase tracking-[0.2em]">
              Coming Soon
            </div>
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

function Stat({ label, value, sub, color }) {
  return (
    <div className="block-card p-5">
      <div
        className="font-accent text-[10px] uppercase tracking-[0.2em]"
        style={{ color }}
      >
        {label}
      </div>
      <div className="font-pixel text-4xl text-white leading-none mt-2">
        {value}
      </div>
      <div className="text-xs text-white/45 mt-2">{sub}</div>
    </div>
  );
}
