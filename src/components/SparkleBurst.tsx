"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// Pre-calculate random values for animation to keep components pure


interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const COLORS = ["#58CC02", "#FFC800", "#1CB0F6", "#CE82FF", "#58CC02", "#FF7A00"];

let id = 0;

export function useSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const burst = useCallback((x: number, y: number, count = 8) => {
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: ++id,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        color: COLORS[i % COLORS.length],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    setSparkles(prev => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.includes(s)));
    }, 1000);
  }, []);

  const SparkleOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[9998]" style={{ width: 0, height: 0 }}>
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: s.x, top: s.y,
              width: s.size, height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}80`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
              x: Math.random() === 0 ? 30 : -30,
              y: Math.random() === 0 ? -40 : -10,
              rotate: s.rotation + 90,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return { burst, SparkleOverlay };
}

export default function SparkleBurst({ x, y, count = 8 }: { x: number; y: number; count?: number }) {
  const sparkles: Sparkle[] = [];
  for (let i = 0; i < count; i++) {
    sparkles.push({
      id: i,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      color: COLORS[i % COLORS.length],
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
    });
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" style={{ width: 0, height: 0 }}>
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.x, top: s.y,
            width: s.size, height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}80`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            x: Math.random() === 0 ? 30 : -30,
            y: Math.random() === 0 ? -40 : -10,
            rotate: s.rotation + 90,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
