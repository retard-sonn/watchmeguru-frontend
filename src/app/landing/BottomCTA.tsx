"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GuruGuardian from "@/components/illustrations/GuruGuardian";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function BottomCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 85%", once: true },
      });

      gsap.to(mascotRef.current, {
        y: -8, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, #3D2E24 0%, #5B4636 50%, #2B1F18 100%)" }}>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(88,204,2,0.15) 0%, transparent 70%)" }} />

      <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto text-center">
        <div ref={mascotRef} className="flex justify-center mb-8">
          <GuruGuardian size={100} state="active" />
        </div>
        <h2 className="font-extrabold leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(28px, 4.5vw, 48px)", color: "#FDF9F0" }}>
          Ready to <span style={{ color: "#58CC02" }}>level up</span> your study game?
        </h2>
        <p className="text-[16px] mb-10 max-w-md mx-auto font-medium" style={{ color: "rgba(253,249,240,0.55)" }}>
          Join thousands of students who transformed their consistency. Free to start. No credit card.
        </p>
        <Link href="/sign-up"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-[18px] font-extrabold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #58CC02 0%, #46A302 100%)", boxShadow: "0 8px 36px rgba(88,204,2,0.4)", fontFamily: "var(--font-baloo)" }}>
          Start Free Now →
        </Link>
      </div>
    </section>
  );
}
