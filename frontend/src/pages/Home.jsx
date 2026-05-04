import Hero from "@/components/Hero";
import LiveStatus from "@/components/LiveStatus";
import Features from "@/components/Features";
import HowToPlay from "@/components/HowToPlay";
import Mods from "@/components/Mods";
import Gallery from "@/components/Gallery";
import DiscordChat from "@/components/DiscordChat";
import ServerInfo from "@/components/ServerInfo";
import CreeperHunt from "@/components/CreeperHunt";

export default function Home({ info, status }) {
  const discordUrl =
    info?.discord_invite_url || "https://discord.gg/pFj6mZubVu";

  return (
    <div data-testid="home-page">
      <Hero info={info} status={status} discordUrl={discordUrl} />
      <LiveStatus info={info} status={status} />
      <Features />
      <HowToPlay info={info} />
      <Mods />
      <Gallery />
      <DiscordChat status={status} discordUrl={discordUrl} />
      <ServerInfo info={info} status={status} />
      <CreeperHunt />
    </div>
  );
}
