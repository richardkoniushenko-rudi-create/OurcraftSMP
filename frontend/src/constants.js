/**
 * Site content - easy to edit
 * =======================================================================
 * To edit mods & datapacks: open `src/data/mods.json` (see instructions inside)
 * To edit gallery images:   edit the GALLERY array below
 * To edit features copy:    edit the FEATURES array below
 * To edit how-to-play:      edit the HOW_TO_PLAY array below
 * =======================================================================
 */

import modsData from "./data/mods.json";

export const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_craft-portal-17/artifacts/gokkam2h_image%20%281%29_Nero_AI_Image_Upscaler_Reconstruct%20%281%29.png";

export const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/742acadb6c5873dea07ac596ec48a1376bf2f88e5814c5ad1380d3eef15891bf.png";

export const FEATURES_BG =
  "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/99fc1482770e6d78b42e6c8acce6d7f80a0544917c172eca57af6d981f544089.png";

export const MODS_BG =
  "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/8d24596330b37ce80a5a9b9ef761ead74026afddd425289c4ac95c4c54908fa5.png";

// -----------------------------------------------------------------------
// Mods & datapacks — loaded from src/data/mods.json (edit that file!)
// -----------------------------------------------------------------------
export const MOD_CATEGORIES = modsData.categories;
export const MODS_BY_CAT = modsData.mods;
export const DATAPACKS = modsData.datapacks;

// -----------------------------------------------------------------------
// Gallery images — generated pixel-art scenes at /public/gallery
// -----------------------------------------------------------------------
export const GALLERY = [
  { url: "/gallery/overworld.png", title: "Spawn Overworld" },
  { url: "/gallery/mountain.png", title: "Sunset Peaks" },
  { url: "/gallery/build.png", title: "Castle Build" },
  { url: "/gallery/cave.png", title: "Deepdark Cave" },
  { url: "/gallery/nether.png", title: "Nether Fortress" },
  { url: "/gallery/ocean.png", title: "Island Outpost" },
];

// -----------------------------------------------------------------------
// How-to-play steps
// -----------------------------------------------------------------------
export const HOW_TO_PLAY = [
  {
    step: "01",
    title: "Get Minecraft Java",
    body: "Own Minecraft: Java Edition on a PC. Bedrock is not supported.",
  },
  {
    step: "02",
    title: "Install Fabric + Modpack",
    body: "Install the Fabric loader for your game version, then drop the Ourcraft modpack into your mods folder.",
  },
  {
    step: "03",
    title: "Allocate 4–6GB RAM",
    body: "In your launcher, give Minecraft at least 4GB RAM for a smooth modded experience.",
  },
  {
    step: "04",
    title: "Add the Server & Join",
    body: "Multiplayer → Add Server → paste the IP → hit Join. See you at spawn!",
  },
];

// -----------------------------------------------------------------------
// Landing features
// -----------------------------------------------------------------------
export const FEATURES = [
  {
    title: "Modded Survival",
    body: "Hand-picked mods that expand gameplay without breaking vanilla feel — tech, magic, food, storage and more.",
    span: "md:col-span-8",
    accent: "emerald",
  },
  {
    title: "Custom Terrain",
    body: "Towering mountains, hidden aquifers, floating isles — no biome is boring.",
    span: "md:col-span-4",
    accent: "diamond",
  },
  {
    title: "Custom Structures",
    body: "Dungeons, villages and towers rebuilt from the ground up with unique loot tables.",
    span: "md:col-span-4",
    accent: "dirt",
  },
  {
    title: "Close-Knit SMP",
    body: "Active Discord, weekly events, staff that actually plays. Not just another public server.",
    span: "md:col-span-8",
    accent: "emerald",
  },
];
