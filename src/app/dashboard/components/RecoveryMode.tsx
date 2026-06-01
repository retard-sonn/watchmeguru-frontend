"use client";

import { motion } from "motion/react";
import { Heart, Sparkles, Play } from "lucide-react";

interface RecoveryModeProps {
  daysMissed: number;
  studentName: string;
  onStartSession: () => void;
}

export default function RecoveryMode({ daysMissed, studentName, onStartSession }: RecoveryModeProps) {
  if (daysMissed <= 0) return null;

  const message = daysMissed === 1
    ? "Hey, it's okay! One missed day doesn't define you. Let's get back on track — your ecosystem is still alive."
    : daysMissed <= 3
      ? `Welcome back, ${studentName}! ${daysMissed} days away from the desk happens to the best of us. No judgment — just a fresh start.`
      : `We've missed you, ${studentName}! ${daysMissed} days is just a pause, not a stop. Your mentor is ready with a gentle restart plan.`;

  const bonusMessage = "Comeback XP Bonus: 2x XP for your next 3 sessions! 🎉";

  return (
    <section className="py-2">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="card-recovery rounded-[var(--radius-card)] p-6"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Left: Heart icon + message */}
            <div className="flex items-start gap-4 flex-1">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,75,75,0.1)" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={22} style={{ color: "#FF4B4B" }} fill="#FF4B4B20" />
              </motion.div>

              <div>
                <h3
                  className="text-[16px] font-extrabold mb-1"
                  style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
                >
                  Welcome back, {studentName}
                </h3>
                <p className="text-[14px] leading-relaxed font-medium mb-3" style={{ color: "var(--ink-light)" }}>
                  {message}
                </p>
                <motion.div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(88,204,2,0.08)" }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles size={13} style={{ color: "#58CC02" }} />
                  <span className="text-[12px] font-bold" style={{ color: "#58CC02" }}>
                    {bonusMessage}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Right: Start button */}
            <motion.button
              onClick={onStartSession}
              className="btn-moss flex items-center gap-2 text-[14px] py-3 px-6 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Play size={16} />
              Start Fresh Session
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
