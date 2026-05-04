import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import "@/App.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import useServerData from "@/hooks/useServerData";

import Home from "@/pages/Home";
import HowToPlayPage from "@/pages/HowToPlayPage";
import ModsPage from "@/pages/ModsPage";
import GalleryPage from "@/pages/GalleryPage";
import ServerInfoPage from "@/pages/ServerInfoPage";

function Shell() {
  const { info, status } = useServerData();
  const discordUrl = info?.discord_invite_url || "https://discord.gg/pFj6mZubVu";
  const managementUrl =
    info?.management_panel_url || "https://management_panel.mcboost.online/";

  return (
    <>
      <Navbar managementUrl={managementUrl} discordUrl={discordUrl} />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home info={info} status={status} />} />
          <Route
            path="/how-to-play"
            element={<HowToPlayPage info={info} />}
          />
          <Route path="/mods" element={<ModsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route
            path="/server-info"
            element={<ServerInfoPage info={info} status={status} />}
          />
        </Routes>
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
