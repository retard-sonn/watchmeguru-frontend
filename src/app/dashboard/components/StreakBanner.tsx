"use client";
import { motion } from "motion/react";

interface StreakBannerProps {
  dayStreak: number;
  weekActivity: { day: string; hrs: number }[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StreakBanner({ dayStreak, weekActivity }: StreakBannerProps) {
  // Build 7-day streak calendar (today's day index in weekActivity)
  const todayIdx = new Date().getDay(); // 0=Sun, 1=Mon...
  const monIdx = todayIdx === 0 ? 6 : todayIdx - 1; // convert to Mon=0

  return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: dayStreak >= 7
          ? "linear-gradient(135deg, rgba(255,75,75,0.06) 0%, rgba(255,200,0,0.04) 100%)"
          : "rgba(0,0,0,0.02)",
        border: `1.5px solid ${dayStreak >= 7 ? "rgba(255,75,75,0.15)" : "rgba(0,0,0,0.04)"}`,
      }}
    >
      {/* Big streak number */}
      <div className="flex items-center gap-3">
        <motion.div
          className="flex-shrink-0"
          animate={dayStreak > 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[40px]">{dayStreak > 0 ? "🔥" : "💤"}</span>
        </motion.div>
        <div>
          <h2
            className="text-[36px] font-extrabold leading-none"
            style={{
              color: dayStreak > 0 ? "#FF4B4B" : "#9B8E84",
              fontFamily: "var(--font-baloo)",
            }}
          >
            {dayStreak > 0 ? dayStreak : "0"}
          </h2>
          <p className="text-[13px] font-bold uppercase tracking-widest" style={{ color: dayStreak > 0 ? "#FF4B4B" : "#9B8E84" }}>
            {dayStreak === 1 ? "Day Streak" : "Day Streak"}
          </p>
          {dayStreak > 0 ? (
            <motion.p className="text-[11px] font-semibold mt-0.5" style={{ color: "#6B5D52" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Keep it alive tomorrow
            </motion.p>
          ) : (
            <motion.p className="text-[12px] font-medium mt-1" style={{ color: "#6B5D52" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Your ecosystem is sleeping. Complete one session to wake it up.
            </motion.p>
          )}
        </div>
      </div>

      {/* 7-day streak calendar */}
      <div className="flex items-center gap-2">
        {DAY_LABELS.map((day, i) => {
          const activity = weekActivity[i];
          const hrs = activity?.hrs || 0;
          const isToday = i === monIdx;
          const isActive = hrs > 0;
          let bg = "rgba(0,0,0,0.04)";
          let emoji = "";
          if (isActive && hrs >= 4) { bg = "#FF4B4B"; emoji = "🔥"; }
          else if (isActive && hrs >= 2) { bg = "#FF7A00"; emoji = "⚡"; }
          else if (isActive) { bg = "#FFC800"; emoji = "✨"; }

          return (
            <motion.div
              key={day}
              className="flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl"
              style={{
                background: isToday ? "rgba(88,204,2,0.06)" : "transparent",
                border: isToday ? "1.5px solid rgba(88,204,2,0.2)" : "1.5px solid transparent",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-[9px] font-bold uppercase text-[#9B8E84]">{day}</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]"
                style={{ background: bg }}
              >
                {isActive ? emoji : "·"}
              </div>
              {isToday && <span className="text-[8px] font-bold text-[#58CC02]">TODAY</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Recovery shield status */}
      {dayStreak > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <div className="w-2 h-2 rounded-full bg-[#58CC02] anim-pulse" />
          <span className="text-[11px] font-semibold text-[#6B5D52]">
            Streak shield available — use once per week
          </span>
        </div>
      )}
    </motion.div>
  );
}
