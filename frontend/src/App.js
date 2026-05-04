import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

import "@/App.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import EasterEggs from "@/components/EasterEggs";
import BlockFall from "@/components/BlockFall";
import useServerData from "@/hooks/useServerData";

import Home from "@/pages/Home";
import HowToPlayPage from "@/pages/HowToPlayPage";
import ModsPage from "@/pages/ModsPage";
import GalleryPage from "@/pages/GalleryPage";
import ServerInfoPage from "@/pages/ServerInfoPage";
import MinigamesPage from "@/pages/MinigamesPage";
import RulesPage from "@/pages/RulesPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import LiveStatusPage from "@/pages/LiveStatusPage";
import StarterGuidePage from "@/pages/StarterGuidePage";
import TimelinePage from "@/pages/TimelinePage";
import SupportUsPage from "@/pages/SupportUsPage";

function AnimatedRoutes({ info, status }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home info={info} status={status} />} />
          <Route path="/how-to-play" element={<HowToPlayPage info={info} />} />
          <Route path="/mods" element={<ModsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/minigames" element={<MinigamesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rules" element={<RulesPage info={info} />} />
          <Route
            path="/live"
            element={<LiveStatusPage info={info} status={status} />}
          />
          <Route path="/starter" element={<StarterGuidePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/support" element={<SupportUsPage />} />
          <Route
            path="/server-info"
            element={<ServerInfoPage info={info} status={status} />}
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Shell() {
  const { info, status } = useServerData();
  const discordUrl = info?.discord_invite_url || "https://discord.gg/pFj6mZubVu";
  const managementUrl =
    info?.management_panel_url || "https://management_panel.mcboost.online/";

  return (
    <>
      <BlockFall density={22} />
      <Navbar managementUrl={managementUrl} discordUrl={discordUrl} />
      <main className="min-h-screen relative z-[1]">
        <AnimatedRoutes info={info} status={status} />
      </main>
      <Footer info={info} />
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CustomCursor />
        <EasterEggs />
        <Shell />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontFamily: "'IBM Plex Sans', sans-serif",
              borderRadius: "2px",
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}
