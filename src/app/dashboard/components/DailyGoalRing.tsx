"use client";

import { motion } from "motion/react";
import { Sparkles, Zap, TrendingUp } from "lucide-react";

interface DailyGoalRingProps {
  studyHours: number;
  goalHours: number;
  xp: number;
  nextLevelXP: number;
  tasksCompleted?: number;
  tasksTotal?: number;
  compact?: boolean;
}

function getGoalMessage(progress: number): { emoji: string; text: string; color: string } {
  if (progress >= 1) return { emoji: "🔥", text: "Goal crushed!", color: "#D9A441" };
  if (progress >= 0.75) return { emoji: "⚡", text: "Almost there!", color: "#58CC02" };
  if (progress >= 0.5) return { emoji: "💪", text: "Halfway!", color: "#1CB0F6" };
  if (progress >= 0.25) return { emoji: "🌱", text: "Building momentum", color: "#78A6D8" };
  return { emoji: "🎯", text: "Let's begin!", color: "var(--ink-muted)" };
}

export default function DailyGoalRing({
  studyHours,
  goalHours,
  xp,
  nextLevelXP,
  tasksCompleted = 0,
  tasksTotal = 0,
  compact = false,
}: DailyGoalRingProps) {
  const hoursProgress = Math.min(studyHours / Math.max(goalHours, 0.5), 1);
  const xpProgress = Math.min((xp % nextLevelXP) / nextLevelXP, 1);
  const goalMsg = getGoalMessage(hoursProgress);

  // Ring dimensions
  const outerR = compact ? 42 : 56;
  const innerR = compact ? 30 : 42;
  const strokeW = compact ? 5 : 6;
  const size = (outerR + strokeW) * 2;

  const outerNorm = outerR - strokeW / 2;
  const innerNorm = innerR - strokeW / 2;
  const outerCirc = outerNorm * 2 * Math.PI;
  const innerCirc = innerNorm * 2 * Math.PI;

  const outerOffset = outerCirc * (1 - hoursProgress);
  const innerOffset = innerCirc * (1 - xpProgress);

  const isGoalComplete = hoursProgress >= 1;

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Rings */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          {/* Outer ring — Daily Goal */}
          <circle
            cx={outerR + strokeW / 2}
            cy={outerR + strokeW / 2}
            r={outerNorm}
            fill="none"
            stroke="rgba(91,70,54,0.06)"
            strokeWidth={strokeW}
          />
          <motion.circle
            cx={outerR + strokeW / 2}
            cy={outerR + strokeW / 2}
            r={outerNorm}
            fill="none"
            stroke={isGoalComplete ? "#FFC800" : "#1CB0F6"}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={outerCirc}
            initial={{ strokeDashoffset: outerCirc }}
            animate={{ strokeDashoffset: outerOffset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Inner ring — XP Progress */}
          <circle
            cx={innerR + 8 + strokeW / 2}
            cy={innerR + 8 + strokeW / 2}
            r={innerNorm}
            fill="none"
            stroke="rgba(91,70,54,0.04)"
            strokeWidth={strokeW - 1}
          />
          <motion.circle
            cx={innerR + 8 + strokeW / 2}
            cy={innerR + 8 + strokeW / 2}
            r={innerNorm}
            fill="none"
            stroke="#58CC02"
            strokeWidth={strokeW - 1}
            strokeLinecap="round"
            strokeDasharray={innerCirc}
            initial={{ strokeDashoffset: innerCirc }}
            animate={{ strokeDashoffset: innerOffset }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isGoalComplete ? (
            <motion.span
              className="text-[28px]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              🔥
            </motion.span>
          ) : (
            <>
              <motion.span
                className="font-extrabold leading-none tabular-nums"
                style={{
                  color: "var(--earthy)",
                  fontFamily: "var(--font-baloo)",
                  fontSize: compact ? "18px" : "24px",
                }}
                key={studyHours.toFixed(1)}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {studyHours.toFixed(1)}
              </motion.span>
              <span
                className="font-bold leading-none"
                style={{
                  color: "var(--ink-muted)",
                  fontSize: compact ? "9px" : "10px",
                }}
              >
                / {goalHours}h
              </span>
            </>
          )}
        </div>
      </div>

      {/* Goal message */}
      {!compact && (
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: `${goalMsg.color}10` }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[13px]">{goalMsg.emoji}</span>
          <span
            className="text-[12px] font-bold"
            style={{ color: goalMsg.color }}
          >
            {goalMsg.text}
          </span>
        </motion.div>
      )}

      {/* Mini stats row */}
      {!compact && (
        <div className="flex items-center gap-4 mt-1">
          {/* XP stat */}
          <div className="flex items-center gap-1">
            <Zap size={12} style={{ color: "#FFC800" }} />
            <span
              className="text-[12px] font-bold"
              style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
            >
              {xp} XP
            </span>
          </div>

          {/* Tasks stat */}
          {tasksTotal > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp size={12} style={{ color: "#58CC02" }} />
              <span className="text-[12px] font-bold" style={{ color: "var(--ink-muted)" }}>
                {tasksCompleted}/{tasksTotal}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
