"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StreakFire from "@/components/illustrations/StreakFire";
import GuruGuardian from "@/components/illustrations/GuruGuardian";

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
}

function XPProgress({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
        <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(91,70,54,0.06)" strokeWidth="4" />
        <motion.circle
          cx="30" cy="30" r="24"
          fill="none"
          stroke="#7BA65B"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 24}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - pct / 100) }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[14px] font-extrabold leading-none"
          style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
          key={value}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
        >
          {value}
        </motion.span>
        <span className="text-[8px] font-bold uppercase tracking-tight" style={{ color: "var(--moss)" }}>XP</span>
      </div>
    </div>
  );
}

export default function WorldOverview({
  studentName, dayStreak, tasksCompleted, studyHours,
  quizAccuracy, examType, daysToExam, sessionActive, missedBlocks,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [showRiskAlert, setShowRiskAlert] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkRisk = () => {
      const now = new Date();
      if (now.getHours() >= 15 && dayStreak > 0 && tasksCompleted === 0) {
        setShowRiskAlert(true);
      } else {
        setShowRiskAlert(false);
      }
    };
    checkRisk();
    const interval = setInterval(checkRisk, 60000);
    return () => clearInterval(interval);
  }, [dayStreak, tasksCompleted]);

  const hour = new Date().getHours();
  const greeting = mounted
    ? (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening")
    : "Welcome back";
  const xp = tasksCompleted * 50 + studyHours * 30 + dayStreak * 10;
  const nextLevelXP = 500;
  const level = Math.floor(xp / nextLevelXP) + 1;

  const mentorState = missedBlocks ? "alert" : sessionActive ? "active" : "idle";

  const mentorColors = {
    idle: { glow: "rgba(120,166,216,0.1)" },
    active: { glow: "rgba(123,166,91,0.15)" },
    alert: { glow: "rgba(217,164,65,0.12)" },
  };

  return (
    <section className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="card-terrain p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top bar: greeting + level */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>
                {greeting}, {studentName}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(123,166,91,0.08)" }}>
              <span className="text-[18px]">🏆</span>
              <span className="text-[13px] font-semibold" style={{ color: "var(--moss)" }}>Level {level}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-[1fr_auto] gap-6 items-start">
            {/* Left: Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 col-span-2 md:col-span-1">
              {/* Streak */}
              <GamiStat icon={<StreakFire streak={dayStreak} />} label="Streak" value={dayStreak} unit="days" />

              {/* XP */}
              <div className="flex flex-col items-center p-2 rounded-xl">
                <XPProgress value={xp % nextLevelXP} max={nextLevelXP} />
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--ink-muted)" }}>XP</p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--moss)" }}>{xp % nextLevelXP}/{nextLevelXP}</p>
              </div>

              <GamiStat icon="⏱" label="Hours" value={studyHours} unit="h" />
              <GamiStat icon="✦" label="Accuracy" value={quizAccuracy} unit="%" />

              {/* Exam countdown */}
              <div className="text-center p-2 rounded-xl md:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--ink-muted)" }}>
                  {examType || "Setup Required"}
                </p>
                <p className="text-[18px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  {daysToExam !== null ? `${daysToExam}d` : "—"}
                </p>
                <p className="text-[10px] font-medium" style={{ color: "var(--ink-muted)" }}>until exam</p>
              </div>

              <GamiStat icon="◉" label="Missions" value={tasksCompleted} unit="done" />
              <div className="hidden md:block" />
            </div>

            {/* Right: Guru Guardian + mission quote */}
            <div className="hidden md:flex flex-col items-center gap-2 relative">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 100, height: 100,
                  background: `radial-gradient(circle, ${mentorColors[mentorState].glow} 0%, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <GuruGuardian size={64} state={mentorState} />
              <div className="text-center mt-1">
                <p className="text-[11px] font-bold" style={{ color: "var(--ink-muted)", fontFamily: "var(--font-baloo)" }}>
                  {mentorState === "active" ? "Stay focused!" : mentorState === "alert" ? "Come back soon!" : "You've got this!"}
                </p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--ink-muted)" }}>
                  {dayStreak > 0 ? `${dayStreak}-day streak 🔥` : "Start your first streak!"}
                </p>
              </div>
            </div>
          </div>

          {/* Streak at risk alert */}
          {showRiskAlert && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mt-6 p-4 rounded-2xl border flex items-center justify-between gap-4"
              style={{
                background: "rgba(220,38,38,0.06)",
                borderColor: "rgba(220,38,38,0.2)",
                boxShadow: "0 0 16px rgba(220,38,38,0.08)"
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[20px] animate-bounce">🔥</span>
                <div>
                  <h4 className="text-[14px] font-bold text-red-700" style={{ fontFamily: "var(--font-baloo)" }}>
                    Streak at risk!
                  </h4>
                  <p className="text-[12px] text-red-600 font-medium">
                    It&apos;s past 3 PM and you haven&apos;t completed any sessions today. Complete a mission to keep your {dayStreak}-day streak alive!
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const el = document.getElementById("mission-board-title");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-red-600 hover:bg-red-700 transition-all flex-shrink-0"
              >
                Solve Now
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function GamiStat({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: number; unit: string }) {
  return (
    <motion.div className="text-center p-2 rounded-xl" whileHover={{ background: "rgba(91,70,54,0.02)" }}>
      <div className="flex justify-center mb-1">
        {typeof icon === "string" ? (
          <span className="text-[16px]" style={{ color: value > 0 ? "var(--moss)" : "var(--ink-muted)" }}>{icon}</span>
        ) : (
          <div className="w-8 h-8">{icon}</div>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>{label}</p>
      <motion.p
        className="text-[16px] font-extrabold leading-none mt-0.5"
        style={{ color: value > 0 ? "var(--earthy)" : "var(--ink-muted)", fontFamily: "var(--font-baloo)" }}
        key={value}
        initial={{ scale: 1.3, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {value}<span className="text-[10px] font-semibold ml-0.5" style={{ color: "var(--ink-muted)" }}>{unit}</span>
      </motion.p>
    </motion.div>
  );
}
