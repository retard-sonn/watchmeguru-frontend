"use client";
import { motion } from "motion/react";

export default function MentorCharacter() {
  return (
    <motion.svg
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Body — owl-like rounded shape */}
      <ellipse cx="80" cy="120" rx="50" ry="55" fill="#78A6D8" />
      <ellipse cx="80" cy="125" rx="38" ry="38" fill="#A8C8E8" />

      {/* Belly pattern — leaf motif */}
      <ellipse cx="80" cy="130" rx="20" ry="16" fill="#FDF9F0" opacity="0.8" />
      <path d="M72,130 Q80,118 88,130 Q80,142 72,130" fill="#7BA65B" opacity="0.5" />

      {/* Eyes */}
      <circle cx="62" cy="105" r="14" fill="#FDF9F0" />
      <circle cx="98" cy="105" r="14" fill="#FDF9F0" />
      <circle cx="65" cy="106" r="7" fill="#3D2E24" />
      <circle cx="95" cy="106" r="7" fill="#3D2E24" />
      <circle cx="67" cy="103" r="2.5" fill="#FDF9F0" />
      <circle cx="97" cy="103" r="2.5" fill="#FDF9F0" />

      {/* Eyebrows — slightly strict */}
      <line x1="48" y1="96" x2="72" y2="98" stroke="#5B4636" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="88" y1="98" x2="112" y2="96" stroke="#5B4636" strokeWidth="2.5" strokeLinecap="round" />

      {/* Beak/mouth — tiny smile */}
      <path d="M75,116 Q80,122 85,116" stroke="#3D2E24" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Ear tufts */}
      <line x1="50" y1="72" x2="42" y2="56" stroke="#78A6D8" strokeWidth="4" strokeLinecap="round" />
      <line x1="110" y1="72" x2="118" y2="56" stroke="#78A6D8" strokeWidth="4" strokeLinecap="round" />

      {/* Tiny wings/arms */}
      <motion.g
        animate={{ rotate: [-2, 3, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "40px 120px" }}
      >
        <ellipse cx="34" cy="122" rx="18" ry="24" fill="#78A6D8" transform="rotate(-15 34 122)" />
      </motion.g>
      <motion.g
        animate={{ rotate: [2, -3, 2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "126px 120px" }}
      >
        <ellipse cx="126" cy="122" rx="18" ry="24" fill="#78A6D8" transform="rotate(15 126 122)" />
      </motion.g>

      {/* Holding a tiny flag */}
      <line x1="38" y1="145" x2="38" y2="100" stroke="#5B4636" strokeWidth="2" />
      <polygon points="38,100 56,106 38,112" fill="#D9A441" />

      {/* Feet */}
      <ellipse cx="68" cy="176" rx="12" ry="6" fill="#D9A441" />
      <ellipse cx="92" cy="176" rx="12" ry="6" fill="#D9A441" />

      {/* Motivation sparkles */}
      {[[30, 80], [130, 75], [150, 100], [15, 110]].map(([x, y], i) => (
        <motion.text
          key={i}
          x={x} y={y}
          fontSize="10"
          fill="#D9A441"
          opacity={0.6}
          animate={{ opacity: [0.6, 0, 0.6], y: [y, y - 8, y] }}
          transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.4 }}
        >
          ✦
        </motion.text>
      ))}

      {/* Shadow */}
      <ellipse cx="80" cy="188" rx="40" ry="8" fill="rgba(91,70,54,0.12)" />
    </motion.svg>
  );
}
