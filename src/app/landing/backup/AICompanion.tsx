"use client";
import { motion } from "motion/react";
import GuruGuardian from "@/components/illustrations/GuruGuardian";
import Badge from "@/components/illustrations/Badge";
import Ornament from "@/components/illustrations/Ornament";

const TRAITS = [
  { label: "Strict but Supportive", desc: "Deadlines are real. But disappointment is never the goal." },
  { label: "Ruthlessly Consistent", desc: "No reminders. No second chances. Checks in every single day." },
  { label: "Emotionally Intelligent", desc: "Detects burnout. Adjusts pace. Knows when to push and when to rest." },
];

const BADGES = [
  { icon: "★", label: "7 Days", earned: true },
  { icon: "✦", label: "30 Days", earned: true },
  { icon: "▲", label: "Top 10%", earned: true },
  { icon: "●", label: "100 XP", earned: true },
  { icon: "◆", label: "Perfection", earned: false },
  { icon: "♣", label: "Marathon", earned: false },
];

export default function AICompanion() {
  return (
    <section id="ai-mentor" className="relative py-28 px-6 texture-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <Ornament variant="zigzag" />
          </div>
          <h2
            className="font-extrabold tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-baloo)",
              fontSize: "clamp(32px, 4.5vw, 50px)",
              color: "var(--earthy)",
            }}
          >
            Meet your
            <span style={{ color: "var(--sky)" }}> study companion</span>
          </h2>
          <p className="text-[16px] max-w-lg mx-auto font-medium" style={{ color: "var(--ink-light)" }}>
            Not a chatbot. A tiny accountability creature that lives inside your study world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-48">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 220, height: 220,
                  background: "radial-gradient(circle, rgba(120,166,216,0.15) 0%, transparent 70%)",
                }}
              />
              <div className="anim-float-slow" style={{ animationDuration: "5s" }}>
                <GuruGuardian size={180} state="idle" />
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {TRAITS.map((trait, i) => (
              <motion.div
                key={trait.label}
                className="card-earthy p-5 flex gap-4"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(120,166,216,0.12)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L10 6L14 7L11 10L12 14L8 12L4 14L5 10L2 7L6 6L8 2Z" fill="#78A6D8" />
                  </svg>
                </div>
                <div>
                  <h4
                    className="text-[16px] font-bold mb-1"
                    style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
                  >
                    {trait.label}
                  </h4>
                  <p className="text-[14px] leading-relaxed font-medium" style={{ color: "var(--ink-light)" }}>
                    {trait.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-20 card-terrain p-8"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3
            className="text-center text-[18px] font-bold mb-10"
            style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
          >
            Unlockable Badges
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
            {BADGES.map((badge, i) => (
              <Badge key={badge.label} icon={badge.icon} label={badge.label} earned={badge.earned} delayed={i * 0.08} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
