"use client";
import { motion } from "motion/react";

interface Props {
  size?: number;
  state?: "idle" | "active" | "alert";
  animated?: boolean;
}

export default function GuruGuardian({ size = 160, state = "idle", animated = true }: Props) {
  const s = size;
  const eyeColor = state === "alert" ? "#D9A441" : state === "active" ? "#7BA65B" : "#5B4636";

  return (
    <motion.svg
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: s, height: (s * 200) / 160 }}
      animate={animated ? { y: [0, -4, 0] } : undefined}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Shadow */}
      <ellipse cx="80" cy="190" rx="45" ry="8" fill="rgba(91,70,54,0.08)" />

      {/* Body — round parchment pouch */}
      <ellipse cx="80" cy="130" rx="48" ry="50" fill="#F4EEDB" />
      <ellipse cx="80" cy="132" rx="42" ry="43" fill="#FDF9F0" />
      {/* Body bottom gradient */}
      <ellipse cx="80" cy="140" rx="38" ry="30" fill="rgba(91,70,54,0.03)" />

      {/* Graduation Cap */}
      <rect x="58" y="52" width="44" height="6" rx="2" fill="#5B4636" />
      <path d="M58,58 L58,64 Q70,68 80,64 Q90,68 102,64 L102,58" fill="#5B4636" />
      <rect x="72" y="44" width="16" height="10" rx="3" fill="#5B4636" />
      <line x1="80" y1="44" x2="80" y2="52" stroke="#5B4636" strokeWidth="2" />
      {/* Tassel */}
      <path d="M90,44 L96,38" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="97" cy="37" r="3" fill="#D9A441" />

      {/* Ears — round and friendly */}
      <ellipse cx="42" cy="90" rx="14" ry="10" fill="#F4EEDB" />
      <ellipse cx="118" cy="90" rx="14" ry="10" fill="#F4EEDB" />
      <ellipse cx="42" cy="90" rx="9" ry="6" fill="rgba(123,166,91,0.15)" />
      <ellipse cx="118" cy="90" rx="9" ry="6" fill="rgba(123,166,91,0.15)" />

      {/* Glasses — iconic */}
      <circle cx="62" cy="95" r="15" fill="none" stroke="#5B4636" strokeWidth="2.5" />
      <circle cx="98" cy="95" r="15" fill="none" stroke="#5B4636" strokeWidth="2.5" />
      <path d="M77,95 L83,95" stroke="#5B4636" strokeWidth="2.5" />
      {/* Side arms */}
      <path d="M47,92 L44,88" stroke="#5B4636" strokeWidth="2" strokeLinecap="round" />
      <path d="M113,92 L116,88" stroke="#5B4636" strokeWidth="2" strokeLinecap="round" />

      {/* Eyes — wise and warm */}
      <motion.circle cx="62" cy="93" r="7" fill={eyeColor}
        animate={state === "active" ? { r: [6, 7.5, 6] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="98" cy="93" r="7" fill={eyeColor}
        animate={state === "active" ? { r: [7.5, 6, 7.5] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx="64" cy="91" r="2.5" fill="#FDF9F0" />
      <circle cx="100" cy="91" r="2.5" fill="#FDF9F0" />

      {/* Eyebrows — knowing, slightly raised */}
      <path d="M48,84 Q55,80 72,85" stroke="#5B4636" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M88,85 Q105,80 112,84" stroke="#5B4636" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <ellipse cx="80" cy="102" rx="4" ry="3" fill="#D9A441" opacity="0.4" />

      {/* Mouth — gentle smile */}
      <motion.path
        d="M72,112 Q80,118 88,112"
        stroke="#5B4636" strokeWidth="2" strokeLinecap="round" fill="none"
        animate={state === "alert" ? { d: "M74,114 Q80,110 86,114" } : undefined}
        transition={{ duration: 0.5 }}
      />

      {/* Arms — holding a small lamp */}
      <path d="M34,125 Q28,135 32,145" stroke="#F4EEDB" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M126,125 Q132,135 128,145" stroke="#F4EEDB" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Glowing Lamp (knowledge) — right hand */}
      <motion.g
        animate={animated ? { opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <ellipse cx="128" cy="148" rx="8" ry="10" fill="#D9A441" opacity="0.3" />
        <ellipse cx="128" cy="148" rx="5" ry="7" fill="#E8C65A" opacity="0.5" />
        <ellipse cx="128" cy="148" rx="3" ry="4" fill="#FDF9F0" opacity="0.7" />
        <line x1="128" y1="140" x2="128" y2="144" stroke="#5B4636" strokeWidth="1.5" />
      </motion.g>

      {/* Small notebook in left hand */}
      <rect x="26" y="140" width="12" height="9" rx="2" fill="#FDF9F0" stroke="#7BA65B" strokeWidth="1" />
      <line x1="28" y1="143" x2="36" y2="143" stroke="#7BA65B" strokeWidth="0.8" opacity="0.5" />
      <line x1="28" y1="145" x2="34" y2="145" stroke="#7BA65B" strokeWidth="0.8" opacity="0.5" />

      {/* Tiny feet */}
      <ellipse cx="68" cy="182" rx="10" ry="5" fill="#D9A441" opacity="0.4" />
      <ellipse cx="92" cy="182" rx="10" ry="5" fill="#D9A441" opacity="0.4" />

      {/* Badge on chest — WatchMeGuru logo mark */}
      <motion.circle cx="80" cy="118" r="9" fill="#F4EEDB" stroke="#7BA65B" strokeWidth="1.5"
        animate={animated && state === "active" ? { scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x="80" y="121" textAnchor="middle" fontSize="9" fontWeight="800" fill="#7BA65B" fontFamily="var(--font-baloo)">W</text>

      {/* Knowledge sparkles */}
      {state === "active" && (
        <>
          {[[140, 140], [24, 132], [145, 155]].map(([x, y], i) => (
            <motion.text
              key={i}
              x={x} y={y}
              fontSize="8"
              fill="#D9A441"
              opacity={0.6}
              animate={{ opacity: [0.4, 0.8, 0.4], y: [y, y - 4, y] }}
              transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.3 }}
            >
              ✦
            </motion.text>
          ))}
        </>
      )}
    </motion.svg>
  );
}
