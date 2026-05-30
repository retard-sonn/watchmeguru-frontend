"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import StepIllustration from "@/components/illustrations/StepIllustration";
import Ornament from "@/components/illustrations/Ornament";

const STEPS = [
  {
    n: "1",
    t: "Join the world",
    d: "Share your exam goal, timeline, and weak subjects. Your empty starter island awaits — the journey begins with a single campfire.",
    step: 1 as const,
  },
  {
    n: "2",
    t: "Build your schedule",
    d: "AI generates a daily plan. Roads form. Zones divide. Your terrain becomes an organized grid — structured but alive.",
    step: 2 as const,
  },
  {
    n: "3",
    t: "Upload study proof",
    d: "Snap a photo or share a link. The verification beacon scans your work. Proof transforms effort into visible progression.",
    step: 3 as const,
  },
  {
    n: "4",
    t: "AI verifies your work",
    d: "The guardian chamber inspects your discipline. No cheating. The AI reads patterns, detects gaps, adjusts intensity.",
    step: 4 as const,
  },
  {
    n: "5",
    t: "Earn streaks & XP",
    d: "Every verified session grows your streak. Towers rise. Bridges unlock. XP compounds. Your realm visibly expands.",
    step: 5 as const,
  },
  {
    n: "6",
    t: "Grow your world",
    d: "Trees bloom. Flowers open. Birds appear. Your ecosystem is alive — and your parents get progress reports from it all.",
    step: 6 as const,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-28 px-6 texture-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <Ornament variant="wave" />
          </div>
          <h2
            className="font-extrabold tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-baloo)",
              fontSize: "clamp(32px, 4.5vw, 50px)",
              color: "var(--earthy)",
            }}
          >
            How your
            <span style={{ color: "var(--moss)" }}> world grows</span>
          </h2>
          <p className="text-[16px] max-w-md mx-auto font-medium" style={{ color: "var(--ink-light)" }}>
            Six steps. From empty island to a thriving study ecosystem.
          </p>
        </motion.div>

        <div className="relative">
          {/* Organic vine spine — left side */}
          <div className="absolute left-8 md:left-[68px] top-4 bottom-4 w-[3px] rounded-full"
            style={{ background: "rgba(123,166,91,0.1)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(to bottom, #7BA65B, #94A84D)", transformOrigin: "top" }}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              className="grid md:grid-cols-[60px_1fr_160px] gap-6 md:gap-10 items-center py-12 relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              {/* Step number dot on vine */}
              <div className="hidden md:flex justify-center relative z-10">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-[18px]"
                  style={{
                    background: "linear-gradient(135deg, #7BA65B, #5F8C3E)",
                    color: "#FDF9F0",
                    fontFamily: "var(--font-baloo)",
                    boxShadow: "0 6px 20px rgba(123,166,91,0.3)",
                  }}
                >
                  {step.n}
                </div>
              </div>

              {/* Text content */}
              <div>
                <div className="md:hidden flex items-center gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-[16px] flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #7BA65B, #5F8C3E)",
                      color: "#FDF9F0",
                      fontFamily: "var(--font-baloo)",
                    }}
                  >
                    {step.n}
                  </div>
                </div>
                <h3
                  className="text-[20px] font-bold mb-2 tracking-tight"
                  style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
                >
                  {step.t}
                </h3>
                <p className="text-[15px] leading-[1.7] font-medium max-w-lg" style={{ color: "var(--ink-light)" }}>
                  {step.d}
                </p>
              </div>

              {/* Right: biome illustration */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2, duration: 0.6, type: "spring" }}
              >
                <div className="w-36 h-24">
                  <StepIllustration step={step.step} />
                </div>
              </motion.div>

              {/* Organic leaf on vine */}
              <div className="hidden md:block absolute left-[56px] top-1/2 -translate-y-1/2">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, type: "spring" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="anim-leaf">
                    <ellipse cx="6" cy="6" rx="5" ry="3.5" fill="#94A84D" opacity="0.4" transform="rotate(-30 6 6)" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
