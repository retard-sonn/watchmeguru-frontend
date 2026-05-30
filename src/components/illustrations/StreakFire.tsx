"use client";
import { motion } from "framer-motion";

interface Props {
  streak?: number;
}

export default function StreakFire({ streak = 1 }: Props) {
  const intensity = Math.min(streak, 30) / 30;
  const scale = 0.6 + intensity * 0.4;

  return (
    <motion.svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      animate={{ scale: [1, 1 + intensity * 0.08, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer flame */}
      <motion.path
        d="M25,56 C25,56 12,40 12,28 C12,16 18,6 25,2 C32,6 38,16 38,28 C38,40 25,56 25,56Z"
        fill="#D9A441" opacity={0.2 + intensity * 0.15}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mid flame */}
      <path
        d="M25,52 C25,52 16,38 16,28 C16,19 20,9 25,6 C30,9 34,19 34,28 C34,38 25,52 25,52Z"
        fill="#D9A441" opacity={0.35 + intensity * 0.25}
      />

      {/* Inner flame */}
      <motion.path
        d="M25,46 C25,46 19,34 19,26 C19,19 22,12 25,10 C28,12 31,19 31,26 C31,34 25,46 25,46Z"
        fill="#E8C65A" opacity={0.5 + intensity * 0.3}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core */}
      <path
        d="M25,38 C25,38 22,30 22,24 C22,19 23,14 25,12 C27,14 28,19 28,24 C28,30 25,38 25,38Z"
        fill="#FDF9F0" opacity={0.6 + intensity * 0.25}
      />

      {/* Streak counter */}
      <motion.text
        x="25" y="30"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#5B4636"
        fontFamily="var(--font-baloo)"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {streak}
      </motion.text>
    </motion.svg>
  );
}
