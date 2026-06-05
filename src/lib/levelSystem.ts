export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  badge: string;
  color: string;
}

export const XP_LEVELS: LevelInfo[] = [
  { level: 1,  title: "Seedling",     minXP: 0,      badge: "🌱", color: "#7BA65B" },
  { level: 2,  title: "Sprout",       minXP: 500,    badge: "🌿", color: "#58CC02" },
  { level: 3,  title: "Sapling",      minXP: 1200,   badge: "🌳", color: "#46A302" },
  { level: 4,  title: "Green Branch", minXP: 2200,   badge: "🍃", color: "#94A84D" },
  { level: 5,  title: "Young Tree",   minXP: 3500,   badge: "🌲", color: "#5F8C3E" },
  { level: 6,  title: "Sturdy Trunk", minXP: 5200,   badge: "🪵", color: "#5B4636" },
  { level: 7,  title: "Shady Canopy", minXP: 7300,   badge: "⛱️", color: "#D9A441" },
  { level: 8,  title: "Great Oak",    minXP: 10000,  badge: "🏛️", color: "#C08A2E" },
  { level: 9,  title: "Ancient Elder",minXP: 13500,  badge: "📜", color: "#3D2E24" },
  { level: 10, title: "Ecosystem",    minXP: 18000,  badge: "🌍", color: "#1CB0F6" },
];

export function getLevelFromXP(xp: number): LevelInfo {
  let current = XP_LEVELS[0];
  for (const level of XP_LEVELS) {
    if (xp >= level.minXP) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getProgressToNext(xp: number): { percentage: number; remaining: number; nextLevelXP: number } {
  const current = getLevelFromXP(xp);
  const currentIndex = XP_LEVELS.findIndex(l => l.level === current.level);
  const next = XP_LEVELS[currentIndex + 1];

  if (!next) return { percentage: 100, remaining: 0, nextLevelXP: current.minXP };

  const range = next.minXP - current.minXP;
  const progress = xp - current.minXP;
  const percentage = Math.min(100, Math.max(0, (progress / range) * 100));

  return {
    percentage,
    remaining: next.minXP - xp,
    nextLevelXP: next.minXP
  };
}
