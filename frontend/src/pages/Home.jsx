import Hero from "@/components/Hero";
import LiveStatus from "@/components/LiveStatus";
import Features from "@/components/Features";
import HowToPlay from "@/components/HowToPlay";
import Mods from "@/components/Mods";
import Gallery from "@/components/Gallery";
import DiscordChat from "@/components/DiscordChat";
import ServerInfo from "@/components/ServerInfo";
import HiddenEgg from "@/components/HiddenEgg";

export default function Home({ info, status }) {
  const discordUrl =
    info?.discord_invite_url || "https://discord.gg/pFj6mZubVu";

  return (
    <div data-testid="home-page">
      <div style={{ position: "relative" }}>
        <Hero info={info} status={status} discordUrl={discordUrl} />
        {/* Hidden creeper egg — tucked into hero */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 120,
            right: 40,
            zIndex: 2,
          }}
        >
          <HiddenEgg eggId="hero_creeper" emoji="🟩" size={18} />
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <LiveStatus info={info} status={status} />
        {/* Hidden diamond — small and subtle */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 28,
            left: "48%",
            zIndex: 2,
          }}
        >
          <HiddenEgg eggId="live_diamond" emoji="💎" size={16} />
        </div>
      </div>

      <Features />
      <HowToPlay info={info} />
      <Mods />

      <div style={{ position: "relative" }}>
        <Gallery />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 60,
            right: 80,
            zIndex: 2,
          }}
        >
          <HiddenEgg eggId="gallery_ruby" emoji="💍" size={16} />
        </div>
      </div>

      <DiscordChat status={status} discordUrl={discordUrl} />
      <ServerInfo info={info} status={status} />
    </div>
  );
}
