"use client";
import { motion } from "motion/react";

interface Props {
  variant: "consistency" | "focus" | "momentum" | "deepwork" | "xp" | "community";
  delay?: number;
}

export default function TerrainBlock({ variant, delay = 0 }: Props) {
  return (
    <motion.svg
      viewBox="0 0 160 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {variant === "consistency" && <Consistency />}
      {variant === "focus" && <Focus />}
      {variant === "momentum" && <Momentum />}
      {variant === "deepwork" && <DeepWork />}
      {variant === "xp" && <XP />}
      {variant === "community" && <Community />}
    </motion.svg>
  );
}

/* ─── CONSISTENCY — Layered Growth Biome ──────────────── */
function Consistency() {
  return (
    <g>
      <ellipse cx="80" cy="112" rx="60" ry="10" fill="rgba(91,70,54,0.08)" />
      {/* Terrain layers — stacked */}
      <path d="M20,105 Q50,90 80,95 Q110,100 140,105 L140,115 Q110,118 80,115 Q50,112 20,115Z" fill="#94A84D" opacity="0.35" />
      <path d="M30,95 Q55,82 80,86 Q105,90 130,95 L130,108 Q105,110 80,107 Q55,104 30,108Z" fill="#FF9E1B" opacity="0.5" />
      <path d="M40,85 Q60,74 80,78 Q100,82 120,85 L120,98 Q100,100 80,97 Q60,94 40,98Z" fill="#5F8C3E" opacity="0.55" />
      {/* Repetitive small sprouts */}
      {[50, 65, 80, 95, 110].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={72} x2={x} y2={65} stroke="#5B4636" strokeWidth="1.5" />
          <ellipse cx={x} cy={63} rx="4" ry="5" fill="#FF9E1B" className="anim-leaf" style={{ animationDelay: `${i * 0.2}s` }} />
        </g>
      ))}
      {/* Tree rings on side */}
      <g transform="translate(32, 68)">
        <circle cx="0" cy="0" r="12" fill="none" stroke="#58CC02" strokeWidth="1.5" opacity="0.4" />
        <circle cx="0" cy="0" r="8" fill="none" stroke="#58CC02" strokeWidth="1" opacity="0.3" />
        <circle cx="0" cy="0" r="4" fill="none" stroke="#58CC02" strokeWidth="0.8" opacity="0.5" />
      </g>
      {/* Tiny path */}
      <path d="M60,90 Q80,88 100,90" stroke="#7A6554" strokeWidth="1" fill="none" strokeDasharray="3,3" opacity="0.5" />
    </g>
  );
}

/* ─── FOCUS — Protected Deep Work Sanctuary ───────────── */
function Focus() {
  return (
    <g>
      <ellipse cx="80" cy="112" rx="55" ry="8" fill="rgba(91,70,54,0.08)" />
      {/* Canyon walls */}
      <path d="M15,100 L25,55 L35,100Z" fill="#5B4636" opacity="0.7" />
      <path d="M145,100 L135,55 L125,100Z" fill="#5B4636" opacity="0.7" />
      <path d="M20,102 L30,65 L40,102Z" fill="#3D2E24" opacity="0.5" />
      <path d="M140,102 L130,65 L120,102Z" fill="#3D2E24" opacity="0.5" />
      {/* Isolated chamber */}
      <rect x="65" y="60" width="30" height="35" rx="4" fill="#FF9E1B" opacity="0.3" />
      <rect x="65" y="60" width="30" height="35" rx="4" fill="none" stroke="#5F8C3E" strokeWidth="1.5" />
      {/* Spotlight beam */}
      <motion.polygon
        points="80,35 70,60 90,60"
        fill="#58CC02"
        opacity="0.15"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Glowing orb inside chamber */}
      <motion.circle
        cx="80" cy="77" r="5"
        fill="#58CC02"
        opacity="0.6"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      {/* Fog walls */}
      <path d="M25,60 Q40,55 55,65" stroke="#78A6D8" strokeWidth="2" opacity="0.25" strokeLinecap="round" fill="none" />
      <path d="M105,65 Q120,55 135,60" stroke="#78A6D8" strokeWidth="2" opacity="0.25" strokeLinecap="round" fill="none" />
    </g>
  );
}

