"use client";
import { motion } from "framer-motion";

interface Props {
  step: 1 | 2 | 3 | 4 | 5 | 6;
}

export default function StepIllustration({ step }: Props) {
  return (
    <motion.svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {step === 1 && <StarterIsland />}
      {step === 2 && <PlannerGrid />}
      {step === 3 && <VerificationBeacon />}
      {step === 4 && <GuardianChamber />}
      {step === 5 && <ExpandingRealm />}
      {step === 6 && <FullWorld />}
    </motion.svg>
  );
}

/* ─── STEP 1 — Starter Island ─────────────────────────── */
function StarterIsland() {
  return (
    <g>
      <ellipse cx="60" cy="70" rx="45" ry="12" fill="rgba(91,70,54,0.06)" />
      <ellipse cx="60" cy="65" rx="35" ry="18" fill="#7BA65B" opacity="0.3" />
      <ellipse cx="60" cy="64" rx="28" ry="14" fill="#94A84D" opacity="0.35" />
      {/* Campfire */}
      <line x1="60" y1="62" x2="55" y2="56" stroke="#5B4636" strokeWidth="1.5" />
      <line x1="60" y1="62" x2="65" y2="56" stroke="#5B4636" strokeWidth="1.5" />
      <motion.circle
        cx="60" cy="54" r="4" fill="#D9A441" opacity="0.6"
        animate={{ r: [3, 5, 3], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Seed planted */}
      <line x1="45" y1="68" x2="45" y2="60" stroke="#5B4636" strokeWidth="1" />
      <ellipse cx="45" cy="58" rx="3" ry="2" fill="#94A84D" opacity="0.5" />
      {/* Path */}
      <path d="M48,72 Q54,70 60,72" stroke="#7A6554" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.4" />
      {/* Gate */}
      <rect x="70" y="50" width="14" height="18" rx="2" fill="#5B4636" opacity="0.3" />
      <path d="M77,45 L70,50 L84,50 L77,45Z" fill="#D9A441" opacity="0.25" />
      {/* Map marker */}
      <motion.circle cx="82" cy="38" r="5" fill="none" stroke="#D9A441" strokeWidth="1.5"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </g>
  );
}

/* ─── STEP 2 — Planner Terrain Grid ────────────────────── */
function PlannerGrid() {
  return (
    <g>
      <ellipse cx="60" cy="78" rx="50" ry="8" fill="rgba(91,70,54,0.06)" />
      {/* Terrain platform */}
      <path d="M15,70 Q60,58 105,70 L105,78 Q60,86 15,78Z" fill="#94A84D" opacity="0.3" />
      {/* Grid zones */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={30 + col * 25} y={48 + row * 14}
            width="20" height="10" rx="1.5"
            fill={row === 1 && col === 1 ? "#D9A441" : "#7BA65B"}
            opacity={row === 1 && col === 1 ? 0.4 : 0.2}
            stroke="rgba(91,70,54,0.15)"
            strokeWidth="0.5"
          />
        ))
      )}
      {/* Clock tower */}
      <rect x="55" y="34" width="10" height="16" rx="2" fill="#5B4636" opacity="0.5" />
      <circle cx="60" cy="38" r="4" fill="#FDF9F0" opacity="0.6" />
      <line x1="60" y1="38" x2="60" y2="35" stroke="#5B4636" strokeWidth="1" />
      <line x1="60" y1="38" x2="63" y2="38" stroke="#5B4636" strokeWidth="1" />
      {/* Connecting paths */}
      <path d="M40,65 L40,60" stroke="#7A6554" strokeWidth="1" strokeDasharray="2,1" opacity="0.35" />
      <path d="M65,65 L65,60 L90,60" stroke="#7A6554" strokeWidth="1" strokeDasharray="2,1" opacity="0.35" />
    </g>
  );
}

