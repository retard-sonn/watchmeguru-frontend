"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import { playSound } from "@/lib/sound";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const CustomMentorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 29C23.1797 29 29 23.1797 29 16C29 8.8203 23.1797 3 16 3C8.8203 3 3 8.8203 3 16C3 23.1797 8.8203 29 16 29Z" fill="#FDF9F0" />
    <path d="M9 15C9 15 11 11 16 11C21 11 23 15 23 15" stroke="#1A3A0A" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="11.5" cy="18.5" r="2.5" fill="#1A3A0A" />
    <circle cx="20.5" cy="18.5" r="2.5" fill="#1A3A0A" />
    <path d="M16 24L13 20H19L16 24Z" fill="#D9A441" />
  </svg>
);

const CustomProofIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="24" height="16" rx="4" fill="#FDF9F0" stroke="#1A3A0A" strokeWidth="2" />
    <circle cx="16" cy="16" r="4.5" fill="#1A3A0A" />
    <path d="M21 11L25 9L29 13" stroke="#58CC02" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 24V28H19V24" stroke="#1A3A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CustomStreakIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3C16 3 10 9 10 16C10 21.5228 12.6863 26 16 28C19.3137 26 22 21.5228 22 16C22 9 16 3 16 3Z" fill="#FDF9F0" stroke="#1A3A0A" strokeWidth="2" />
    <path d="M16 12C16 12 13 15.5 13 19C13 21.2091 14.3431 23 16 24C17.6569 23 19 21.2091 19 19C19 15.5 16 12 16 12Z" fill="#FF7A00" />
    <circle cx="9" cy="8" r="1.5" fill="#D9A441" />
    <circle cx="24" cy="13" r="2" fill="#58CC02" />
    <circle cx="21" cy="6" r="1" fill="#FF7A00" />
  </svg>
);

