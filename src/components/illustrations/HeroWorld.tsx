"use client";
import { motion } from "motion/react";

export default function HeroWorld() {
  return (
    <motion.svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ground base — warm earth */}
      <ellipse cx="300" cy="420" rx="260" ry="30" fill="#EBE3C8" />

      {/* Isometric terrain platform */}
      <motion.polygon
        points="300,360 500,390 300,420 100,390"
        fill="#7BA65B"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />
      <polygon points="100,390 300,360 300,420" fill="#5F8C3E" />
      <polygon points="300,360 500,390 300,420" fill="#94A84D" />

      {/* Moss patches */}
      <ellipse cx="240" cy="405" rx="40" ry="8" fill="#94A84D" opacity="0.5" />
      <ellipse cx="380" cy="412" rx="30" ry="6" fill="#7BA65B" opacity="0.4" />

      {/* Study block buildings */}
      <Building x={150} y={340} w={50} h={45} color="#5B4636" />
      <Building x={220} y={325} w={45} h={60} color="#7BA65B" />
      <Building x={280} y={310} w={55} h={75} color="#94A84D" />
      <Building x={350} y={330} w={50} h={55} color="#5B4636" />
      <Building x={410} y={345} w={40} h={40} color="#7A6554" />

      {/* Streak fire on center building */}
      <motion.g
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="307" cy="295" rx="10" ry="14" fill="#D9A441" opacity="0.8" />
        <ellipse cx="307" cy="290" rx="6" ry="10" fill="#E8C65A" opacity="0.9" />
        <ellipse cx="307" cy="287" rx="4" ry="6" fill="#FDF9F0" opacity="0.7" />
      </motion.g>

      {/* XP meter — tree rings on left building */}
      <circle cx="175" cy="315" r="12" fill="none" stroke="#D9A441" strokeWidth="2" opacity="0.7" />
      <circle cx="175" cy="315" r="8" fill="none" stroke="#D9A441" strokeWidth="1.5" opacity="0.5" />
      <circle cx="175" cy="315" r="4" fill="#D9A441" opacity="0.3" />

      {/* Floating trees */}
      <Tree x={120} y={370} />
      <Tree x={480} y={380} />
      <Tree x={440} y={360} />

      {/* AI mentor companion — tiny creature */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="anim-float-slow"
      >
        <ellipse cx="440" cy="310" rx="16" ry="18" fill="#78A6D8" />
        <ellipse cx="440" cy="314" rx="12" ry="8" fill="#A8C8E8" />
        <circle cx="435" cy="308" r="3" fill="#3D2E24" />
        <circle cx="445" cy="308" r="3" fill="#3D2E24" />
        <ellipse cx="440" cy="318" rx="3" ry="1.5" fill="#3D2E24" />
      </motion.g>

      {/* Clouds */}
      <Cloud x={100} y={180} delay={0} />
      <Cloud x={420} y={140} delay={4} />
      <Cloud x={250} y={200} delay={8} />

      {/* Sun — warm */}
      <motion.circle
        cx="80" cy="80" r="35"
        fill="#D9A441"
        opacity="0.3"
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="80" cy="80" r="22" fill="#E8C65A" opacity="0.5" />
      <circle cx="80" cy="80" r="14" fill="#FDF9F0" opacity="0.6" />

      {/* Ground details — little paths */}
      <path d="M200,395 Q260,385 320,398" stroke="#7A6554" strokeWidth="1.5" fill="none" strokeDasharray="4,3" opacity="0.4" />
      <path d="M330,400 Q380,392 430,402" stroke="#7A6554" strokeWidth="1.5" fill="none" strokeDasharray="4,3" opacity="0.4" />

      {/* Floating XP particles */}
      {[[160, 300], [480, 340], [200, 280], [400, 290]].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r="3"
          fill="#D9A441"
          opacity="0.6"
          animate={{ y: [y, y - 20, y], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        />
      ))}
    </motion.svg>
  );
}

function Building({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx="4" fill={color} />
      <rect x={x - w / 2 + 4} y={y - h + 4} width={w - 8} height={8} rx="2" fill="rgba(255,255,255,0.15)" />
      <rect x={x - w / 2 + 4} y={y - 16} width={w - 8} height={6} rx="2" fill="rgba(255,255,255,0.1)" />
    </g>
  );
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 2} y={y - 12} width="4" height="12" rx="1" fill="#5B4636" />
      <ellipse cx={x} cy={y - 16} rx="10" ry="14" fill="#7BA65B" />
      <ellipse cx={x} cy={y - 20} rx="7" ry="10" fill="#94A84D" />
    </g>
  );
}

function Cloud({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.g
      animate={{ x: [x - 15, x + 15, x - 15] }}
      transition={{ duration: 12, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <ellipse cx={x} cy={y} rx="30" ry="14" fill="#FDF9F0" opacity="0.8" />
      <ellipse cx={x + 15} cy={y - 6} rx="20" ry="12" fill="#FDF9F0" opacity="0.8" />
      <ellipse cx={x - 15} cy={y - 4} rx="18" ry="10" fill="#FDF9F0" opacity="0.7" />
    </motion.g>
  );
}
