import { LOGO_URL } from "../constants";

export default function Footer({ info }) {
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
            <ul className="mt-4 space-y-2 text-white/70 text-sm">
              <li>
                <a href="/" className="hover:text-[#22c55e]">
                  Home
                </a>
              </li>
              <li>
                <a href="/how-to-play" className="hover:text-[#22c55e]">
                  How to Play
                </a>
              </li>
              <li>
                <a href="/mods" className="hover:text-[#22c55e]">
                  Mods
                </a>
              </li>
              <li>
                <a href="/gallery" className="hover:text-[#22c55e]">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/server-info" className="hover:text-[#22c55e]">
                  Server Info
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="overline">External</div>
            <ul className="mt-4 space-y-2 text-white/70 text-sm">
              <li>
                <a
                  href={info?.discord_invite_url || "https://discord.gg/pFj6mZubVu"}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="footer-discord-link"
                  className="hover:text-[#22c55e]"
                >
                  Discord Server →
                </a>
              </li>
              <li>
                <a
                  href={info?.management_panel_url || "https://management_panel.mcboost.online/"}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="footer-management-link"
                  className="hover:text-[#22c55e]"
                >
                  Mods Panel (Staff) →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/40">
            © {new Date().getFullYear()} Ourcraft SMP — not affiliated with
            Mojang.
          </div>
          <div className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/40">
            Built block by block.
          </div>
        </div>
      </div>
    </footer>
  );
}
