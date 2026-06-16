"use client";
import { motion } from "motion/react";

interface Props {
  label: string;
  time: string;
  delayed?: number;
}

export default function MissionCard({ label, time, delayed = 0 }: Props) {
  return (
    <motion.div
      className="card-terrain p-5 flex items-center gap-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delayed, duration: 0.5 }}
    >
      <svg viewBox="0 0 40 40" className="w-10 h-10 flex-shrink-0" fill="none">
        <rect x="4" y="4" width="32" height="32" rx="8" fill="#F4EEDB" stroke="rgba(91,70,54,0.15)" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="6" fill="none" stroke="#FF9E1B" strokeWidth="2" />
        <motion.path
          d="M17,20 L19,22 L23,18"
          stroke="#FF9E1B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + delayed, duration: 0.5 }}
        />
      </svg>
      <div>
        <div className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>{label}</div>
        <div className="text-[13px] mt-0.5" style={{ color: "var(--ink-light)" }}>{time}</div>
      </div>
    </motion.div>
  );
}
