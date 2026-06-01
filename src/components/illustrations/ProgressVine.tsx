"use client";
import { motion } from "motion/react";

interface Props {
  from: { x: number; y: number };
  to: { x: number; y: number };
  grown: boolean;
  delay?: number;
}

export default function ProgressVine({ from, to, grown, delay = 0 }: Props) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx1 = from.x + dx * 0.4;
  const cy1 = from.y;
  const cx2 = to.x - dx * 0.4;
  const cy2 = to.y;

  return (
    <motion.path
      d={`M${from.x},${from.y} C${cx1},${cy1} ${cx2},${cy2} ${to.x},${to.y}`}
      stroke="#7BA65B"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={grown ? { pathLength: 1 } : { pathLength: 0 }}
      transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
