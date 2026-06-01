"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveMascot from "@/components/InteractiveMascot";
import MagneticButton from "@/components/MagneticButton";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Simulated real-time WhatsApp notifications
const NOTIFICATIONS = [
  { text: "Mentor: You studied 0 mins today. Let's fix that.", delay: 0.5 },
  { text: "Today's target: Physics 30 min + Maths 45 min", delay: 2.0 },
  { text: "Streak saved. 14 days and counting.", delay: 3.5 },
  { text: "New achievement: Consistency Beast unlocked!", delay: 5.0 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (mascotRef.current) {
      const rect = mascotRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
      gsap.to(mascotRef.current, { rotateY: x * 12, rotateX: -y * 8, x: x * 20, y: y * 8, duration: 0.5, ease: "power2.out" });
    }
  }, []);

  useEffect(() => {
    // Multi-layer organic particles
    const container = particlesRef.current;
    if (container) {
      for (let i = 0; i < 60; i++) {
        const dot = document.createElement("div");
        const size = 2 + Math.random() * 6;
        const isGreen = Math.random() > 0.5;
        dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${isGreen?"rgba(123,166,91,0.35)":"rgba(217,164,65,0.25)"};box-shadow:0 0 ${size*4}px ${isGreen?"rgba(88,204,2,0.35)":"rgba(255,200,0,0.25)"};left:${Math.random()*100}%;top:${Math.random()*100}%;pointer-events:none;`;
        container.appendChild(dot);
        gsap.to(dot, {
          y: gsap.utils.random(-100, -20), x: gsap.utils.random(-40, 40),
          rotation: gsap.utils.random(-360, 360), opacity: gsap.utils.random(0.15, 0.5),
          scale: gsap.utils.random(0.4, 1.6),
          duration: gsap.utils.random(4, 9), repeat: -1, yoyo: true, ease: "sine.inOut", delay: gsap.utils.random(0, 4),
        });
      }
    }

    const ctx = gsap.context(() => {
      // Mascot float
      gsap.to(mascotRef.current, { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: "power1.inOut" });

      // SplitText: character-level stagger reveal
      gsap.fromTo(".split-char", {
        y: 80, opacity: 0, rotation: 15,
      }, {
        y: 0, opacity: 1, rotation: 0,
        duration: 0.7,
        stagger: 0.03,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      // Live notifications — appear one by one like real WhatsApp
      const notifs = notifRef.current?.children;
      if (notifs) {
        gsap.fromTo(notifs, { x: -60, opacity: 0, scale: 0.9 }, {
          x: 0, opacity: 1, scale: 1,
          duration: 0.5, stagger: 1.5, ease: "back.out(1.4)", delay: 1.5,
        });
      }

      // CTA
      gsap.fromTo(".hero-cta-wrap", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, delay: 0.8, ease: "back.out(2)" });

      // Parallax particles on scroll
      gsap.to(container?.children || [], {
        y: "-=40", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-[120px] pb-12 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F4EEDB 0%, #EBE3C8 40%, #F4EEDB 100%)" }}>

      {/* Multi-layer background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(123,166,91,0.08) 0%, transparent 70%)" }} />
        <div className="absolute top-[50%] right-[5%] w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(217,164,65,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[10%] left-[40%] w-72 h-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(120,166,216,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* Organic particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-center">
          {/* Left: Text + CTA + Notifications */}
          <div className="text-center lg:text-left">
            <div ref={mascotRef} className="mb-6 flex lg:hidden justify-center" style={{ transformStyle: "preserve-3d", perspective: 500 }}>
              <InteractiveMascot size={180} />
            </div>

            <h1 className="font-extrabold leading-[1.06] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(34px, 5.5vw, 60px)" }}>
              <div className="mb-1">
                {"Study alone.".split("").map((c, i) => (
                  <span key={i} className="split-char inline-block" style={{ color: "#3D2E24" }}>{c === " " ? " " : c}</span>
                ))}
              </div>
              <div className="mb-1">
                {"Fail alone.".split("").map((c, i) => (
                  <span key={i} className="split-char inline-block" style={{ color: "#6B5D52" }}>{c === " " ? " " : c}</span>
                ))}
              </div>
              <div>
                {"Get a mentor that never forgets.".split("").map((c, i) => (
                  <span key={i} className="split-char inline-block" style={{ color: "#58CC02" }}>{c === " " ? " " : c}</span>
                ))}
              </div>
            </h1>

            <p className="text-[15px] sm:text-[17px] leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 font-medium" style={{ color: "#6B5D52" }}>
              Built by students who struggled with consistency too. Now we help thousands stay on track.
            </p>

            <div className="hero-cta-wrap mb-8 flex justify-center lg:justify-start">
              <MagneticButton href="/sign-up"
                className="px-10 py-4 rounded-2xl text-[18px] font-extrabold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #58CC02 0%, #46A302 100%)", boxShadow: "0 8px 36px rgba(88,204,2,0.4)", fontFamily: "var(--font-baloo)" }}>
                Start Free — 2 minutes →
              </MagneticButton>
            </div>

            {/* Live WhatsApp notifications — the "holy shit" moment */}
            <div ref={notifRef} className="space-y-2 max-w-sm mx-auto lg:mx-0">
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium"
                  style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.04)", backdropFilter: "blur(8px)" }}>
                  <span style={{ color: "#3D2E24" }}>{n.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mascot — large on desktop */}
          <div ref={mascotRef} className="hidden lg:flex justify-center" style={{ transformStyle: "preserve-3d", perspective: 500 }}>
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: 240, height: 240, background: "radial-gradient(circle, rgba(123,166,91,0.12) 0%, transparent 70%)" }} />
              <InteractiveMascot size={320} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
