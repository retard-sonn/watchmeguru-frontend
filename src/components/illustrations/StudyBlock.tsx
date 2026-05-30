"use client";
import { motion } from "framer-motion";

interface Props {
  steps: number;
  activeStep: number;
  delay?: number;
}

export default function StudyBlock({ steps = 3, activeStep = 1, delay = 0 }: Props) {
  const blockW = 50;
  const blockH = 18;
  const gap = 6;

  return (
    <motion.svg
      viewBox={`0 0 ${steps * (blockW + gap) + 10} ${blockH + 20}`}
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {Array.from({ length: steps }).map((_, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + i * 0.15 }}
        >
          {/* Block shadow */}
          <rect
            x={i * (blockW + gap) + 2} y={blockH - 8}
            width={blockW} height="10" rx="3"
            fill="rgba(91,70,54,0.1)"
          />
          {/* Block body */}
          <rect
            x={i * (blockW + gap)} y={6}
            width={blockW} height={blockH} rx="4"
            fill={i < activeStep ? "#7BA65B" : "#EBE3C8"}
            stroke={i < activeStep ? "#5F8C3E" : "rgba(91,70,54,0.1)"}
            strokeWidth="1.5"
          />
          {/* Block top highlight */}
          <rect
            x={i * (blockW + gap) + 4} y={10}
            width={blockW - 8} height="4" rx="2"
            fill={i < activeStep ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.4)"}
          />
          {/* Check mark for completed */}
          {i < activeStep && (
            <motion.path
              d={`M${i * (blockW + gap) + 14},${6 + blockH / 2} L${i * (blockW + gap) + 18},${6 + blockH / 2 + 4} L${i * (blockW + gap) + 24},${6 + blockH / 2 - 4}`}
              stroke="#FDF9F0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + i * 0.15 + 0.3, duration: 0.4 }}
            />
          )}
        </motion.g>
      ))}

      {/* Progress connector */}
      {activeStep > 1 && (
        <motion.line
          x1={blockW / 2} y1={blockH + 2}
          x2={(activeStep - 1) * (blockW + gap) + blockW / 2} y2={blockH + 2}
          stroke="#7BA65B" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.5, duration: 0.8 }}
        />
      )}

      {/* Step numbers */}
      {Array.from({ length: steps }).map((_, i) => (
        <text
          key={`n${i}`}
          x={i * (blockW + gap) + blockW / 2}
          y={6 + blockH / 2 + 1}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill={i < activeStep ? "#FDF9F0" : "rgba(91,70,54,0.3)"}
          fontFamily="var(--font-baloo)"
        >
          {i + 1}
        </text>
      ))}
    </motion.svg>
  );
}
