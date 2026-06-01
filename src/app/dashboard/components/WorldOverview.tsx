"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import StreakFire from "@/components/illustrations/StreakFire";
import GuruGuardian from "@/components/illustrations/GuruGuardian";
import DailyGoalRing from "./DailyGoalRing";

interface Props {
  studentName: string;
  dayStreak: number;
  tasksCompleted: number;
  studyHours: number;
  quizAccuracy: number;
  examType: string;
  daysToExam: number | null;
  sessionActive: boolean;
  missedBlocks: boolean;
  onKickstartSession?: () => void;
}

const LEVEL_TIERS: Record<number, { name: string; emoji: string; color: string }> = {
  1: { name: "Seedling", emoji: "🌱", color: "#58CC02" },
  2: { name: "Sprout", emoji: "🌿", color: "#7BA65B" },
  3: { name: "Sapling", emoji: "🪴", color: "#58CC02" },
  5: { name: "Tree", emoji: "🌲", color: "#1CB0F6" },
  8: { name: "Mighty Tree", emoji: "🌳", color: "#D9A441" },
  12: { name: "Forest", emoji: "🏆", color: "#CE82FF" },
  20: { name: "Mountain", emoji: "⛰️", color: "#FFC800" },
};

function levelMeta(lv: number) {
  let best = LEVEL_TIERS[1];
  for (const [k, v] of Object.entries(LEVEL_TIERS)) { if (lv >= parseInt(k)) best = v; }
  return best;
}

const GOAL = 4;

