/**
 * Random Minecraft-style nickname generator.
 * Generated on first visit and persisted in localStorage so users
 * keep the same identity across sessions.
 */
const ADJECTIVES = [
  "Emerald",
  "Diamond",
  "Obsidian",
  "Netherite",
  "Shadow",
  "Phantom",
  "Glowing",
  "Pixel",
  "Ender",
  "Frosty",
  "Blazing",
  "Crimson",
  "Warped",
  "Ancient",
  "Swift",
  "Stone",
  "Iron",
  "Golden",
  "Lapis",
  "Amethyst",
  "Creepy",
  "Royal",
  "Mystic",
  "Ghostly",
  "Sparkling",
  "Thunder",
  "Echo",
  "Quiet",
  "Lucky",
  "Wandering",
];

const NOUNS = [
  "Miner",
  "Wolf",
  "Raven",
  "Fox",
  "Creeper",
  "Warden",
  "Phantom",
  "Villager",
  "Piglin",
  "Skeleton",
  "Axolotl",
  "Allay",
  "Sniffer",
  "Llama",
  "Bee",
  "Ocelot",
  "Strider",
  "Drake",
  "Knight",
  "Rogue",
  "Scout",
  "Ranger",
  "Hunter",
  "Bard",
  "Forgemaster",
  "Glider",
  "Sculker",
  "Wanderer",
  "Builder",
  "Tinker",
];

const STORAGE_KEY = "ourcraft.nickname";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateNickname() {
  const n = Math.floor(Math.random() * 900 + 100); // 100-999
  return `${pick(ADJECTIVES)}_${pick(NOUNS)}_${n}`;
}

export function getOrCreateNickname() {
  if (typeof window === "undefined") return "Anon";
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const fresh = generateNickname();
    window.localStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return generateNickname();
  }
}

export function regenerateNickname() {
  const fresh = generateNickname();
  try {
    window.localStorage.setItem(STORAGE_KEY, fresh);
  } catch {
    /* ignore */
  }
  return fresh;
}
