import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { LOGO_URL } from "../constants";
import navData from "../data/nav.json";
import ThemedIcon from "./ThemedIcon";

export default function Navbar({ managementUrl, discordUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const logoClicks = useRef(0);
  const logoTimer = useRef(null);

  // Choose primary nav (first 6 main entries that aren't inactive)
  const NAV = navData.main
    .filter((n) => navData.primary_nav_labels.includes(n.label))
    .filter((n) => !n.inactive);

  const onLogoClick = (e) => {
    if (pathname !== "/") return;
    logoClicks.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(() => {
      logoClicks.current = 0;
    }, 1500);
    if (logoClicks.current === 5) {
      logoClicks.current = 0;
      e.preventDefault();
      toast("⛏ Secret unlocked!", { description: "Enjoy the minigame!" });
      window.__openOurcraftGame?.();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-oc flex items-center justify-between h-20">
        <Link
          to="/"
          data-testid="logo-link"
          onClick={onLogoClick}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <img
              src={LOGO_URL}
              alt="Ourcraft"
              className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="absolute inset-0 bg-[#22c55e]/20 blur-xl -z-10 opacity-60 group-hover:opacity-100 animate-pulse-soft" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-pixel text-3xl text-white tracking-wide">
              OURCRAFT
            </span>
            <span className="font-accent text-[10px] tracking-[0.3em] text-[#22c55e] mt-0.5">
              SMP · 1.21.11
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1.5">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                data-testid={`nav-${n.label.toLowerCase().replace(/ /g, "-")}`}
                className={`group relative flex items-center gap-2 px-3 py-2 font-accent text-[10px] uppercase tracking-[0.2em] transition-all ${
                  active
                    ? "text-[#22c55e]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {/* Hover/active box */}
                <span
                  aria-hidden
                  className={`absolute inset-0 transition-all duration-200 ${
                    active
                      ? "bg-[#22c55e]/10 border border-[#22c55e]/40 shadow-block-sm scale-100 opacity-100"
                      : "bg-[#111113]/0 border border-transparent scale-90 opacity-0 group-hover:bg-[#111113] group-hover:border-white/10 group-hover:scale-100 group-hover:opacity-100 group-hover:shadow-block-sm"
                  }`}
                  style={{ borderRadius: 2 }}
                />
                <span className="relative flex items-center gap-2">
                  <ThemedIcon name={n.icon} size={12} />
                  {n.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={discordUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="nav-discord-btn"
            className="block-btn-ghost"
          >
            Discord
          </a>
          <a
            href={managementUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="nav-management-link"
            title="Staff only — for moderators"
            className="block-btn"
          >
            Mods Panel
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          data-testid="nav-toggle"
          className="lg:hidden p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="lg:hidden border-t border-white/10 bg-[#0a0a0a]"
        >
          <div className="container-oc py-6 grid grid-cols-2 gap-2">
            {navData.main
              .filter((n) => !n.inactive || n.to === "/support")
              .map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  data-testid={`mobile-nav-${n.label.toLowerCase().replace(/ /g, "-")}`}
                  className="flex items-center gap-2 px-3 py-2 bg-[#111113] border border-white/10 shadow-block-sm font-accent text-[10px] uppercase tracking-[0.2em] text-white/80"
                >
                  <ThemedIcon name={n.icon} size={12} />
                  {n.label}
                  {n.inactive && (
                    <span className="ml-auto text-white/30">soon</span>
                  )}
                </Link>
              ))}
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="block-btn-ghost col-span-2"
            >
              Join Discord
            </a>
            <a
              href={managementUrl}
              target="_blank"
              rel="noreferrer"
              className="block-btn col-span-2"
            >
              Mods Panel
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
