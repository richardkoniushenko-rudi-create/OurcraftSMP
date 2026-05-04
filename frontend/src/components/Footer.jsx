import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Home, PlayCircle, Boxes, Image as ImageIcon, Server,
  MessageCircle, Wrench, Package, Github, ArrowUpRight,
  Gamepad2, Trophy, Compass, Gavel, Heart, Book,
} from "lucide-react";
import { LOGO_URL } from "../constants";
import HiddenEgg from "./HiddenEgg";
import ThemedIcon from "./ThemedIcon";
import rules from "../data/rules.json";

export default function Footer({ info }) {
  const exploreLinks = [
    { label: "Home",          href: "/",            icon: Home },
    { label: "How to Play",   href: "/how-to-play", icon: PlayCircle },
    { label: "Starter Guide", href: "/starter",     icon: Book },
    { label: "Mods",          href: "/mods",        icon: Boxes },
    { label: "Gallery",       href: "/gallery",     icon: ImageIcon },
    { label: "Minigames",     href: "/minigames",   icon: Gamepad2 },
    { label: "Leaderboard",   href: "/leaderboard", icon: Trophy },
    { label: "Timeline",      href: "/timeline",    icon: Compass },
    { label: "Rules",         href: "/rules",       icon: Gavel },
    { label: "Live Status",   href: "/live",        icon: Server },
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
      href: info?.management_panel_url || "https://management_panel.mcboost.online/",
      testid: "footer-management-link",
      icon: Wrench,
    },
    {
      label: "Modrinth",
      href: "https://modrinth.com/user/viktor.koniushenko",
      testid: "footer-modrinth-link",
      icon: Package,
    },
    {
      label: "GitHub",
      href: "https://github.com/",
      testid: "footer-github-link",
      icon: Github,
    },
    {
      label: "Support Us · soon",
      href: "/support",
      testid: "footer-support-link",
      icon: Heart,
      internal: true,
    },
  ];

  const ruleHighlights = useMemo(
    () => rules.minecraft.slice(0, 3),
    [],
  );

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
                className="h-12 w-12 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <div>
                <div className="font-pixel text-2xl text-white">OURCRAFT</div>
                <div className="font-accent text-[9px] tracking-[0.3em] text-[#22c55e]">
                  SMP · 1.21.11
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

            {/* Rule highlights — visible on every page */}
            <div className="mt-6 block-card p-4">
              <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e] flex items-center gap-2">
                <Gavel size={12} /> Server rules at a glance
              </div>
              <ul className="mt-2 text-xs text-white/65 space-y-1.5">
                {ruleHighlights.map((r) => (
                  <li key={r.title} className="flex items-start gap-2">
                    <span
                      className="w-5 h-5 flex items-center justify-center bg-[#22c55e]/15 text-[#22c55e] flex-shrink-0 mt-0.5"
                      aria-hidden
                    >
                      <ThemedIcon name={r.icon} size={11} />
                    </span>
                    <span className="leading-tight">{r.title}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/rules"
                className="mt-3 inline-block font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e] hover:underline"
              >
                Read all rules →
              </Link>
            </div>
          </div>

          <div>
            <div className="overline">Explore</div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {exploreLinks.map((l) => (
                <BlockyLink key={l.href} href={l.href} Icon={l.icon} internal>
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
                  external={!l.internal}
                  internal={l.internal}
                  Icon={l.icon}
                  data-testid={l.testid}
                >
                  {l.label}
                </BlockyLink>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} Ourcraft SMP — not affiliated with Mojang.
            </span>
            <HiddenEgg eggId="footer_emerald" emoji="🟢" size={14} />
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

function BlockyLink({ href, external, internal, Icon, children, ...rest }) {
  const inner = (
    <>
      <span
        className="flex items-center justify-center w-6 h-6 bg-[#1a1a1d] text-[#22c55e] border border-white/5 transition-colors group-hover:bg-[#22c55e]/15"
      >
        <Icon size={14} />
      </span>
      <span className="flex-1 truncate">{children}</span>
      {external && (
        <ArrowUpRight
          size={14}
          className="text-white/30 group-hover:text-[#22c55e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );

  const baseClass =
    "group relative flex items-center gap-3 px-3 py-2 bg-[#111113] border border-white/10 shadow-block-sm font-accent text-[10px] uppercase tracking-[0.2em] text-white/80 overflow-hidden transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-block hover:border-[#22c55e]/40 hover:text-[#22c55e]";

  if (internal && !external) {
    return (
      <Link to={href} className={baseClass} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={baseClass}
      {...rest}
    >
      {inner}
    </a>
  );
}
