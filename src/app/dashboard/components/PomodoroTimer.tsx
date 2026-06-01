"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

type TimerMode = "focus" | "break" | "long-break";

interface PomodoroTimerProps {
  blockLabel?: string;
  blockHours?: number;
  onComplete?: () => void;
  onXPEarned?: (amount: number) => void;
  autoStart?: boolean;
  compact?: boolean;
}

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;
const SESSIONS_BEFORE_LONG_BREAK = 4;

const MODE_META: Record<TimerMode, { label: string; ringClass: string; bg: string; text: string }> = {
  focus:      { label: "Focus",      ringClass: "focus",      bg: "rgba(88,204,2,0.08)",     text: "#58CC02" },
  break:      { label: "Short Break", ringClass: "break",     bg: "rgba(120,166,216,0.08)", text: "#78A6D8" },
  "long-break": { label: "Long Break", ringClass: "long-break", bg: "rgba(217,164,65,0.08)", text: "#D9A441" },
};

export default function PomodoroTimer({
  blockLabel,
  blockHours,
  onComplete,
  onXPEarned,
  autoStart = true,
  compact = false,
}: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = mode === "focus"
    ? FOCUS_MINUTES * 60
    : mode === "long-break"
      ? LONG_BREAK_MINUTES * 60
      : BREAK_MINUTES * 60;

  const progress = 1 - secondsLeft / totalSeconds;
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const radius = compact ? 32 : 54;
  const strokeWidth = compact ? 5 : 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - progress);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  }, [clearTimer, totalSeconds]);

  // Handle timer completion
  useEffect(() => {
    if (secondsLeft === 0 && !isRunning) {
      if (mode === "focus") {
        const newCount = sessionsCompleted + 1;
        setSessionsCompleted(newCount);
        setShowCompletion(true);

        // Award XP
        const xp = 20;
        onXPEarned?.(xp);

        // Determine next mode
        if (newCount % SESSIONS_BEFORE_LONG_BREAK === 0) {
          setMode("long-break");
          setSecondsLeft(LONG_BREAK_MINUTES * 60);
        } else {
          setMode("break");
          setSecondsLeft(BREAK_MINUTES * 60);
        }

        // Auto-start break after short delay
        setTimeout(() => {
          setShowCompletion(false);
          startTimer();
        }, 2000);

        onComplete?.();
      } else {
        // Break completed — switch back to focus
        setMode("focus");
        setSecondsLeft(FOCUS_MINUTES * 60);
        setShowCompletion(true);
        setTimeout(() => {
          setShowCompletion(false);
          startTimer();
        }, 1500);
      }
    }
  }, [secondsLeft, isRunning, mode, sessionsCompleted, onComplete, onXPEarned, startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const meta = MODE_META[mode];

  const size = (radius + strokeWidth) * 2;

  return (
    <motion.div
      className={`flex flex-col items-center ${compact ? "gap-1" : "gap-3"}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Block label */}
      {blockLabel && !compact && (
        <p className="text-[13px] font-bold" style={{ color: "var(--ink-muted)", fontFamily: "var(--font-baloo)" }}>
          {blockLabel}
        </p>
      )}

      {/* Timer ring */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90"
        >
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={normalizedRadius}
            fill="none"
            stroke="rgba(91,70,54,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <motion.circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={normalizedRadius}
            fill="none"
            stroke={meta.text}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
            className="pomodoro-ring"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showCompletion ? (
              <motion.div
                key="done"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="flex flex-col items-center"
              >
                <span className="text-[24px]">✓</span>
                <span
                  className="text-[11px] font-extrabold"
                  style={{ color: meta.text, fontFamily: "var(--font-baloo)" }}
                >
                  {mode === "focus" ? "+20 XP" : "Next up!"}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <span
                  className="font-extrabold tabular-nums leading-none"
                  style={{
                    color: "var(--earthy)",
                    fontFamily: "var(--font-baloo)",
                    fontSize: compact ? "18px" : "32px",
                  }}
                >
                  {minutes}:{secs.toString().padStart(2, "0")}
                </span>
                {!compact && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
                    style={{ color: meta.text }}
                  >
                    {meta.label}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      {!compact && (
        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all hover:scale-105"
            style={{
              background: isRunning ? "rgba(91,70,54,0.06)" : meta.text,
              color: isRunning ? "var(--ink-muted)" : "#FFFFFF",
            }}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            {isRunning ? "Pause" : "Start"}
          </button>

          <button
            onClick={resetTimer}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-[12px] font-semibold transition-all hover:bg-[rgba(91,70,54,0.05)]"
            style={{ color: "var(--ink-muted)" }}
          >
            <RotateCcw size={13} />
            Reset
          </button>

          {/* Skip to next */}
          <button
            onClick={() => {
              setSecondsLeft(0);
              clearTimer();
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-[12px] font-semibold transition-all hover:bg-[rgba(91,70,54,0.05)]"
            style={{ color: "var(--ink-muted)" }}
          >
            <SkipForward size={13} />
            Skip
          </button>
        </div>
      )}

      {/* Session counter */}
      {!compact && sessionsCompleted > 0 && (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: SESSIONS_BEFORE_LONG_BREAK }).map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: i < (sessionsCompleted % SESSIONS_BEFORE_LONG_BREAK || SESSIONS_BEFORE_LONG_BREAK)
                  ? "#58CC02"
                  : "rgba(91,70,54,0.1)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
          <span className="text-[11px] font-semibold ml-1" style={{ color: "var(--ink-muted)" }}>
            {sessionsCompleted} session{sessionsCompleted !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export { FOCUS_MINUTES, BREAK_MINUTES, LONG_BREAK_MINUTES, SESSIONS_BEFORE_LONG_BREAK };