export default function InAppDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [animState, setAnimState] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const runSequence = () => {
      setAnimState(0);
      timeout = setTimeout(() => {
        setAnimState(1);
        timeout = setTimeout(() => {
          setAnimState(2);
          timeout = setTimeout(() => {
            setAnimState(3);
            timeout = setTimeout(() => {
              setAnimState(4);
              playSound("pop");
              timeout = setTimeout(() => {
                setAnimState(5);
                timeout = setTimeout(() => {
                  runSequence();
                }, 4000);
              }, 1000);
            }, 800);
          }, 1500);
        }, 800);
      }, 1000);
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(phoneRef.current, { y: 60, opacity: 0, scale: 0.95 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { 
          trigger: sectionRef.current, 
          start: "top 70%", 
          once: true,
          onEnter: runSequence
        },
      });
    }, sectionRef);
    
    return () => {
      ctx.revert();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="smart-mentor" ref={sectionRef} className="py-24 px-6" style={{ background: "#D4EDCA" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(28px, 4vw, 44px)", color: "#1A3A0A" }}>
            Your mentor,<br />
            <span style={{ color: "#58CC02" }}>inside the app</span>
          </h2>
          <p className="text-[15px] font-medium max-w-md mx-auto" style={{ color: "#3D6B2E" }}>
            Experience an interactive dashboard that verifies your work and gamifies your consistency.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div ref={phoneRef} className="flex-shrink-0 relative">
            <div className="w-[320px] sm:w-[350px] h-[680px] rounded-[48px] overflow-hidden border-[10px] border-[#1A3A0A] bg-[#FDF9F0] shadow-2xl relative flex flex-col">

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1A3A0A] rounded-b-[18px] z-50" />

              <div className="pt-12 px-5 pb-4 flex justify-between items-center z-10">
                <div className="flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-full bg-[#D9A441] border-[3px] border-white shadow-sm flex items-center justify-center text-white font-bold text-[14px]">ME</div>
                   <div>
                     <p className="text-[10px] font-bold text-[#9B8E84] uppercase">Welcome Back</p>
                     <p className="text-[15px] font-extrabold text-[#3D2E24] leading-tight" style={{ fontFamily: "var(--font-baloo)" }}>Exam Warrior</p>
                   </div>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border shadow-sm flex items-center gap-1.5 transition-transform"
                     style={{ borderColor: "rgba(0,0,0,0.05)", transform: animState >= 4 ? "scale(1.1)" : "scale(1)" }}>
                   <span className="text-[15px]">🔥</span>
                   <span className="text-[14px] font-bold text-[#FF7A00]">14</span>
                </div>
              </div>

              <div className="flex-1 px-5 relative z-10 flex flex-col">
                
                <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.03)] flex flex-col items-center relative mt-2">
                  <div className="absolute -top-4 bg-[#58CC02] text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-sm uppercase border-2 border-white">Focus Rank</div>
                  
                  <motion.div 
                    className="text-[72px] mb-2 mt-4" 
                    style={{ filter: "drop-shadow(0 12px 12px rgba(0,0,0,0.12))" }}
                    animate={{ y: animState >= 4 ? -10 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    🐧
                  </motion.div>

                  <div className="w-full mt-3">
                     <div className="flex justify-between text-[12px] font-bold mb-1.5">
                       <span className="text-[#6B5D52]">Level 12</span>
                       <span className="text-[#7BA65B]">{animState >= 4 ? "790" : "750"} / 1000 XP</span>
                     </div>
                     <div className="w-full h-3 rounded-full bg-[#F4EEDB] overflow-hidden">
                       <motion.div 
                         className="h-full rounded-full bg-gradient-to-r from-[#58CC02] to-[#7BA65B]" 
                         initial={{ width: "75%" }}
                         animate={{ width: animState >= 4 ? "79%" : "75%" }}
                         transition={{ duration: 0.8, ease: "easeOut" }}
                       />
                     </div>
                  </div>
                </div>

                <div className="mt-8 flex-1">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-[18px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>Today's Missions</h3>
                     <span className="text-[12px] font-bold text-[#9B8E84] bg-black/5 px-2 py-1 rounded-md">{animState >= 4 ? "1 Left" : "2 Left"}</span>
                   </div>

                   <div className="space-y-3 relative">
                     
                     <motion.div 
                       className="bg-white p-4 rounded-2xl border-2 shadow-sm flex items-center gap-3 relative overflow-hidden transition-colors"
                       animate={{ 
                         borderColor: animState >= 4 ? "rgba(88,204,2,0.4)" : "rgba(0,0,0,0.04)",
                         backgroundColor: animState >= 4 ? "#F0FDF4" : "#FFFFFF"
                       }}
                     >
                        <div className="w-12 h-12 rounded-xl bg-[#E8F0FE] text-[#0F2167] flex items-center justify-center text-[22px]">💎</div>
                        <div className="flex-1">
                           <p className="text-[15px] font-bold text-[#3D2E24]" style={{ textDecoration: animState >= 4 ? "line-through" : "none", opacity: animState >= 4 ? 0.6 : 1 }}>Physics</p>
                           <p className="text-[12px] font-medium text-[#6B5D52]">09:00 AM • 2h block</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${animState >= 4 ? "border-[#58CC02] bg-[#58CC02] text-white" : "border-[#E5E7EB]"}`}>
                          {animState >= 4 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                     </motion.div>

                     <div className="bg-white p-4 rounded-2xl border-2 border-[rgba(0,0,0,0.04)] shadow-sm flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FDEEED] text-[#DC2626] flex items-center justify-center text-[22px]">🔢</div>
                        <div className="flex-1">
                           <p className="text-[15px] font-bold text-[#3D2E24]">Mathematics</p>
                           <p className="text-[12px] font-medium text-[#6B5D52]">11:30 AM • 1.5h block</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center" />
                     </div>

                     <AnimatePresence>
                       {(animState === 2 || animState === 3) && (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.9, y: 20 }}
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95, y: -10 }}
                           className="absolute -top-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20 flex flex-col items-center text-center"
                         >
                           <div className="w-12 h-12 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[24px] mb-3">📸</div>
                           <h4 className="text-[16px] font-bold text-[#3D2E24] mb-1" style={{ fontFamily: "var(--font-baloo)" }}>Verify Session</h4>
                           <p className="text-[12px] text-[#6B5D52] mb-4">Snap a photo of your Physics notes to earn XP.</p>
                           <button className={`w-full py-3 rounded-xl text-white font-bold text-[14px] transition-colors ${animState === 3 ? "bg-[#46A302]" : "bg-[#58CC02]"}`}>
                             Take Photo
                           </button>
                         </motion.div>
                       )}
                     </AnimatePresence>

                     <AnimatePresence>
                       {animState === 4 && (
                         <motion.div 
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0 }}
                           className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#3D2E24] text-white px-4 py-2 rounded-full text-[13px] font-bold flex items-center gap-2 whitespace-nowrap shadow-lg z-30"
                         >
                           <span className="text-[#58CC02]">✓</span> Verified! +40 XP
                         </motion.div>
                       )}
                     </AnimatePresence>

                   </div>
                </div>
              </div>

              <div className="h-[76px] bg-white border-t border-[rgba(0,0,0,0.06)] flex items-center justify-around px-6 z-10 rounded-b-[38px] pb-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-[#58CC02] relative">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z"/></svg>
                  <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#58CC02]" />
                </div>
                <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-[#9B8E84]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="3" ry="3"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="21" x2="10" y2="10"/></svg>
                </div>
                <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-[#9B8E84]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
              </div>

              <AnimatePresence>
                {animState > 0 && animState < 5 && (
                  <motion.div
                    className="absolute z-50 pointer-events-none"
                    initial={{ top: "80%", left: "50%", opacity: 0 }}
                    animate={{
                      top: animState === 1 ? "62%" : animState === 2 ? "62%" : animState === 3 ? "48%" : "80%",
                      left: animState === 1 ? "80%" : animState === 2 ? "80%" : animState === 3 ? "50%" : "50%",
                      opacity: animState >= 1 && animState <= 3 ? 1 : 0,
                      scale: animState === 1 || animState === 3 ? 0.8 : 1
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}>
                      <path d="M10.0366 21.0428L4.69741 11.2333L16.2735 15.6565L12.4418 16.3262L10.0366 21.0428Z" fill="white" />
                      <path d="M10.0366 21.0428L4.69741 11.2333L16.2735 15.6565L12.4418 16.3262L10.0366 21.0428Z" stroke="#1A3A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {[
              { icon: <CustomMentorIcon />, title: "Direct App Mentorship", desc: "Your smart mentor checks in proactively. Not just an app you mute, but a companion that keeps you accountable." },
              { icon: <CustomProofIcon />, title: "Proof-based verification", desc: "Snap a photo of your work directly in the app. The mentor verifies. No cheating possible." },
              { icon: <CustomStreakIcon />, title: "Streaks that matter", desc: "Every verified session builds your streak. Miss a day — your mentor follows up to get you back on track." },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-5 rounded-2xl transition-transform hover:scale-[1.02]" style={{ background: "#F0FDF4", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 12px rgba(88,204,2,0.05)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #58CC02, #2E7A0A)", boxShadow: "0 4px 12px rgba(88,204,2,0.3)" }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold mb-1.5" style={{ color: "#1A3A0A", fontFamily: "var(--font-baloo)" }}>{item.title}</h3>
                  <p className="text-[14px] leading-relaxed font-medium" style={{ color: "#3D6B2E" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
