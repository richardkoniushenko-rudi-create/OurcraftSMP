export const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_craft-portal-17/artifacts/gokkam2h_image%20%281%29_Nero_AI_Image_Upscaler_Reconstruct%20%281%29.png";

export const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/742acadb6c5873dea07ac596ec48a1376bf2f88e5814c5ad1380d3eef15891bf.png";

export const FEATURES_BG =
  "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/99fc1482770e6d78b42e6c8acce6d7f80a0544917c172eca57af6d981f544089.png";

export const MODS_BG =
  "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/8d24596330b37ce80a5a9b9ef761ead74026afddd425289c4ac95c4c54908fa5.png";

export const GALLERY = [
  {
    url: "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/742acadb6c5873dea07ac596ec48a1376bf2f88e5814c5ad1380d3eef15891bf.png",
    title: "Spawn Overworld",
  },
  {
    url: "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/99fc1482770e6d78b42e6c8acce6d7f80a0544917c172eca57af6d981f544089.png",
    title: "Custom Terrain",
  },
  {
    url: "https://static.prod-images.emergentagent.com/jobs/258f7627-9ce4-4722-9651-f50efe1127c0/images/8d24596330b37ce80a5a9b9ef761ead74026afddd425289c4ac95c4c54908fa5.png",
    title: "Dungeon Depths",
  },
  {
    url: "https://images.unsplash.com/photo-1606503153255-59d8b2e4739e?auto=format&fit=crop&w=1200&q=80",
    title: "Creeper Valley",
  },
  {
    url: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?auto=format&fit=crop&w=1200&q=80",
    title: "Pixel Peaks",
  },
  {
    url: "https://images.unsplash.com/photo-1590422749897-47726d3f7241?auto=format&fit=crop&w=1200&q=80",
    title: "Village Build",
  },
];

// Categorised mods — used in Mods page tabs
export const MOD_CATEGORIES = [
  { key: "terrain", label: "Terrain", color: "#22c55e" },
  { key: "structures", label: "Structures", color: "#8b5a2b" },
  { key: "tech", label: "Technology", color: "#06b6d4" },
  { key: "food", label: "Food", color: "#f59e0b" },
  { key: "utility", label: "Utility", color: "#a78bfa" },
  { key: "travel", label: "Travel", color: "#ef4444" },
];

export const MODS_BY_CAT = {
  terrain: [
    {
      name: "Terralith",
      description:
        "Rewrites the overworld with 85+ new biomes, dramatic mountains, hidden caves and towering cliffs.",
      tip: "Try /locate biome terralith:lush_valley near spawn.",
    },
    {
      name: "William Wythers' Overhauled Overworld",
      description:
        "Drop-in biome expansion that adds dozens of atmospheric biomes compatible with Terralith.",
      tip: "Pair with Terralith — they're designed to coexist.",
    },
    {
      name: "Tectonic",
      description:
        "Taller, more epic terrain generation with deeper oceans and massive mountain ranges.",
      tip: "Climb the alpine biomes for stunning views of spawn.",
    },
  ],
  structures: [
    {
      name: "YUNG's Better Structures",
      description:
        "Overhauls strongholds, dungeons, mineshafts and ocean monuments with richer loot & handmade rooms.",
      tip: "Bring torches — strongholds now have multiple floors.",
    },
    {
      name: "Repurposed Structures",
      description:
        "Adds biome-specific variants of villages, outposts and fortresses for more immersion.",
      tip: "Snow villages have exclusive loot — raid them early.",
    },
    {
      name: "Towns & Towers",
      description:
        "Adds unique towns, pillager towers and boat wrecks for exploration rewards.",
      tip: "Pillager towers drop high-tier crossbows.",
    },
  ],
  tech: [
    {
      name: "Create",
      description:
        "Kinetic contraptions, windmills, rail networks and automation using rotating shafts.",
      tip: "Craft andesite alloy early — it's the backbone of every build.",
    },
    {
      name: "Create: Steam 'n' Rails",
      description:
        "Expands Create with full train networks, signals and passenger carriages.",
      tip: "Lay tracks between friends' bases for instant transport.",
    },
    {
      name: "Applied Energistics 2",
      description:
        "Digital storage network — store thousands of items in crafted ME drives with craft-on-demand.",
      tip: "Start with a 1k drive + terminal — scale as you go.",
    },
  ],
  food: [
    {
      name: "Farmer's Delight",
      description:
        "Adds kitchens, stoves and a full cooking system with 50+ dishes that grant buffs.",
      tip: "Roasted Mutton Chops give nourishment for 3 minutes.",
    },
    {
      name: "Croptopia",
      description:
        "Dozens of new crops, fruits and juices to farm, cook and trade.",
      tip: "Plant orange trees near water for passive XP farming.",
    },
  ],
  utility: [
    {
      name: "Sophisticated Backpacks",
      description:
        "Tiered backpacks with upgrades: magnets, pickup, crafting, XP absorption.",
      tip: "Dye your backpack in a crafting table to coordinate team colors.",
    },
    {
      name: "JEI (Just Enough Items)",
      description:
        "Shows crafting recipes for every item — press R on any item to see how it's made.",
      tip: "Press U to see what an item is used for.",
    },
    {
      name: "Iron Chests",
      description:
        "Bigger, upgradable chests — iron, gold, diamond tiers.",
      tip: "Iron chests hold 54 slots, diamonds hold 108.",
    },
  ],
  travel: [
    {
      name: "Waystones",
      description:
        "Build public or private waystones to fast-travel between community bases.",
      tip: "Ourcraft has 12 public waystones — explore spawn to discover them.",
    },
    {
      name: "Xaero's Minimap",
      description:
        "Minimap + fullscreen world map with waypoints and cave visibility.",
      tip: "Press M to open the world map; right-click to place waypoints.",
    },
  ],
};

export const DATAPACKS = [
  {
    name: "Graves",
    category: "utility",
    description:
      "When you die, a grave marker is placed at your death location holding your full inventory.",
  },
  {
    name: "AFK Display",
    category: "utility",
    description:
      "Shows an `[AFK]` tag above idle players so the community knows who's active.",
  },
  {
    name: "Custom Recipes",
    category: "utility",
    description:
      "Crafting recipes for name tags, saddles and elytra repair kits.",
  },
  {
    name: "Treasure Maps++",
    category: "structures",
    description:
      "Adds more variety to cartographer-sold treasure maps including ancient cities.",
  },
  {
    name: "More Mob Heads",
    category: "structures",
    description:
      "Every hostile mob has a chance to drop its head when killed by a player.",
  },
  {
    name: "Cross-Dimension Day/Night",
    category: "terrain",
    description: "Nether and End skies pulse with synchronized day/night.",
  },
];

export const HOW_TO_PLAY = [
  {
    step: "01",
    title: "Get Minecraft Java",
    body: "Own Minecraft: Java Edition on a PC. Bedrock is not supported.",
  },
  {
    step: "02",
    title: "Install Fabric + Modpack",
    body: "Install the Fabric loader for 1.21.1, then drop the Ourcraft modpack into your mods folder.",
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
