"use client";
import { motion } from "motion/react";

interface Props {
  progress?: number;
}

export default function XPMeter({ progress = 0.4 }: Props) {
  const p = Math.min(Math.max(progress, 0), 1);
  const offset = 2 * Math.PI * 18 * (1 - p);

  return (
    <motion.svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      initial={{ opacity: 0, rotate: -20 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Tree trunk */}
      <rect x="28" y="30" width="4" height="18" rx="1" fill="#5B4636" />

      {/* XP ring background */}
      <circle cx="30" cy="28" r="18" fill="none" stroke="rgba(91,70,54,0.08)" strokeWidth="3" />

      {/* XP ring progress */}
      <motion.circle
        cx="30" cy="28" r="18"
        fill="none"
        stroke="#7BA65B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 18}`}
        initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />

      {/* Canopy — tree top */}
      <motion.ellipse
        cx="30" cy="22" rx="14" ry="12"
        fill="#7BA65B"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
      />
      <ellipse cx="30" cy="18" rx="10" ry="9" fill="#94A84D" />

      {/* XP stars/leaves on canopy */}
      {p >= 0.3 && <Star x={20} y={16} size={4} delay={1.2} />}
      {p >= 0.5 && <Star x={36} y={20} size={5} delay={1.4} />}
      {p >= 0.7 && <Star x={28} y={12} size={4} delay={1.6} />}
      {p >= 0.9 && <Star x={38} y={14} size={5} delay={1.8} />}

      {/* XP label */}
      <motion.text
        x="30" y="26"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#3D2E24"
        fontFamily="var(--font-baloo)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        XP
      </motion.text>

      {/* Ground */}
      <ellipse cx="30" cy="50" rx="14" ry="3" fill="rgba(91,70,54,0.08)" />
    </motion.svg>
  );
}

function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.text
      x={x} y={y}
      fontSize={size * 3}
      fill="#D9A441"
      textAnchor="middle"
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.4, type: "spring" }}
      className="anim-pulse"
    >
      ✦
    </motion.text>
  );
}
