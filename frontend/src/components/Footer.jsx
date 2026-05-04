import {
  Home,
  PlayCircle,
  Boxes,
  Image as ImageIcon,
  Server,
  MessageCircle,
  Wrench,
  Package,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { LOGO_URL } from "../constants";

/**
 * Simple M-mark for Modrinth (their brand mark redrawn as a pixel glyph)
 */
function ModrinthIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <path
        d="M3 3h2v2h2v2H5v6H3V3zm6 0h2v10h-2V9H9V7h2V5H9V3zm4 0h-2v10h2V3z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer({ info }) {
  const exploreLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "How to Play", href: "/how-to-play", icon: PlayCircle },
    { label: "Mods", href: "/mods", icon: Boxes },
    { label: "Gallery", href: "/gallery", icon: ImageIcon },
    { label: "Server Info", href: "/server-info", icon: Server },
  ];

  const externalLinks = [
    {
      label: "Discord",
      href: info?.discord_invite_url || "https://discord.gg/pFj6mZubVu",
      testid: "footer-discord-link",
      icon: MessageCircle,
    },
    {
      label: "Mods Panel · Staff",
      href:
        info?.management_panel_url ||
        "https://management_panel.mcboost.online/",
      testid: "footer-management-link",
      icon: Wrench,
    },
    {
      label: "Modrinth",
      href: "https://modrinth.com/user/viktor.koniushenko",
      testid: "footer-modrinth-link",
      icon: Package,
      accent: "#22c55e",
    },
    {
      label: "GitHub",
      href: "https://github.com/",
      testid: "footer-github-link",
      icon: Github,
    },
  ];

  return (
    <footer
      data-testid="footer"
      className="relative z-[2] border-t border-white/10 bg-[#08080a] pt-14 pb-8"
    >
      <div className="container-oc">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={LOGO_URL}
                alt="Ourcraft"
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="font-pixel text-2xl text-white">OURCRAFT</div>
                <div className="font-accent text-[9px] tracking-[0.3em] text-[#22c55e]">
                  SMP
                </div>
              </div>
            </div>
            <p className="text-white/55 text-sm mt-4 max-w-sm">
              A modded Minecraft survival server with custom terrain, custom
              structures and a community that actually shows up.
            </p>
            <div className="mt-4 flex items-center gap-2 font-accent text-[10px] uppercase tracking-[0.2em]">
              <span className="w-2 h-2 bg-[#22c55e] animate-pulse-soft" />
              <span className="text-white/60">
                {info?.ip || "play.ourcraft.online"}
              </span>
            </div>
          </div>

          <div>
            <div className="overline">Explore</div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {exploreLinks.map((l) => (
                <BlockyLink key={l.href} href={l.href} Icon={l.icon}>
                  {l.label}
                </BlockyLink>
              ))}
            </div>
          </div>

          <div>
            <div className="overline">External</div>
            <div className="mt-4 flex flex-col gap-2">
              {externalLinks.map((l) => (
                <BlockyLink
                  key={l.href}
                  href={l.href}
                  external
                  Icon={l.icon}
                  data-testid={l.testid}
                  accent={l.accent}
                >
                  {l.label}
                </BlockyLink>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/40">
            © {new Date().getFullYear()} Ourcraft SMP — not affiliated with
            Mojang.
          </div>
          <div
            className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/40"
            data-testid="footer-easter-hint"
            title="Try the Konami code… ↑ ↑ ↓ ↓ ← → ← → B A"
          >
            Built block by block.
          </div>
        </div>
      </div>
    </footer>
  );
}

function BlockyLink({ href, external, Icon, accent, children, ...rest }) {
  const props = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <a
      href={href}
      {...props}
      {...rest}
      className="group relative flex items-center gap-3 px-3 py-2 bg-[#111113] border border-white/10 shadow-block-sm font-accent text-[10px] uppercase tracking-[0.2em] text-white/80 overflow-hidden transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-block hover:border-[#22c55e]/40 hover:text-[#22c55e]"
    >
      <span
        className="flex items-center justify-center w-6 h-6 bg-[#1a1a1d] text-[#22c55e] border border-white/5 transition-colors group-hover:bg-[#22c55e]/15"
        style={accent ? { color: accent } : undefined}
      >
        {Icon === ModrinthIcon ? <ModrinthIcon size={14} /> : <Icon size={14} />}
      </span>
      <span className="flex-1 truncate">{children}</span>
      {external && (
        <ArrowUpRight
          size={14}
          className="text-white/30 group-hover:text-[#22c55e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </a>
  );
}