function StatPill({ emoji, label, value, unit, accent }: { emoji: string; label: string; value: number; unit: string; accent: string }) {
  return (
    <motion.div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur border border-[rgba(0,0,0,0.04)]"
      whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
    >
      <span className="text-[20px]">{emoji}</span>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#9B8E84]">{label}</p>
        <motion.p
          className="text-[17px] font-extrabold leading-none text-[#3D2E24]"
          style={{ fontFamily: "var(--font-baloo)" }}
          key={value}
          initial={{ scale: 1.3, y: -4 }}
          animate={{ scale: 1, y: 0 }}
        >
          {value}<span className="text-[9px] font-semibold ml-0.5 text-[#9B8E84]">{unit}</span>
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function WorldOverview({
  studentName, dayStreak, tasksCompleted, studyHours,
  quizAccuracy, examType, daysToExam, sessionActive, missedBlocks,
  onKickstartSession,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [showRisk, setShowRisk] = useState(false);

  const xp = tasksCompleted * 50 + studyHours * 30 + dayStreak * 10;
  const NXP = 500;
  const level = Math.floor(xp / NXP) + 1;
  const meta = levelMeta(level);
  const xpLeft = xp % NXP;
  const xpPct = Math.min((xpLeft / NXP) * 100, 100);

  useEffect(() => {
    setMounted(true);
    const check = () => { const h = new Date().getHours(); setShowRisk(h >= 15 && dayStreak > 0 && tasksCompleted === 0); };
    check(); const iv = setInterval(check, 60000); return () => clearInterval(iv);
  }, [dayStreak, tasksCompleted]);

  const hour = new Date().getHours();
  const greeting = mounted ? (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening") : "Welcome back";
  const mState = missedBlocks ? "alert" : sessionActive ? "active" : "idle";

  return (
    <section className="pt-[76px] pb-3 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ─── Main Card: Clean white + subtle green ─── */}
        <motion.div
          className="rounded-[32px] overflow-hidden relative border border-[rgba(123,166,91,0.12)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            background: "linear-gradient(170deg, #FDFDFC 0%, #F8FAF5 40%, #F0F5EB 100%)",
            boxShadow: "0 2px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(123,166,91,0.06)",
          }}
        >
          <div className="relative z-10 p-6 sm:p-7">

            {/* Top row: greeting + level badge */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[14px] font-semibold text-[#6B5D52]">
                {greeting}, <span className="text-[#3D2E24] font-extrabold">{studentName}</span> 👋
              </p>
              <motion.div
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[rgba(88,204,2,0.2)]"
                style={{ background: "rgba(88,204,2,0.06)" }}
                whileHover={{ scale: 1.04 }}
              >
                <span className="text-[16px]">{meta.emoji}</span>
                <span className="text-[12px] font-extrabold text-[#58CC02]" style={{ fontFamily: "var(--font-baloo)" }}>
                  Lv.{level} · {meta.name}
                </span>
              </motion.div>
            </div>

            {/* Main: Goal Ring | Stats | Mascot */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Left: Goal Ring */}
              <div className="flex-shrink-0">
                <DailyGoalRing studyHours={studyHours} goalHours={GOAL} xp={xp} nextLevelXP={NXP} tasksCompleted={tasksCompleted} />
              </div>

              {/* Center: Stats + XP + CTA */}
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Stats pills */}
                <div className="flex flex-wrap gap-2.5">
                  <StatPill emoji="🔥" label="Streak" value={dayStreak} unit="d" accent="#FFC800" />
                  <StatPill emoji="⏱" label="Hours" value={studyHours} unit="h" accent="#1CB0F6" />
                  <StatPill emoji="✦" label="Accuracy" value={quizAccuracy} unit="%" accent="#CE82FF" />
                  {daysToExam !== null && daysToExam !== undefined && (
                    <StatPill emoji="📅" label={examType || "Exam"} value={daysToExam} unit="d" accent={daysToExam <= 30 ? "#FF4B4B" : "#7BA65B"} />
                  )}
                </div>

                {/* XP bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8E84]">XP · {xp} total</span>
                    <span className="text-[11px] font-extrabold text-[#58CC02]" style={{ fontFamily: "var(--font-baloo)" }}>
                      {xpLeft}/{NXP}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full overflow-hidden bg-[rgba(0,0,0,0.04)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #58CC02 0%, #7BA65B 60%, #FFC800 100%)",
                        boxShadow: "0 0 10px rgba(88,204,2,0.25)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPct}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                {/* CTA */}
                {onKickstartSession && !sessionActive && (
                  <motion.button
                    onClick={onKickstartSession}
                    className="w-full py-3.5 rounded-2xl text-[16px] font-extrabold text-white flex items-center justify-center gap-2.5"
                    style={{
                      background: "linear-gradient(135deg, #58CC02 0%, #46A302 100%)",
                      boxShadow: "0 6px 28px rgba(88,204,2,0.35)",
                      fontFamily: "var(--font-baloo)",
                    }}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 36px rgba(88,204,2,0.45)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4L18 12L6 20V4Z" /></svg>
                    Start Studying Now
                  </motion.button>
                )}
              </div>

              {/* Right: Mascot */}
              <motion.div className="hidden md:flex flex-col items-center gap-2 flex-shrink-0" whileHover={{ scale: 1.05 }}>
                <div className="relative">
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: 80, height: 80, background: `radial-gradient(circle, ${meta.color}20 0%, transparent 70%)` }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <GuruGuardian size={64} state={mState} />
                </div>
                <p className="text-[10px] font-semibold text-[#9B8E84]" style={{ fontFamily: "var(--font-baloo)" }}>
                  {mState === "active" ? "⚡ Stay focused!" : mState === "alert" ? "⚠ Come back!" : "I believe in you!"}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Risk alert */}
        <AnimatePresence>
          {showRisk && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-2xl flex items-center justify-between gap-4 overflow-hidden border border-[rgba(255,75,75,0.2)] bg-[rgba(255,75,75,0.04)]"
            >
              <div className="flex items-center gap-3">
                <motion.span className="text-[20px]" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>🔥</motion.span>
                <div>
                  <h4 className="text-[13px] font-bold text-[#FF4B4B]" style={{ fontFamily: "var(--font-baloo)" }}>Streak at risk!</h4>
                  <p className="text-[12px] font-medium text-[#6B5D52]">It&apos;s past 3 PM — complete a session to save your {dayStreak}-day streak!</p>
                </div>
              </div>
              <button
                onClick={onKickstartSession}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FF4B4B, #E04040)", boxShadow: "0 4px 12px rgba(255,75,75,0.3)" }}
              >
                Kickstart Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
