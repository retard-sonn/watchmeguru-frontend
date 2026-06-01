"use client";
import { motion } from "motion/react";
import GrowthPlant from "@/components/illustrations/GrowthPlant";
import StreakFire from "@/components/illustrations/StreakFire";
import Ornament from "@/components/illustrations/Ornament";

const LEVELS = [
  { tier: "Seedling", xp: "0 – 500", plant: 1, desc: "Just planted. Roots are forming." },
  { tier: "Sprout", xp: "500 – 1,500", plant: 2, desc: "First leaves appear. Gaining strength." },
  { tier: "Sapling", xp: "1,500 – 4,000", plant: 3, desc: "Standing tall. Weathering storms." },
  { tier: "Tree", xp: "4,000 – 8,000", plant: 4, desc: "Full canopy. Producing fruit." },
  { tier: "Forest", xp: "8,000+", plant: 5, desc: "An ecosystem. You are the mentor now." },
];

const STREAK_MILESTONES = [
  { days: 7, label: "One Week", desc: "First roots established" },
  { days: 30, label: "One Month", desc: "Canopy forming" },
  { days: 100, label: "Century", desc: "Ecosystem thriving" },
];

export default function Gamification() {
  return (
    <section id="gamification" className="relative py-28 px-6" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <Ornament variant="dots" />
          </div>
          <h2
            className="font-extrabold tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-baloo)",
              fontSize: "clamp(32px, 4.5vw, 50px)",
              color: "var(--earthy)",
            }}
          >
            Gamified
            <span style={{ color: "var(--mustard)" }}> progression</span>
          </h2>
          <p className="text-[16px] max-w-lg mx-auto font-medium" style={{ color: "var(--ink-light)" }}>
            Your discipline becomes visible. Every streak is a leaf. Every level is new terrain.
          </p>
        </motion.div>

        {/* XP Growth levels */}
        <motion.div
          className="card-terrain p-8 mb-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3
            className="text-center text-[18px] font-bold mb-10"
            style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
          >
            Growth Stages
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {LEVELS.map((level, i) => (
              <motion.div
                key={level.tier}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="w-20 h-24 mb-3">
                  <GrowthPlant stage={level.plant} />
                </div>
                <div
                  className="text-[13px] font-bold mb-1"
                  style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
                >
                  {level.tier}
                </div>
                <div className="text-[11px] font-semibold mb-1" style={{ color: "var(--moss)" }}>
                  {level.xp}
                </div>
                <div className="text-[11px] font-medium leading-tight" style={{ color: "var(--ink-muted)" }}>
                  {level.desc}
                </div>

                {/* Connecting line */}
                {i < LEVELS.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-[2px]" style={{ background: "rgba(123,166,91,0.2)" }} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Streak milestones */}
        <div className="grid md:grid-cols-3 gap-6">
          {STREAK_MILESTONES.map((milestone, i) => (
            <motion.div
              key={milestone.label}
              className="card-earthy p-6 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <div className="w-16 h-16 mb-4">
                <StreakFire streak={milestone.days} />
              </div>
              <div
                className="text-[28px] font-extrabold leading-none mb-1"
                style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
              >
                {milestone.days}
              </div>
              <div
                className="text-[14px] font-bold mb-1"
                style={{ color: "var(--earthy)" }}
              >
                {milestone.label}
              </div>
              <div className="text-[13px] font-medium" style={{ color: "var(--ink-light)" }}>
                {milestone.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
