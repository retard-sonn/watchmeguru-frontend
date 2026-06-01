"use client";
import { motion } from "motion/react";

interface Props {
  stage?: number;
}

export default function GrowthPlant({ stage = 1 }: Props) {
  const height = Math.min(stage, 5) * 18;

  return (
    <motion.svg viewBox="0 0 60 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Pot */}
      <rect x="18" y="115" width="24" height="20" rx="3" fill="#5B4636" />
      <rect x="14" y="112" width="32" height="6" rx="2" fill="#7A6554" />
      <line x1="20" y1="118" x2="40" y2="118" stroke="#7A6554" strokeWidth="1" opacity="0.5" />

      {/* Stem */}
      <motion.path
        d={`M30,112 Q28,${112 - height} 30,${112 - height - 10}`}
        stroke="#7BA65B" strokeWidth="3"
        strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Leaves */}
      {stage >= 1 && (
        <motion.ellipse cx="30" cy="85" rx="12" ry="7" fill="#94A84D"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="anim-leaf"
          style={{ transformOrigin: "30px 85px" }}
        />
      )}
      {stage >= 2 && (
        <motion.ellipse cx="22" cy="72" rx="10" ry="6" fill="#7BA65B"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="anim-leaf"
          style={{ transformOrigin: "22px 72px", animationDelay: "0.5s" }}
        />
      )}
      {stage >= 3 && (
        <motion.ellipse cx="38" cy="60" rx="10" ry="6" fill="#94A84D"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="anim-leaf"
          style={{ transformOrigin: "38px 60px", animationDelay: "1s" }}
        />
      )}

      {/* Flower/bloom */}
      {stage >= 4 && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }}>
          <circle cx="30" cy="48" r="8" fill="#D9A441" opacity="0.3" />
          <circle cx="30" cy="48" r="5" fill="#D9A441" />
          <circle cx="30" cy="48" r="2.5" fill="#FDF9F0" />
        </motion.g>
      )}
      {stage >= 5 && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }}>
          <circle cx="22" cy="45" r="6" fill="#D9A441" opacity="0.25" />
          <circle cx="38" cy="43" r="5" fill="#D9A441" opacity="0.2" />
        </motion.g>
      )}

      {/* Ground */}
      <ellipse cx="30" cy="117" rx="20" ry="4" fill="rgba(91,70,54,0.1)" />
    </motion.svg>
  );
}
