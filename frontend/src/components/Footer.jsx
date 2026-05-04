import { LOGO_URL } from "../constants";

export default function Footer({ info }) {
  const exploreLinks = [
    { label: "Home", href: "/" },
    { label: "How to Play", href: "/how-to-play" },
    { label: "Mods", href: "/mods" },
    { label: "Gallery", href: "/gallery" },
    { label: "Server Info", href: "/server-info" },
  ];

  const externalLinks = [
    {
      label: "Discord",
      href: info?.discord_invite_url || "https://discord.gg/pFj6mZubVu",
      testid: "footer-discord-link",
    },
    {
      label: "Mods Panel · Staff",
      href:
        info?.management_panel_url ||
        "https://management_panel.mcboost.online/",
      testid: "footer-management-link",
    },
  ];

  return (
    <footer
      data-testid="footer"
      className="border-t border-white/10 bg-[#08080a] pt-14 pb-8"
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
            <div className="mt-4 grid grid-cols-2 gap-2">
              {exploreLinks.map((l) => (
                <BlockyLink
                  key={l.href}
                  href={l.href}
                  data-testid={`footer-explore-${l.label.toLowerCase().replace(/ /g, "-")}`}
                >
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
                  data-testid={l.testid}
                >
                  {l.label} →
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
            title="Try the Konami code… up up down down left right left right b a"
          >
            Built block by block.
          </div>
        </div>
      </div>
    </footer>
  );
}

function BlockyLink({ href, external, children, ...rest }) {
  const props = external
    ? { target: "_blank", rel: "noreferrer" }
    : {};
  return (
    <a
      href={href}
      {...props}
      {...rest}
      className="group flex items-center justify-between px-3 py-2 bg-[#111113] border border-white/10 shadow-block-sm font-accent text-[10px] uppercase tracking-[0.2em] text-white/75 transition-transform duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-block hover:border-[#22c55e]/40 hover:text-[#22c55e]"
    >
      <span>{children}</span>
      <span className="w-1.5 h-1.5 bg-[#22c55e]/60 group-hover:bg-[#22c55e]" />
    </a>
  );
}
