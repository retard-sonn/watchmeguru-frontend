"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, Camera, Flame } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const MESSAGES = [
  { from: "mentor", text: "Hey! You planned 4 hours of study today.", delay: 0 },
  { from: "mentor", text: "Current progress: 1h 23m. Physics is next at 6 PM.", delay: 0.5 },
  { from: "mentor", text: "Typing...", delay: 1.2, isTyping: true },
  { from: "student", text: "Starting now!", delay: 1.8 },
  { from: "mentor", text: "Send a photo when done. I'll verify your work.", delay: 2.4 },
  { from: "student", text: "[Photo of handwritten notes uploaded]", delay: 3.0 },
  { from: "mentor", text: "Verified! +40 XP earned. Streak: 14 days.", delay: 3.6 },
  { from: "mentor", text: "Next: Mathematics at 7:30 PM.", delay: 4.0 },
];

export default function WhatsAppDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Phone frame enters
      gsap.fromTo(phoneRef.current, { y: 60, opacity: 0, scale: 0.95 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
      });

      // Messages appear one by one as user scrolls
      msgRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { x: MESSAGES[i].from === "mentor" ? -30 : 30, opacity: 0, scale: 0.9 }, {
          x: 0, opacity: 1, scale: 1,
          duration: 0.5,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ background: "#EBE3C8" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(28px, 4vw, 44px)", color: "#3D2E24" }}>
            Your mentor <span style={{ color: "#25D366" }}>on WhatsApp</span>
          </h2>
          <p className="text-[15px] font-medium max-w-md mx-auto" style={{ color: "#6B5D52" }}>
            Not an app you'll mute. A conversation you'll actually respond to.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Phone mockup */}
          <div ref={phoneRef} className="flex-shrink-0">
            <div className="w-[320px] sm:w-[360px] rounded-[32px] overflow-hidden border-4 border-[#3D2E24] bg-[#0D1418] shadow-2xl">
              {/* Chat header */}
              <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#075E54" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg, #7BA65B, #5F8C3E)" }}>G</div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-white">Guru Mentor</p>
                  <p className="text-[11px] text-[#A5D6A7]">online</p>
                </div>
              </div>
              {/* Messages */}
              <div className="p-3 space-y-2 min-h-[380px]" style={{ background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h60v60H0z\" fill=\"%230D1418\"/%3E%3C/svg%3E')" }}>
                {MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    ref={el => { msgRefs.current[i] = el; }}
                    className={`flex ${msg.from === "mentor" ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed font-medium ${
                      msg.from === "mentor"
                        ? "rounded-tl-sm bg-[#1E2C31] text-[#E9EDEF]"
                        : "rounded-tr-sm bg-[#005C4B] text-[#E9EDEF]"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-[#1E2C31] flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#54656F] anim-pulse" />
                    <div className="w-2 h-2 rounded-full bg-[#54656F] anim-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-[#54656F] anim-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Value props */}
          <div className="flex-1 space-y-6">
            {[
              { Icon: MessageCircle, title: "Messages you can't ignore", desc: "WhatsApp has 98% open rates. Your mentor checks in where you already are." },
              { Icon: Camera, title: "Proof-based verification", desc: "Snap a photo of your work. Mentor verifies. No cheating possible." },
              { Icon: Flame, title: "Streaks that matter", desc: "Every verified session builds your streak. Miss a day — mentor follows up." },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-4 rounded-2xl" style={{ background: "#FDF9F0", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(88,204,2,0.08)" }}>
                  <item.Icon size={20} style={{ color: "#58CC02" }} />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold mb-1" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>{item.title}</h3>
                  <p className="text-[13px] leading-relaxed font-medium" style={{ color: "#6B5D52" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
