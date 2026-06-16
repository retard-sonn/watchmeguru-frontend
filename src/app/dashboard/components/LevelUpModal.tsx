"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  levelTitle: string;
  previousTitle?: string;
}

const LEVEL_TITLES = [
  { min: 1,  name: "Seedling",    emoji: "🌱", desc: "Your journey begins. Roots are forming.", color: "#7BA65B" },
  { min: 3,  name: "Sprout",      emoji: "🌿", desc: "First leaves unfurl. You're gaining strength.", color: "#94A84D" },
  { min: 5,  name: "Sapling",     emoji: "🪴", desc: "Standing tall. Weathering every storm.", color: "#58CC02" },
  { min: 8,  name: "Tree",        emoji: "🌳", desc: "Full canopy. Bearing the fruits of discipline.", color: "#1CB0F6" },
  { min: 12, name: "Forest",      emoji: "🏆", desc: "An ecosystem. You are the mentor now.", color: "#D9A441" },
  { min: 20, name: "Mountain",    emoji: "⛰️", desc: "Unstoppable. You define what's possible.", color: "#CE82FF" },
  { min: 30, name: "Constellation", emoji: "🌟", desc: "Your discipline lights up the sky.", color: "#FFC800" },
];

function getLevelMeta(level: number) {
  for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
    if (level >= LEVEL_TITLES[i].min) return LEVEL_TITLES[i];
  }
  return LEVEL_TITLES[0];
}

const CONFETTI_COLORS = ["#58CC02", "#FFC800", "#1CB0F6", "#CE82FF", "#FF7A00", "#FF4B4B", "#7BA65B", "#D9A441"];

function ConfettiParticle({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left = 10 + Math.random() * 80; // 10-90%
  const size = 6 + Math.random() * 10; // 6-16px
  const delay = Math.random() * 0.5;
  const duration = 1.5 + Math.random() * 2;
  const isCircle = Math.random() > 0.5;
  const drift = (Math.random() - 0.5) * 40;

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: isCircle ? size : size * 0.4,
        borderRadius: isCircle ? "50%" : "2px",
        background: color,
        top: "-5%",
        left: `${left}%`,
      }}
      initial={{ y: "-5vh", x: 0, rotate: 0, opacity: 1 }}
      animate={{ y: "110vh", x: drift, rotate: 360 * (Math.random() > 0.5 ? 1 : -1), opacity: 0 }}
      transition={{ duration, delay, ease: "linear" }}
    />
  );
}

export default function LevelUpModal({ isOpen, onClose, newLevel, levelTitle, previousTitle }: LevelUpModalProps) {
  const meta = getLevelMeta(newLevel);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4"
          style={{ background: "rgba(61,46,36,0.6)", backdropFilter: "blur(16px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Confetti layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>

          <motion.div
            className="w-full max-w-sm p-8 rounded-3xl text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(165deg, #FDF9F0 0%, #F4EEDB 100%)",
              border: "2px solid rgba(91,70,54,0.08)",
              boxShadow: "0 32px 80px rgba(61,46,36,0.25)",
            }}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow behind level number */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 300, height: 300,
                background: `radial-gradient(circle, ${meta.color}15 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              {/* Previous level */}
              {previousTitle && (
                <motion.p
                  className="text-[12px] font-semibold mb-1"
                  style={{ color: "var(--ink-muted)" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {previousTitle}
                </motion.p>
              )}

              {/* Level emoji + badge */}
              <motion.div
                className="w-24 h-24 mx-auto mb-5 rounded-3xl flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${meta.color}20, ${meta.color}08)`,
                  border: `2px solid ${meta.color}30`,
                }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <span className="text-[44px]">{meta.emoji}</span>

                {/* Sparkle orbit */}
                {["✦", "✧", "⋆"].map((star, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-[10px]"
                    style={{ color: meta.color }}
                    animate={{
                      rotate: [i * 120, i * 120 + 360],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.span
                      className="block"
                      animate={{ x: [32, 36, 32], y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {star}
                    </motion.span>
                  </motion.span>
                ))}
              </motion.div>

              {/* Level number */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span
                  className="text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3"
                  style={{ background: `${meta.color}12`, color: meta.color }}
                >
                  Level Up!
                </span>
                <h2
                  className="text-[36px] font-extrabold leading-none mb-2"
                  style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
                >
                  Level {newLevel}
                </h2>
                <h3
                  className="text-[20px] font-extrabold mb-3"
                  style={{ color: meta.color, fontFamily: "var(--font-baloo)" }}
                >
                  {meta.name}
                </h3>
                <p className="text-[14px] font-medium leading-relaxed mb-8" style={{ color: "var(--ink-light)" }}>
                  {meta.desc}
                </p>
              </motion.div>

              {/* Continue button */}
              <motion.button
                onClick={onClose}
                className="w-full py-4 rounded-2xl text-[16px] font-extrabold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${meta.color}, ${meta.color}CC)`,
                  boxShadow: `0 8px 32px ${meta.color}40`,
                  fontFamily: "var(--font-baloo)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20V8C20 12.418 16.418 16 12 16C7.582 16 4 12.418 4 8V4Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Continue Growing
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