/* ─── STEP 3 — Verification Beacon ──────────────────────── */
function VerificationBeacon() {
  return (
    <g>
      <ellipse cx="60" cy="80" rx="45" ry="8" fill="rgba(91,70,54,0.06)" />
      {/* Archive tower */}
      <rect x="52" y="38" width="16" height="36" rx="3" fill="#78A6D8" opacity="0.4" />
      <rect x="52" y="38" width="16" height="36" rx="3" fill="none" stroke="#5A8ABE" strokeWidth="1.5" />
      {/* Beacon glow */}
      <motion.circle cx="60" cy="34" r="8" fill="#78A6D8" opacity="0.15"
        animate={{ r: [8, 16, 8], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <circle cx="60" cy="34" r="4" fill="#A8C8E8" opacity="0.6" />
      {/* Floating documents */}
      {[[30, 42], [42, 50], [78, 48], [88, 40]].map(([x, y], i) => (
        <motion.rect key={i} x={x - 6} y={y - 4} width="12" height="8" rx="1"
          fill="#FDF9F0" opacity="0.3" stroke="rgba(91,70,54,0.1)" strokeWidth="0.5"
          animate={{ y: [y - 4, y - 8, y - 4] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* Verification check */}
      <motion.path
        d="M52,58 L56,62 L68,52"
        stroke="#7BA65B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
      {/* Base */}
      <rect x="46" y="74" width="28" height="4" rx="2" fill="#5B4636" opacity="0.25" />
    </g>
  );
}

/* ─── STEP 4 — AI Guardian Chamber ─────────────────────── */
function GuardianChamber() {
  return (
    <g>
      <ellipse cx="60" cy="78" rx="45" ry="8" fill="rgba(91,70,54,0.06)" />
      {/* Chamber walls */}
      <path d="M20,70 Q60,48 100,70" stroke="#5B4636" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M20,70 Q60,52 100,70" fill="#3D2E24" opacity="0.15" />
      {/* Inspection table */}
      <rect x="42" y="58" width="36" height="5" rx="2" fill="#7A6554" opacity="0.5" />
      {/* Glowing crystals */}
      {[48, 62].map((x, i) => (
        <motion.g key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
          <polygon points={`${x},52 ${x + 4},44 ${x + 8},52`} fill="#78A6D8" opacity="0.5" />
          <polygon points={`${x + 1},52 ${x + 4},46 ${x + 7},52`} fill="#A8C8E8" opacity="0.6" />
        </motion.g>
      ))}
      {/* Mentor presence — small eye symbols */}
      <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
        <ellipse cx="60" cy="42" rx="10" ry="8" fill="none" stroke="#D9A441" strokeWidth="1.5" opacity="0.5" />
        <circle cx="58" cy="41" r="3" fill="#D9A441" opacity="0.4" />
        <circle cx="62" cy="41" r="3" fill="#D9A441" opacity="0.4" />
      </motion.g>
      {/* Wisdom library shelves */}
      <line x1="30" y1="62" x2="30" y2="68" stroke="#5B4636" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
      <line x1="90" y1="62" x2="90" y2="68" stroke="#5B4636" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
      {[32, 36, 88, 84].map((x) => (
        <line key={x} x1={x} y1={64} x2={x} y2={66} stroke="#7A6554" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      ))}
    </g>
  );
}

/* ─── STEP 5 — Expanding Realm ──────────────────────────── */
function ExpandingRealm() {
  return (
    <g>
      <ellipse cx="60" cy="78" rx="50" ry="8" fill="rgba(91,70,54,0.06)" />
      {/* Expanding terrain rings */}
      <ellipse cx="60" cy="68" rx="40" ry="14" fill="#94A84D" opacity="0.2" />
      <ellipse cx="60" cy="65" rx="30" ry="11" fill="#7BA65B" opacity="0.3" />
      <ellipse cx="60" cy="62" rx="20" ry="8" fill="#5F8C3E" opacity="0.4" />
      {/* Structures upgrading */}
      <rect x="38" y="58" width="10" height="14" rx="2" fill="#5B4636" opacity="0.5" />
      <polygon points="43,50 38,58 48,58" fill="#D9A441" opacity="0.4" />
      <rect x="72" y="54" width="14" height="18" rx="2" fill="#7A6554" opacity="0.6" />
      <polygon points="79,46 72,54 86,54" fill="#D9A441" opacity="0.5" />
      {/* XP stars collecting */}
      {[[30, 50], [90, 48], [55, 40], [100, 55]].map(([x, y], i) => (
        <motion.text key={i} x={x} y={y} fontSize="8" fill="#D9A441" opacity="0.5"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.4 }}
        >
          ✦
        </motion.text>
      ))}
      {/* Bridges unlocking */}
      <path d="M48,60 Q60,56 72,58" stroke="#94A84D" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Expansion arrows */}
      <path d="M18,65 L10,65 M22,68 L10,68" stroke="#D9A441" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M102,65 L110,65 M98,68 L110,68" stroke="#D9A441" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </g>
  );
}

/* ─── STEP 6 — Full Grown World ─────────────────────────── */
function FullWorld() {
  return (
    <g>
      <ellipse cx="60" cy="78" rx="50" ry="8" fill="rgba(91,70,54,0.04)" />
      {/* Large terrain */}
      <ellipse cx="60" cy="68" rx="44" ry="16" fill="#7BA65B" opacity="0.25" />
      <ellipse cx="60" cy="64" rx="36" ry="13" fill="#94A84D" opacity="0.3" />
      <ellipse cx="60" cy="60" rx="26" ry="10" fill="#5F8C3E" opacity="0.4" />
      {/* Fully grown trees */}
      <rect x="40" y="48" width="3" height="16" rx="1" fill="#5B4636" opacity="0.6" />
      <ellipse cx="41" cy="44" rx="10" ry="14" fill="#7BA65B" opacity="0.5" />
      <ellipse cx="41" cy="38" rx="7" ry="10" fill="#94A84D" opacity="0.45" />
      <rect x="78" y="44" width="4" height="20" rx="1" fill="#5B4636" opacity="0.65" />
      <ellipse cx="80" cy="38" rx="12" ry="16" fill="#7BA65B" opacity="0.55" />
      <ellipse cx="80" cy="32" rx="8" ry="11" fill="#94A84D" opacity="0.5" />
      {/* Flowers blooming */}
      {[[35, 60], [85, 58], [55, 55], [100, 62], [25, 55]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="2.5" fill="#D9A441" opacity="0.45"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {/* Streams */}
      <path d="M30,70 Q40,68 45,70" stroke="#78A6D8" strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M75,70 Q85,68 90,70" stroke="#78A6D8" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Birds */}
      <path d="M50,28 Q53,25 56,28" stroke="rgba(91,70,54,0.3)" strokeWidth="1" fill="none" />
      <path d="M60,24 Q63,21 66,24" stroke="rgba(91,70,54,0.25)" strokeWidth="1" fill="none" />
      {/* Sun */}
      <motion.circle cx="90" cy="24" r="8" fill="#D9A441" opacity="0.25"
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <circle cx="90" cy="24" r="5" fill="#E8C65A" opacity="0.4" />
    </g>
  );
}
