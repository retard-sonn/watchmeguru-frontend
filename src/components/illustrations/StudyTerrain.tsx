"use client";
import { motion } from "motion/react";

interface Props {
  hours: number;
  maxHours?: number;
  label: string;
  day: number;
}

export default function StudyTerrain({ hours, maxHours = 8, label, day }: Props) {
  const heightPct = Math.min(hours / maxHours, 1);
  const barHeight = 10 + heightPct * 55;
  const color = hours >= 6 ? "#7BA65B" : hours >= 3 ? "#94A84D" : hours > 0 ? "#D9A441" : "#EBE3C8";

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: day * 0.05, duration: 0.4 }}
    >
      <motion.div
        className="w-12 rounded-lg relative flex flex-col-reverse"
        style={{ height: 68, background: "rgba(91,70,54,0.03)" }}
      >
        {/* Terrain bar */}
        <motion.div
          className="w-full rounded-lg relative"
          style={{
            height: barHeight,
            background: color,
            opacity: hours > 0 ? 0.7 : 0.25,
          }}
          initial={{ height: 0 }}
          whileInView={{ height: barHeight }}
          viewport={{ once: true }}
          transition={{ delay: day * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Grass top for active days */}
          {hours > 0 && (
            <div className="absolute -top-1 left-0 right-0 flex justify-center gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-[3px] h-[4px] rounded-t-full" style={{ background: "#7BA65B", opacity: 0.5 }} />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
      <span className="text-[11px] font-semibold" style={{ color: "var(--ink-muted)" }}>
        {label}
      </span>
    </motion.div>
  );
}
