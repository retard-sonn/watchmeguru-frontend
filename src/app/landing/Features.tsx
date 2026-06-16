"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, TreePine, Flame, Trophy, BarChart3, Globe } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { Icon: MessageCircle, title: "WhatsApp Mentor", desc: "Your mentor messages you on WhatsApp. Send photos of your work. Get verified.", color: "#25D366" },
  { Icon: TreePine, title: "Growing Tree", desc: "Every session grows your learning tree. From seed to ancient forest. Visually rewarding.", color: "#58CC02" },
  { Icon: Flame, title: "Streak System", desc: "Build unbreakable study streaks. Rest day shields protect you. Recovery bonuses for comebacks.", color: "#FF7A00" },
  { Icon: Trophy, title: "XP & Levels", desc: "Earn XP for every session. Level up from Seedling to Grandmaster. 7 ranks to conquer.", color: "#58CC02" },
  { Icon: BarChart3, title: "Parent Reports", desc: "Weekly progress reports sent to parents. Strict mode keeps you accountable.", color: "#1CB0F6" },
  { Icon: Globe, title: "Multi-Platform", desc: "WhatsApp, Telegram, Discord, Email. Your mentor reaches you wherever you are.", color: "#CE82FF" },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });

      // Gemini suggestion: stagger card reveals
      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(cards, { y: 60, scale: 0.92, opacity: 0 }, {
          y: 0, scale: 1, opacity: 1,
          duration: 0.7,
          stagger: 0.12, // Cascade effect
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ background: "#E8F5E0" }}>
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(28px, 4vw, 44px)", color: "#1A3A0A" }}>
            Everything you <span style={{ color: "#58CC02" }}>need</span>
          </h2>
          <p className="text-[15px] font-medium max-w-md mx-auto" style={{ color: "#3D6B2E" }}>
            Built for Indian exam warriors. Simple. Effective. Addictive.
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "#F0FDF4", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 8px rgba(0,0,0,0.02)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}12` }}>
                <f.Icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-[16px] font-extrabold mb-1.5" style={{ color: "#1A3A0A", fontFamily: "var(--font-baloo)" }}>{f.title}</h3>
              <p className="text-[13px] leading-relaxed font-medium" style={{ color: "#3D6B2E" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
