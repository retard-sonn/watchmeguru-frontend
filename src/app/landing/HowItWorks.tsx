"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StepIllustration from "@/components/illustrations/StepIllustration";
import Ornament from "@/components/illustrations/Ornament";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "1", t: "Join the world", d: "Share your exam goal, timeline, and weak subjects. Your empty starter island awaits.", step: 1 as const },
  { n: "2", t: "Build your schedule", d: "We generate a daily plan. Roads form. Zones divide. Your terrain becomes organized.", step: 2 as const },
  { n: "3", t: "Upload study proof", d: "Snap a photo or share a link. The verification beacon scans your work.", step: 3 as const },
  { n: "4", t: "Smart verification", d: "The guardian chamber inspects your discipline. The system reads patterns, adjusts intensity.", step: 4 as const },
  { n: "5", t: "Earn streaks & XP", d: "Every verified session grows your streak. Towers rise. XP compounds.", step: 5 as const },
  { n: "6", t: "Grow your world", d: "Trees bloom. Birds appear. Your ecosystem is alive — parents get progress reports.", step: 6 as const },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const vineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
        y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
      });

      // Vine grow animation — scales from top
      const vineInner = vineRef.current?.querySelector("div");
      if (vineInner) {
        gsap.fromTo(vineInner, { scaleY: 0 }, {
          scaleY: 1,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: vineRef.current, start: "top 70%", end: "bottom 20%", scrub: 0.5 },
        });
      }

      // Stagger step reveals
      gsap.from(stepsRef.current?.children || [], {
        scrollTrigger: { trigger: stepsRef.current, start: "top 80%", once: true },
        y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-28 px-6 texture-bg">
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="text-center mb-20">
          <div className="flex justify-center mb-6"><Ornament variant="wave" /></div>
          <h2 className="font-extrabold tracking-tight mb-5" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(32px, 4.5vw, 50px)", color: "var(--earthy)" }}>
            How your <span style={{ color: "var(--moss)" }}>world grows</span>
          </h2>
          <p className="text-[16px] max-w-md mx-auto font-medium" style={{ color: "var(--ink-light)" }}>
            Six steps. From empty island to a thriving study ecosystem.
          </p>
        </div>

        <div className="relative">
          <div ref={vineRef} className="absolute left-8 md:left-[68px] top-4 bottom-4 w-[3px] rounded-full" style={{ background: "rgba(123,166,91,0.1)" }}>
            <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, #FF9E1B, #94A84D)", transformOrigin: "top" }} />
          </div>

          <div ref={stepsRef}>
            {STEPS.map((step, i) => (
              <div key={step.n} className="grid md:grid-cols-[60px_1fr_160px] gap-6 md:gap-10 items-center py-12 relative">
                <div className="hidden md:flex justify-center relative z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-[18px]"
                    style={{ background: "linear-gradient(135deg, #FF9E1B, #5F8C3E)", color: "#F0FDF4", fontFamily: "var(--font-baloo)", boxShadow: "0 6px 20px rgba(123,166,91,0.3)" }}>
                    {step.n}
                  </div>
                </div>
                <div>
                  <div className="md:hidden flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-[16px] flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #FF9E1B, #5F8C3E)", color: "#F0FDF4", fontFamily: "var(--font-baloo)" }}>
                      {step.n}
                    </div>
                  </div>
                  <h3 className="text-[20px] font-bold mb-2 tracking-tight" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>{step.t}</h3>
                  <p className="text-[15px] leading-[1.7] font-medium max-w-lg" style={{ color: "var(--ink-light)" }}>{step.d}</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-36 h-24"><StepIllustration step={step.step} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
