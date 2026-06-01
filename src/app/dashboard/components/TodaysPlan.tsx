"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Play, Clock, CheckCircle2, Sparkles } from "lucide-react";
import PomodoroTimer from "./PomodoroTimer";
import { useXPPopup } from "./XPPopup";

interface Block {
  label: string; subject?: string; start?: string; startTime?: string; hours?: number; duration?: string; status?: string;
}

interface TodaysPlanProps {
  blocks: Block[] | null;
  isRest?: boolean;
  scheduleLoading?: boolean;
  connectedPlatforms?: string[];
  onTaskComplete?: (taskId: string) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const XP_PER_HOUR = 35;

function formatTime(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (m) return `${m[1]}:${m[2]} ${m[3].toUpperCase()}`;
  return raw;
}

function isBlockActive(startTime: string, hours: number): boolean {
  if (!startTime) return false;
  const m = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return false;
  let h = parseInt(m[1]); const min = parseInt(m[2]); const mer = m[3].toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  const now = new Date(); const curMins = now.getHours() * 60 + now.getMinutes();
  const startMins = h * 60 + min; const endMins = startMins + Math.round(hours * 60);
  return curMins >= startMins && curMins < endMins;
}

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

export default function TodaysPlan({ blocks, isRest, scheduleLoading, connectedPlatforms = [], onTaskComplete }: TodaysPlanProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { triggerXP } = useXPPopup();
  const [activeTimerIdx, setActiveTimerIdx] = useState<number | null>(null);
  const [kickstarted, setKickstarted] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const kickstart = useMutation({
    mutationFn: async (idx: number) => {
      const token = await getToken();
      await fetch(`${API_BASE}/api/v1/kickstart/${idx}`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (_, idx) => {
      setKickstarted(p => new Set(p).add(idx));
      setActiveTimerIdx(idx);
      queryClient.invalidateQueries({ queryKey: ["todayTasks"] });
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
    },
  });

  const handleStart = useCallback((idx: number) => {
    kickstart.mutate(idx);
  }, [kickstart]);

  const handleComplete = useCallback((idx: number, block: Block) => {
    setCompleted(p => new Set(p).add(idx));
    setActiveTimerIdx(null);
    const xp = Math.round((block.hours || 1) * XP_PER_HOUR);
    triggerXP(xp, block.label);
    onTaskComplete?.(`block-${idx}`);
  }, [triggerXP, onTaskComplete]);

  // Loading
  if (scheduleLoading) {
    return (
      <div className="rounded-2xl p-6 border border-[rgba(0,0,0,0.04)] bg-white/60">
        <div className="w-32 h-5 rounded-full bg-[rgba(0,0,0,0.04)] animate-pulse mb-4" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-[rgba(0,0,0,0.02)] animate-pulse" />)}
        </div>
      </div>
    );
  }

  // Rest day
  if (isRest) {
    return (
      <motion.div className="rounded-2xl p-8 text-center border border-dashed border-[rgba(123,166,91,0.2)] bg-white/60" initial={{opacity:0}} animate={{opacity:1}}>
        <motion.span className="text-[48px] block mb-3" animate={{scale:[1,1.08,1]}} transition={{duration:3,repeat:Infinity}}>🌴</motion.span>
        <h2 className="text-[20px] font-extrabold text-[#3D2E24] mb-1" style={{fontFamily:"var(--font-baloo)"}}>Rest Day</h2>
        <p className="text-[14px] font-medium text-[#6B5D52]">Your brain consolidates learning during rest. Come back stronger tomorrow. 💪</p>
      </motion.div>
    );
  }

  // No blocks
  if (!blocks || !blocks.length) {
    return (
      <motion.div className="rounded-2xl p-6 border border-[rgba(0,0,0,0.04)] bg-white/60" initial={{opacity:0}} animate={{opacity:1}}>
        <h2 className="text-[18px] font-extrabold text-[#3D2E24] mb-3" style={{fontFamily:"var(--font-baloo)"}}>Today&apos;s Plan</h2>
        <div className="rounded-xl p-5 text-center" style={{background:"rgba(88,204,2,0.03)",border:"1px dashed rgba(88,204,2,0.12)"}}>
          <Sparkles size={20} className="mx-auto mb-2 text-[#58CC02]" />
          <p className="text-[13px] font-semibold text-[#6B5D52]">No schedule yet</p>
          <p className="text-[11px] font-medium text-[#9B8E84] mt-0.5">Run Setup to build your study schedule.</p>
        </div>
      </motion.div>
    );
  }

  const totalXP = blocks.reduce((s, b) => s + Math.round((b.hours || 1) * XP_PER_HOUR), 0);
  const totalHrs = blocks.reduce((s, b) => s + (b.hours || 1), 0);

  return (
    <motion.div
      className="rounded-2xl p-5 border border-[rgba(217,164,65,0.1)]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(170deg, #FFFDF5 0%, #FDFDFC 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
            Today&apos;s Plan
          </h2>
          <p className="text-[11px] font-medium text-[#9B8E84]">{totalHrs.toFixed(1)}h total · {blocks.length} blocks</p>
        </div>
        <motion.div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(255,200,0,0.2)]"
          style={{ background: "rgba(255,200,0,0.04)" }}
          animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Sparkles size={13} style={{ color: "#D9A441" }} />
          <span className="text-[11px] font-extrabold text-[#D9A441]" style={{ fontFamily: "var(--font-baloo)" }}>+{totalXP} XP</span>
        </motion.div>
      </div>

      {/* Block list */}
      <div className="space-y-2">
        {blocks.map((block, i) => {
          const start = formatTime(block.start || block.startTime || "");
          const hours = block.hours || 1;
          const xp = Math.round(hours * XP_PER_HOUR);
          const isNow = isBlockActive(block.start || block.startTime || "", hours);
          const isActive = kickstarted.has(i) && !completed.has(i);
          const isDone = completed.has(i);
          const showTimer = activeTimerIdx === i;

          return (
            <motion.div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isNow ? "ring-2 ring-[#58CC02] ring-offset-1" : ""
              } ${isDone ? "opacity-50" : "hover:bg-[rgba(0,0,0,0.01)]"}`}
              style={{
                background: isNow ? "rgba(88,204,2,0.05)" : isActive ? "rgba(88,204,2,0.03)" : "rgba(0,0,0,0.01)",
                border: `1px solid ${isNow ? "rgba(88,204,2,0.2)" : "rgba(0,0,0,0.04)"}`,
              }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, ...spring }}
              whileHover={!isDone ? { scale: 1.01, y: -1 } : {}}
            >
              {/* Time */}
              <div className="w-20 flex-shrink-0">
                {start ? (
                  <div className="text-center">
                    <p className="text-[13px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>{start}</p>
                    <p className="text-[10px] font-semibold text-[#9B8E84]">{hours}h</p>
                  </div>
                ) : (
                  <Clock size={18} style={{ color: "#9B8E84" }} />
                )}
                {isNow && <span className="text-[8px] font-bold uppercase text-[#58CC02] anim-pulse block text-center mt-0.5">NOW</span>}
              </div>

              {/* Subject + duration */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#3D2E24]">{block.label}</p>
                {block.subject && <p className="text-[11px] font-medium text-[#9B8E84]">{block.subject}</p>}
              </div>

              {/* XP badge */}
              <div className="flex-shrink-0 px-2.5 py-1 rounded-full border border-[rgba(88,204,2,0.12)] bg-[rgba(88,204,2,0.04)]">
                <span className="text-[10px] font-extrabold text-[#58CC02]" style={{ fontFamily: "var(--font-baloo)" }}>+{xp} XP</span>
              </div>

              {/* Action button */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}>
                    <CheckCircle2 size={22} style={{ color: "#58CC02" }} />
                  </motion.div>
                ) : isActive ? (
                  <button
                    onClick={() => setActiveTimerIdx(showTimer ? null : i)}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all"
                    style={{
                      color: showTimer ? "#FFFFFF" : "#58CC02",
                      background: showTimer ? "#58CC02" : "rgba(88,204,2,0.08)",
                    }}
                  >
                    {showTimer ? "Hide Timer" : "⏱ Focus"}
                  </button>
                ) : (
                  <motion.button
                    onClick={() => handleStart(i)}
                    disabled={kickstart.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #58CC02, #46A302)",
                      boxShadow: "0 3px 12px rgba(88,204,2,0.25)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={13} fill="white" />
                    Start
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Pomodoro */}
      <AnimatePresence>
        {activeTimerIdx !== null && blocks[activeTimerIdx] && (
          <motion.div
            className="mt-4 p-4 rounded-xl flex justify-center border border-[rgba(88,204,2,0.1)]"
            style={{ background: "rgba(88,204,2,0.02)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PomodoroTimer
              blockLabel={blocks[activeTimerIdx].label}
              blockHours={blocks[activeTimerIdx].hours || 1}
              onXPEarned={(amount) => triggerXP(amount, "Focus")}
              onComplete={() => handleComplete(activeTimerIdx, blocks[activeTimerIdx])}
              autoStart
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
