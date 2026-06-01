"use client";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Flame, Star, Target, Heart, Zap, CheckCircle } from "lucide-react";

type CelebrationType = "streak" | "mission" | "general" | "level_up" | "daily_goal" | "accuracy" | "comeback";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  description: string;
  type: CelebrationType;
  statValue?: string | number;
}

const TYPE_META: Record<CelebrationType, { icon: typeof Trophy; bg: string; badgeColor: string; glowColor: string; emoji: string }> = {
  streak:    { icon: Flame,       bg: "linear-gradient(135deg, #D9A441, #C08A2E)", badgeColor: "rgba(217,164,65,0.1)", glowColor: "rgba(217,164,65,0.4)", emoji: "🔥" },
  mission:   { icon: CheckCircle, bg: "linear-gradient(135deg, #7BA65B, #5F8C3E)", badgeColor: "rgba(123,166,91,0.1)", glowColor: "rgba(123,166,91,0.4)", emoji: "✅" },
  general:   { icon: Sparkles,    bg: "linear-gradient(135deg, #7BA65B, #5F8C3E)", badgeColor: "rgba(123,166,91,0.1)", glowColor: "rgba(123,166,91,0.4)", emoji: "✨" },
  level_up:  { icon: Star,        bg: "linear-gradient(135deg, #CE82FF, #A560E8)", badgeColor: "rgba(206,130,255,0.1)", glowColor: "rgba(206,130,255,0.4)", emoji: "⭐" },
  daily_goal:{ icon: Target,      bg: "linear-gradient(135deg, #1CB0F6, #1890D0)", badgeColor: "rgba(28,176,246,0.1)", glowColor: "rgba(28,176,246,0.4)", emoji: "🎯" },
  accuracy:  { icon: Zap,         bg: "linear-gradient(135deg, #FFC800, #D9A441)", badgeColor: "rgba(255,200,0,0.1)",  glowColor: "rgba(255,200,0,0.4)", emoji: "⚡" },
  comeback:  { icon: Heart,       bg: "linear-gradient(135deg, #FF4B4B, #E04040)", badgeColor: "rgba(255,75,75,0.1)",  glowColor: "rgba(255,75,75,0.4)", emoji: "💪" },
};

const CONFETTI_COLORS = ["#58CC02", "#FFC800", "#1CB0F6", "#CE82FF", "#FF7A00", "#FF4B4B", "#7BA65B", "#D9A441", "#78A6D8", "#94A84D"];

function ConfettiRain() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const left = 5 + Math.random() * 90;
        const size = 4 + Math.random() * 10;
        const delay = Math.random() * 0.8;
        const duration = 2 + Math.random() * 2.5;
        const isCircle = Math.random() > 0.4;
        const drift = (Math.random() - 0.5) * 60;
        const rotate = 360 * (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random());

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: size,
              height: isCircle ? size : size * 0.35,
              borderRadius: isCircle ? "50%" : "2px",
              background: color,
              top: "-20px",
              left: `${left}%`,
              boxShadow: `0 0 6px ${color}40`,
            }}
            initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
            animate={{ y: "110vh", x: drift, rotate, opacity: 0 }}
            transition={{ duration, delay, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}

export default function CelebrationModal({ isOpen, onClose, title, subtitle, description, type, statValue }: Props) {
  const meta = TYPE_META[type] || TYPE_META.general;
  const Icon = meta.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(61,46,36,0.55)", backdropFilter: "blur(16px)" }}>

          <ConfettiRain />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(165deg, #FDF9F0 0%, #F4EEDB 100%)",
              border: "2px solid rgba(91,70,54,0.12)",
              boxShadow: "0 32px 80px rgba(61,46,36,0.3)",
            }}
          >
            {/* Glowing Aura */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${meta.glowColor} 0%, transparent 70%)`,
                opacity: 0.25,
              }}
            />

            {/* Illustration */}
            <div className="flex justify-center mb-6 relative z-10">
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center relative shadow-lg"
                style={{ background: meta.bg }}
              >
                <span className="text-[36px]">{meta.emoji}</span>

                {/* Orbiting sparkles */}
                {["✦", "✧", "⋆"].map((star, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-[10px] text-white"
                    animate={{ rotate: [i * 120, i * 120 + 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.span
                      className="block"
                      animate={{ x: [32, 38, 32], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                    >
                      {star}
                    </motion.span>
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Badge / Subtitle */}
            <span
              className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block relative z-10"
              style={{ background: meta.badgeColor, color: meta.glowColor.replace("0.4", "1").replace("rgba", "rgb").replace(",", "").replace(/[0-9.]+\)/, ")") }}
            >
              {subtitle}
            </span>

            <h2
              className="text-[24px] font-extrabold tracking-tight mb-2 relative z-10"
              style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
            >
              {title}
            </h2>

            <p className="text-[14px] mb-6 font-medium leading-relaxed relative z-10" style={{ color: "var(--ink-light)" }}>
              {description}
            </p>

            {statValue && (
              <div
                className="p-4 rounded-2xl mb-6 flex items-center justify-center gap-2 relative z-10"
                style={{ background: "#F4EEDB", border: "1px solid var(--border)" }}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                  Current:
                </span>
                <span className="text-[16px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  {statValue}
                </span>
              </div>
            )}

            <motion.button
              onClick={onClose}
              className="w-full py-3.5 text-[15px] font-extrabold text-white flex items-center justify-center gap-2 rounded-2xl relative z-10 transition-all hover:scale-[1.02]"
              style={{
                background: meta.bg,
                boxShadow: `0 6px 24px ${meta.glowColor}`,
                fontFamily: "var(--font-baloo)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={16} /> Amazing — Keep Going!
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