/* ─── MOMENTUM — Acceleration River System ─────────────── */
function Momentum() {
  return (
    <g>
      <ellipse cx="80" cy="112" rx="55" ry="8" fill="rgba(91,70,54,0.08)" />
      {/* River terrain */}
      <path d="M10,85 Q50,78 80,85 Q110,92 150,85 L150,100 Q110,107 80,100 Q50,93 10,100Z" fill="#78A6D8" opacity="0.25" />
      {/* Flowing waterfalls */}
      <path d="M30,70 L35,82 L40,70" stroke="#78A6D8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M55,65 L60,78 L65,65" stroke="#78A6D8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M95,68 L100,80 L105,68" stroke="#78A6D8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M120,72 L125,84 L130,72" stroke="#78A6D8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Flow particles */}
      {[45, 60, 75, 95, 110].map((x, i) => (
        <motion.circle
          key={i}
          cx={x} cy={90} r="2" fill="#78A6D8" opacity="0.6"
          animate={{ cx: [x, x + 8, x] }}
          transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
        />
      ))}
      {/* Terrain ramp */}
      <path d="M15,95 Q50,88 80,95" stroke="#94A84D" strokeWidth="2" fill="none" opacity="0.35" />
      <path d="M80,95 Q110,90 145,95" stroke="#FF9E1B" strokeWidth="2" fill="none" opacity="0.35" />
      {/* Acceleration arrows */}
      <motion.path
        d="M50,55 L65,50 L60,58Z"
        fill="#78A6D8" opacity="0.3"
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M100,58 L115,53 L110,61Z"
        fill="#78A6D8" opacity="0.3"
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
    </g>
  );
}

/* ─── DEEP WORK — Underground Study Cavern ─────────────── */
function DeepWork() {
  return (
    <g>
      <ellipse cx="80" cy="118" rx="55" ry="6" fill="rgba(91,70,54,0.1)" />
      {/* Underground arch */}
      <path d="M25,100 Q80,60 135,100" stroke="#5B4636" strokeWidth="3" fill="none" />
      <path d="M25,100 Q80,65 135,100" fill="#3D2E24" opacity="0.2" />
      {/* Tunnel entry */}
      <ellipse cx="80" cy="90" rx="22" ry="16" fill="#2B1F18" />
      <ellipse cx="80" cy="90" rx="18" ry="13" fill="#3D2E24" />
      {/* Lantern */}
      <motion.g animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
        <rect x="76" y="78" width="8" height="4" rx="1" fill="#58CC02" />
        <circle cx="80" cy="80" r="6" fill="#58CC02" opacity="0.4" />
        <circle cx="80" cy="80" r="3" fill="#E8C65A" />
      </motion.g>
      {/* Lantern line */}
      <line x1="80" y1="68" x2="80" y2="74" stroke="#5B4636" strokeWidth="1" />
      {/* Study desk inside */}
      <rect x="70" y="88" width="20" height="3" rx="1" fill="#7A6554" opacity="0.5" />
      {/* Wall sconces */}
      <circle cx="58" cy="85" r="3" fill="#58CC02" opacity="0.3" />
      <circle cx="102" cy="85" r="3" fill="#58CC02" opacity="0.3" />
      {/* Protection barrier symbols */}
      <path d="M40,75 L40,95" stroke="#FF9E1B" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.35" />
      <path d="M120,75 L120,95" stroke="#FF9E1B" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.35" />
    </g>
  );
}

