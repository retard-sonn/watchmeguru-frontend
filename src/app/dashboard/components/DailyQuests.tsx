"use client";
import { motion } from "motion/react";
import { CheckCircle, Circle, Sparkles } from "lucide-react";
import PomodoroTimer from "./PomodoroTimer";
import { useXPPopup } from "./XPPopup";

interface Quest {
  id: string;
  label: string;
  subject: string;
  xpReward: number;
  duration: string;
  completed: boolean;
}

interface DailyQuestsProps {
  quests: Quest[];
  todayHours: number;
  goalHours: number;
  onStartQuest: (questId: string) => void;
  onCompleteQuest: (questId: string) => void;
}

export default function DailyQuests({ quests, todayHours, goalHours, onStartQuest, onCompleteQuest }: DailyQuestsProps) {
  const { triggerXP } = useXPPopup();
  const completed = quests.filter(q => q.completed).length;
  const totalXP = quests.reduce((s, q) => s + q.xpReward, 0);
  const earnedXP = quests.filter(q => q.completed).reduce((s, q) => s + q.xpReward, 0);

  return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(170deg, #FDFDFC 0%, #FFFDF5 100%)",
        border: "1.5px solid rgba(217,164,65,0.12)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
            Today&apos;s Quests
          </h3>
          <p className="text-[11px] font-medium text-[#9B8E84]">
            {completed === quests.length ? "All done! 🎉" : `${completed}/${quests.length} completed`}
          </p>
        </div>
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: earnedXP > 0 ? "rgba(88,204,2,0.08)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${earnedXP > 0 ? "rgba(88,204,2,0.15)" : "rgba(0,0,0,0.06)"}`,
          }}
          animate={earnedXP > 0 ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles size={13} style={{ color: earnedXP > 0 ? "#58CC02" : "#9B8E84" }} />
          <span className="text-[12px] font-extrabold" style={{ color: earnedXP > 0 ? "#58CC02" : "#9B8E84", fontFamily: "var(--font-baloo)" }}>
            {earnedXP}/{totalXP} XP
          </span>
        </motion.div>
      </div>

      {/* Quest list */}
      <div className="space-y-2">
        {quests.map((quest, i) => (
          <motion.div
            key={quest.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
              quest.completed ? "opacity-50" : "hover:bg-[rgba(0,0,0,0.01)]"
            }`}
            style={{
              background: quest.completed ? "rgba(88,204,2,0.04)" : "rgba(0,0,0,0.01)",
              border: `1px solid ${quest.completed ? "rgba(88,204,2,0.1)" : "rgba(0,0,0,0.04)"}`,
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => {
              if (!quest.completed) {
                onCompleteQuest(quest.id);
                triggerXP(quest.xpReward, quest.subject);
              }
            }}
          >
            {/* Check circle */}
            <div className="flex-shrink-0">
              {quest.completed ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle size={22} style={{ color: "#58CC02" }} fill="#58CC0215" />
                </motion.div>
              ) : (
                <Circle size={22} style={{ color: "#9B8E84" }} />
              )}
            </div>

            {/* Quest details */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#3D2E24]">{quest.label}</p>
              <p className="text-[11px] font-medium text-[#9B8E84]">{quest.subject} · {quest.duration}</p>
            </div>

            {/* XP reward badge */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: quest.completed ? "rgba(88,204,2,0.1)" : "rgba(255,200,0,0.08)" }}
            >
              <span className="text-[10px] font-extrabold" style={{ color: quest.completed ? "#58CC02" : "#D9A441", fontFamily: "var(--font-baloo)" }}>
                +{quest.xpReward} XP
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export type { Quest };
