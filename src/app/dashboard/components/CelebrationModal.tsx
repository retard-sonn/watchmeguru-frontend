"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Flame } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  description: string;
  type: "streak" | "mission" | "general";
  statValue?: string | number;
}

export default function CelebrationModal({ isOpen, onClose, title, subtitle, description, type, statValue }: Props) {
  const isStreak = type === "streak";
  
  // Custom particle colors
  const colors = ["#7BA65B", "#D9A441", "#78A6D8", "#94A84D", "#DC2626"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(61,46,36,0.5)", backdropFilter: "blur(12px)" }}>
          
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => {
              const delay = Math.random() * 0.5;
              const duration = 1.5 + Math.random() * 1.5;
              const color = colors[i % colors.length];
              const xStart = Math.random() * 100;
              const xEnd = xStart + (Math.random() - 0.5) * 20;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 6 + Math.random() * 8,
                    height: 6 + Math.random() * 8,
                    background: color,
                    top: "-20px",
                    left: `${xStart}%`,
                  }}
                  initial={{ y: -20, opacity: 1, rotate: 0 }}
                  animate={{ y: "110vh", opacity: 0, rotate: 360 }}
                  transition={{ duration, delay, ease: "linear", repeat: Infinity }}
                />
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm p-8 rounded-3xl text-center shadow-2xl relative"
            style={{ background: "#FDF9F0", border: "2px solid rgba(91,70,54,0.12)" }}
          >
            {/* Glowing Aura */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
              style={{
                background: isStreak 
                  ? "radial-gradient(circle, rgba(217,164,65,0.4) 0%, transparent 70%)" 
                  : "radial-gradient(circle, rgba(123,166,91,0.4) 0%, transparent 70%)"
              }}
            />

            {/* Illustration */}
            <div className="flex justify-center mb-6 relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center relative shadow-lg"
                style={{
                  background: isStreak 
                    ? "linear-gradient(135deg, #D9A441 0%, #C08A2E 100%)" 
                    : "linear-gradient(135deg, #7BA65B 0%, #5F8C3E 100%)"
                }}
              >
                {isStreak ? (
                  <Flame size={40} className="text-white" strokeWidth={1.5} />
                ) : (
                  <Trophy size={40} className="text-white" strokeWidth={1.5} />
                )}
                
                {/* Floating mini sparkles */}
                <motion.div className="absolute -top-2 -right-2"
                  animate={{ y: [-3, 3, -3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Sparkles size={16} className={isStreak ? "text-amber-500" : "text-moss"} />
                </motion.div>
              </motion.div>
            </div>

            {/* Title / Celebration Badges */}
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block"
              style={{
                background: isStreak ? "rgba(217,164,65,0.1)" : "rgba(123,166,91,0.1)",
                color: isStreak ? "var(--mustard-deep)" : "var(--moss)"
              }}
            >
              {subtitle}
            </span>
            
            <h2 className="text-[24px] font-extrabold tracking-tight mb-2" 
              style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
              {title}
            </h2>
            
            <p className="text-[13px] mb-6 font-medium leading-relaxed" style={{ color: "var(--ink-light)" }}>
              {description}
            </p>

            {statValue && (
              <div className="p-4 rounded-2xl mb-6 flex items-center justify-center gap-2"
                style={{ background: "#F4EEDB", border: "1px solid var(--border)" }}>
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                  Current Stat:
                </span>
                <span className="text-[16px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  {statValue}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3.5 btn-mustard text-[15px] flex items-center justify-center gap-2"
              style={{
                background: isStreak 
                  ? "linear-gradient(135deg, #D9A441 0%, #C08A2E 100%)" 
                  : "linear-gradient(135deg, #7BA65B 0%, #5F8C3E 100%)",
                boxShadow: isStreak 
                  ? "0 4px 16px rgba(217,164,65,0.3)" 
                  : "0 4px 16px rgba(123,166,91,0.3)"
              }}
            >
              <Sparkles size={16} /> Continue Growing
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