/* ─── XP — Evolving Civilization Tile ──────────────────── */
function XP() {
  return (
    <g>
      <ellipse cx="80" cy="112" rx="60" ry="10" fill="rgba(91,70,54,0.08)" />
      {/* Base terrain */}
      <path d="M20,100 Q50,90 80,95 Q110,100 140,95 L140,105 Q110,110 80,105 Q50,100 20,105Z" fill="#FF9E1B" opacity="0.3" />
      {/* Tower 1 — small */}
      <rect x="35" y="68" width="14" height="30" rx="2" fill="#5B4636" opacity="0.6" />
      <rect x="37" y="66" width="10" height="6" rx="1" fill="#94A84D" opacity="0.5" />
      {/* Tower 2 — medium */}
      <rect x="55" y="58" width="18" height="40" rx="3" fill="#7A6554" opacity="0.65" />
      <rect x="57" y="55" width="14" height="8" rx="2" fill="#58CC02" opacity="0.5" />
      <motion.circle
        cx="64" cy="59" r="3" fill="#E8C65A" opacity="0.7"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Tower 3 — large */}
      <rect x="100" y="48" width="22" height="50" rx="3" fill="#5B4636" opacity="0.7" />
      <rect x="103" y="44" width="16" height="10" rx="2" fill="#58CC02" opacity="0.6" />
      <circle cx="111" cy="49" r="4" fill="#E8C65A" opacity="0.8" />
      {/* Bridge between towers */}
      <path d="M64,80 Q82,75 100,78" stroke="#94A84D" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Unlock glow */}
      <motion.circle
        cx="64" cy="59" r="8" fill="#58CC02" opacity="0.08"
        animate={{ r: [8, 14, 8], opacity: [0.08, 0, 0.08] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Expansion arrows */}
      <path d="M15,85 L10,85 M18,88 L10,88" stroke="#58CC02" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M145,85 L150,85 M142,88 L150,88" stroke="#58CC02" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </g>
  );
}

/* ─── COMMUNITY — Connected Ecosystem Network ──────────── */
function Community() {
  return (
    <g>
      <ellipse cx="80" cy="115" rx="60" ry="8" fill="rgba(91,70,54,0.06)" />
      {/* Island 1 */}
      <ellipse cx="40" cy="95" rx="22" ry="10" fill="#FF9E1B" opacity="0.3" />
      <ellipse cx="40" cy="95" rx="16" ry="7" fill="#94A84D" opacity="0.35" />
      {/* Village on island 1 */}
      <rect x="34" y="78" width="12" height="14" rx="2" fill="#5B4636" opacity="0.5" />
      <polygon points="40,70 34,78 46,78" fill="#94A84D" opacity="0.45" />
      {/* Island 2 */}
      <ellipse cx="80" cy="100" rx="28" ry="12" fill="#FF9E1B" opacity="0.35" />
      <ellipse cx="80" cy="100" rx="22" ry="9" fill="#5F8C3E" opacity="0.4" />
      {/* Village on island 2 */}
      <rect x="73" y="80" width="14" height="17" rx="2" fill="#7A6554" opacity="0.55" />
      <polygon points="80,72 73,80 87,80" fill="#58CC02" opacity="0.5" />
      {/* Island 3 */}
      <ellipse cx="120" cy="95" rx="20" ry="9" fill="#FF9E1B" opacity="0.3" />
      <ellipse cx="120" cy="95" rx="14" ry="6" fill="#94A84D" opacity="0.35" />
      {/* Small structure on island 3 */}
      <rect x="115" y="80" width="10" height="12" rx="2" fill="#5B4636" opacity="0.45" />
      <polygon points="120,73 115,80 125,80" fill="#94A84D" opacity="0.4" />
      {/* Bridges connecting islands */}
      <path d="M56,92 Q68,88 73,92" stroke="#78A6D8" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M93,94 Q106,90 120,92" stroke="#78A6D8" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Signal towers */}
      <motion.g animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <circle cx="40" cy="70" r="2.5" fill="#58CC02" opacity="0.6" />
        <circle cx="80" cy="68" r="2.5" fill="#58CC02" opacity="0.6" />
        <circle cx="120" cy="70" r="2.5" fill="#58CC02" opacity="0.6" />
      </motion.g>
      {/* Shared garden on center island */}
      <ellipse cx="80" cy="88" rx="5" ry="3" fill="#FF9E1B" opacity="0.4" />
      {/* Connection glow paths */}
      {[56, 93, 40, 120].map((x) => (
        <motion.circle
          key={`glow-${x}`}
          cx={x} cy="92" r="1.5"
          fill="#78A6D8" opacity="0.5"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </g>
  );
}
