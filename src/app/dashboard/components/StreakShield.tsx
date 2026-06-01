"use client";

import { motion, AnimatePresence } from "motion/react";
import { Shield, ShieldCheck, Clock } from "lucide-react";

interface StreakShieldProps {
  streak: number;
  shieldAvailable: boolean;
  shieldUsed: boolean;
  graceHoursLeft?: number;
  onUseShield?: () => void;
}

export default function StreakShield({
  streak,
  shieldAvailable,
  shieldUsed,
  graceHoursLeft,
  onUseShield,
}: StreakShieldProps) {
  // Only show when there's a streak to protect
  if (streak === 0 && !graceHoursLeft) return null;

  return (
    <section className="py-1">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="card-terrain px-4 py-3 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Left: Shield + streak */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: shieldAvailable
                  ? "rgba(88,204,2,0.12)"
                  : shieldUsed
                    ? "rgba(155,142,132,0.08)"
                    : "rgba(28,176,246,0.08)",
              }}
              animate={shieldAvailable ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {shieldAvailable ? (
                <ShieldCheck size={18} style={{ color: "#58CC02" }} />
              ) : shieldUsed ? (
                <Shield size={18} style={{ color: "var(--ink-muted)" }} />
              ) : (
                <Clock size={18} style={{ color: "#1CB0F6" }} />
              )}
            </motion.div>

            <div>
              <AnimatePresence mode="wait">
                {shieldAvailable && (
                  <motion.p
                    key="available"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[13px] font-bold"
                    style={{ color: "#58CC02" }}
                  >
                    Rest Day Shield Available
                  </motion.p>
                )}
                {shieldUsed && !shieldAvailable && (
                  <motion.p
                    key="used"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    Shield used — recharges in {6 - (new Date().getDay())} days
                  </motion.p>
                )}
                {graceHoursLeft && graceHoursLeft > 0 && (
                  <motion.p
                    key="grace"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[13px] font-bold"
                    style={{ color: "#1CB0F6" }}
                  >
                    Grace period: {graceHoursLeft}h remaining
                  </motion.p>
                )}
                {!shieldAvailable && !shieldUsed && !graceHoursLeft && streak > 0 && (
                  <motion.p
                    key="active"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--ink-light)" }}
                  >
                    {streak}-day streak {streak >= 7 ? "🔥" : "active"} — protect it!
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="text-[11px] font-medium mt-0.5" style={{ color: "var(--ink-muted)" }}>
                {shieldAvailable
                  ? "Use to skip a day without breaking your streak"
                  : shieldUsed
                    ? "Complete today's session to keep your streak"
                    : graceHoursLeft
                      ? "Log a session before the grace period ends"
                      : "Miss a day and your streak resets"}
              </p>
            </div>
          </div>

          {/* Right: Use shield button */}
          {shieldAvailable && onUseShield && (
            <motion.button
              onClick={onUseShield}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #58CC02, #46A302)",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(88,204,2,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ShieldCheck size={14} />
              Use Shield
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
