"use client";
import { motion } from "motion/react";

interface Props {
  icon: string;
  label: string;
  earned: boolean;
  delayed?: number;
}

export default function Badge({ icon, label, earned, delayed = 0 }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ scale: 0, rotate: -10 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delayed, duration: 0.5, type: "spring" }}
    >
      <svg viewBox="0 0 50 56" className={`w-14 h-auto ${!earned ? "opacity-25" : ""}`} fill="none">
        {/* Badge shape */}
        <polygon
          points="25,2 34,16 50,20 40,32 42,49 25,42 8,49 10,32 0,20 16,16"
          fill={earned ? "#D9A441" : "#EBE3C8"}
          stroke={earned ? "#C08A2E" : "rgba(91,70,54,0.15)"}
          strokeWidth="1.5"
        />
        {earned && (
          <polygon points="25,6 32,17 45,20 36,30 38,44 25,38 12,44 14,30 5,20 18,17" fill="#E8C65A" />
        )}
        <text
          x="25" y={earned ? "30" : "31"}
          textAnchor="middle"
          fontSize="16"
          fill={earned ? "#5B4636" : "rgba(91,70,54,0.3)"}
        >
          {icon}
        </text>
        {/* Ribbon */}
        <path d="M16,50 Q20,56 25,50 Q30,56 34,50" fill={earned ? "#7BA65B" : "none"} stroke={earned ? "#5F8C3E" : "none"} strokeWidth="1" />
      </svg>
      <span className="text-[11px] font-semibold text-center" style={{ color: earned ? "var(--earthy)" : "var(--ink-muted)" }}>
        {label}
      </span>
    </motion.div>
  );
}
