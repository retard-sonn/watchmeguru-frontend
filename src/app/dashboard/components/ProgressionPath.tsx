"use client";
import { motion } from "motion/react";
import { SeedStage, SproutStage, SaplingStage, TreeStage, ForestStage, WorldTreeStage } from "@/components/illustrations/TreeStages";

interface ProgressionPathProps { currentLevel: number; xp: number; }

const STAGES = [
  { level: 1, name: "Seed", Illo: SeedStage, color: "#7BA65B" },
  { level: 3, name: "Sprout", Illo: SproutStage, color: "#58CC02" },
  { level: 5, name: "Sapling", Illo: SaplingStage, color: "#94A84D" },
  { level: 8, name: "Tree", Illo: TreeStage, color: "#1CB0F6" },
  { level: 12, name: "Forest", Illo: ForestStage, color: "#D9A441" },
  { level: 20, name: "World Tree", Illo: WorldTreeStage, color: "#CE82FF" },
];

export default function ProgressionPath({ currentLevel, xp }: ProgressionPathProps) {
  const currentIdx = STAGES.findLastIndex(s => currentLevel >= s.level);

  return (
    <div className="rounded-2xl p-5" style={{ border: "1.5px solid rgba(0,0,0,0.04)", background: "rgba(0,0,0,0.01)" }}>
      <h3 className="text-[16px] font-extrabold mb-4" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>Growth Path</h3>

      <div className="flex items-center gap-0.5 overflow-x-auto pb-2">
        {STAGES.map((s, i) => {
          const reached = currentLevel >= s.level;
          const isCurrent = i === currentIdx;
          return (
            <div key={s.level} className="flex items-center gap-0.5 flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: isCurrent ? `linear-gradient(135deg, ${s.color}, ${s.color}CC)` : reached ? `${s.color}15` : "rgba(0,0,0,0.03)", border: isCurrent ? `2px solid ${s.color}` : `1px solid ${reached ? s.color+"30" : "rgba(0,0,0,0.06)"}`, boxShadow: isCurrent ? `0 0 16px ${s.color}40` : "none", opacity: reached ? 1 : 0.3 }}>
                  {(() => { const I = s.Illo; return <I size={28} />; })()}
                </div>
                <span className="text-[11px] font-extrabold mt-1" style={{ color: reached ? "#3D2E24" : "#9B8E84", fontFamily: "var(--font-baloo)" }}>{s.name}</span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="w-6 h-0.5 rounded-full" style={{ background: i < currentIdx ? "#58CC02" : "rgba(0,0,0,0.08)" }} />
              )}
            </div>
          );
        })}
      </div>

      {currentIdx < STAGES.length - 1 && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(88,204,2,0.04)", border: "1px solid rgba(88,204,2,0.08)" }}>
          <span className="text-[16px]">🔒</span>
          <div>
            <p className="text-[13px] font-extrabold" style={{ color: "#58CC02", fontFamily: "var(--font-baloo)" }}>Next: {STAGES[currentIdx+1].name}</p>
            <p className="text-[11px] font-medium" style={{ color: "#9B8E84" }}>~{Math.max(0, (STAGES[currentIdx+1].level - currentLevel) * 500)} XP to unlock</p>
          </div>
        </div>
      )}
    </div>
  );
}
