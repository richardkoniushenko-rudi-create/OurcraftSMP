import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { LOGO_URL } from "../constants";

const NAV = [
  { label: "Home", to: "/" },
  { label: "How to Play", to: "/how-to-play" },
  { label: "Mods", to: "/mods" },
  { label: "Gallery", to: "/gallery" },
  { label: "Minigames", to: "/minigames" },
  { label: "Server Info", to: "/server-info" },
];

export default function Navbar({ managementUrl, discordUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const logoClicks = useRef(0);
  const logoTimer = useRef(null);

  const onLogoClick = (e) => {
    // Only trigger the easter egg if user is already on "/"
    if (pathname !== "/") return;
    logoClicks.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(() => {
      logoClicks.current = 0;
    }, 1500);
    if (logoClicks.current === 5) {
      logoClicks.current = 0;
      e.preventDefault();
      toast("⛏ Secret unlocked!", {
        description: "Enjoy the minigame — break the blocks!",
      });
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
      <div className="container-oc flex items-center justify-between h-16">
        <Link to="/" data-testid="logo-link" onClick={onLogoClick} className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Ourcraft"
            className="h-10 w-10 object-contain image-render-pixel"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="flex flex-col leading-none">
            <span className="font-pixel text-2xl text-white">OURCRAFT</span>
            <span className="font-accent text-[9px] tracking-[0.3em] text-[#22c55e]">
              SMP
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase().replace(/ /g, "-")}`}
              className={`font-accent text-xs uppercase tracking-[0.2em] transition-colors ${
                pathname === n.to
                  ? "text-[#22c55e]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {n.label}
            </Link>
          ))}
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
          <div className="container-oc py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                data-testid={`mobile-nav-${n.label.toLowerCase().replace(/ /g, "-")}`}
                className="font-accent text-sm uppercase tracking-[0.2em] text-white/80"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                className="block-btn-ghost"
                data-testid="mobile-discord-btn"
              >
                Join Discord
              </a>
              <a
                href={managementUrl}
                target="_blank"
                rel="noreferrer"
                className="block-btn"
                data-testid="mobile-management-link"
              >
                Mods Panel (Staff)
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
