"use client";
import { motion } from "motion/react";

interface Achievement {
  id: string;
  name: string;
  emoji: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  desc: string;
}

interface AchievementGridProps {
  achievements: Achievement[];
}

const RARITY_STYLES: Record<string, { border: string; bg: string; glow: string; label: string; labelColor: string }> = {
  common:    { border: "rgba(0,0,0,0.06)",     bg: "rgba(0,0,0,0.01)",     glow: "none",                    label: "Common",    labelColor: "#9B8E84" },
  rare:      { border: "rgba(28,176,246,0.2)",  bg: "rgba(28,176,246,0.04)",  glow: "0 0 8px rgba(28,176,246,0.2)",  label: "Rare",      labelColor: "#1CB0F6" },
  epic:      { border: "rgba(206,130,255,0.2)", bg: "rgba(206,130,255,0.04)", glow: "0 0 12px rgba(206,130,255,0.25)", label: "Epic",      labelColor: "#CE82FF" },
  legendary: { border: "rgba(255,200,0,0.3)",   bg: "rgba(255,200,0,0.06)",   glow: "0 0 20px rgba(255,200,0,0.3)",   label: "Legendary", labelColor: "#D9A441" },
};

export default function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <motion.div
      className="rounded-2xl p-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ border: "1.5px solid rgba(0,0,0,0.04)", background: "rgba(0,0,0,0.01)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
          Achievements
        </h3>
        <span className="text-[11px] font-semibold text-[#9B8E84]">
          {achievements.filter(a => a.unlocked).length}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {achievements.map((a, i) => {
          const style = RARITY_STYLES[a.rarity];
          return (
            <motion.div
              key={a.id}
              className="flex flex-col items-center gap-1 p-2 rounded-xl text-center"
              style={{
                background: a.unlocked ? style.bg : "rgba(0,0,0,0.02)",
                border: `1px solid ${a.unlocked ? style.border : "rgba(0,0,0,0.04)"}`,
                boxShadow: a.unlocked ? style.glow : "none",
                opacity: a.unlocked ? 1 : 0.35,
                filter: a.unlocked ? "none" : "grayscale(1)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: a.unlocked ? 1 : 0.35, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring" }}
              whileHover={a.unlocked ? { scale: 1.08 } : {}}
            >
              <span className="text-[22px]">{a.unlocked ? a.emoji : "🔒"}</span>
              <span
                className="text-[9px] font-extrabold leading-tight"
                style={{ color: a.unlocked ? "#3D2E24" : "#9B8E84", fontFamily: "var(--font-baloo)" }}
              >
                {a.name}
              </span>
              {a.unlocked && (
                <span
                  className="text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                  style={{ background: `${style.labelColor}15`, color: style.labelColor }}
                >
                  {style.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export type { Achievement };
