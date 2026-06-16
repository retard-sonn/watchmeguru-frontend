"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import MascotPenguin from "./components/MascotPenguin";
import MagneticButton from "@/components/MagneticButton";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const eliteStyles = `
  @keyframes dashFlow {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }
  .wire-flow {
    animation: dashFlow 0.8s linear infinite;
  }
  .noise-overlay {
    opacity: 0.015;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23111'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }
  .glass-board {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.04),
      0 20px 60px -8px rgba(0, 0, 0, 0.10),
      inset 0 1px 0 rgba(255, 255, 255, 1);
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  .pulse-dot::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: currentColor;
    animation: pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

const WashiTape = ({ color = "rgba(255,255,255,0.45)" }: { color?: string }) => (
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rotate-[-3deg] shadow-sm z-10"
       style={{ backgroundColor: color, clipPath: 'polygon(2% 4%, 98% 0%, 100% 96%, 0% 100%)', backdropFilter: "blur(4px)" }} />
);

// Custom premium SVG icons
const FireStreakIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer flame */}
    <path d="M14 26C8.477 26 4 21.523 4 16C4 9.5 10 3.5 13 1C13.4 3.8 14.2 5.6 16.5 7C18.8 8.4 22 11.2 22 16C22 21.523 19.523 26 14 26Z" fill="white" opacity="0.95"/>
    {/* Inner hot core */}
    <path d="M14 21.5C11.515 21.5 9.5 19.485 9.5 17C9.5 14.8 11.5 12.8 13 11.5C13.5 13 14.2 14.2 15 15C15.8 15.8 16.5 16.2 16.5 17C16.5 19.485 15.485 21.5 14 21.5Z" fill="#EF4444" opacity="0.7"/>
    {/* Sparkle top */}
    <circle cx="18.5" cy="5.5" r="1.5" fill="white" opacity="0.6"/>
    <path d="M18.5 3L18.5 4M21.5 5.5H20.5M20.3 3.2L19.6 3.9" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const LevelUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Star burst / trophy base */}
    <path d="M12 2L14.4 8.26L21 9.27L16.5 13.64L17.76 20.2L12 17L6.24 20.2L7.5 13.64L3 9.27L9.6 8.26L12 2Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
    {/* Inner star glow */}
    <path d="M12 5.5L13.5 9.5L17.8 10.15L14.9 12.98L15.65 17.25L12 15.3L8.35 17.25L9.1 12.98L6.2 10.15L10.5 9.5L12 5.5Z" fill="#3B82F6" opacity="0.4"/>
    {/* Up arrow overlay */}
    <path d="M12 7L12 13M9.5 9.5L12 7L14.5 9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer ring */}
    <circle cx="10" cy="10" r="8.5" stroke="white" strokeWidth="2" opacity="0.9"/>
    {/* Middle ring */}
    <circle cx="10" cy="10" r="5.5" stroke="white" strokeWidth="2" opacity="0.7"/>
    {/* Bullseye */}
    <circle cx="10" cy="10" r="2.5" fill="white"/>
    {/* Crosshair lines */}
    <path d="M10 1V3.5M10 16.5V19M1 10H3.5M16.5 10H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export default function Hero() {
  const { isLoaded, userId } = useAuth();
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const centerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const xpRef = useRef<HTMLDivElement>(null);

  const wireMascotRef = useRef<SVGPathElement>(null);
  const wireTargetRef = useRef<SVGPathElement>(null);
  const wireStreakRef = useRef<SVGPathElement>(null);
  const wireXpRef = useRef<SVGPathElement>(null);

  const [hintVisible, setHintVisible] = useState(true);

  const setBoardX = useRef<any>(null);
  const setBoardY = useRef<any>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!boardRef.current || isMobile) return;
    const xPos = (e.clientX / window.innerWidth - 0.5) * -60; 
    const yPos = (e.clientY / window.innerHeight - 0.5) * -60;
    if (setBoardX.current) setBoardX.current(xPos);
    if (setBoardY.current) setBoardY.current(yPos);
  }, [isMobile]);

  const updateWires = useCallback(() => {
    if (!boardRef.current || isMobile) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const getCenter = (el: HTMLElement | null) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return { x: rect.left - boardRect.left + rect.width / 2, y: rect.top - boardRect.top + rect.height / 2 };
    };
    const c = getCenter(centerRef.current);
    const t = getCenter(targetRef.current);
    const s = getCenter(streakRef.current);
    const x = getCenter(xpRef.current);
    wireTargetRef.current?.setAttribute("d", `M ${c.x} ${c.y} C ${c.x - 140} ${c.y}, ${t.x + 120} ${t.y}, ${t.x} ${t.y}`);
    wireStreakRef.current?.setAttribute("d", `M ${c.x} ${c.y} C ${c.x - 100} ${c.y + 80}, ${s.x + 120} ${s.y}, ${s.x} ${s.y}`);
    wireXpRef.current?.setAttribute("d", `M ${c.x} ${c.y} C ${c.x + 100} ${c.y + 80}, ${x.x - 120} ${x.y}, ${x.x} ${x.y}`);
  }, []);

  useGSAP(() => {
    if (isMobile) {
      gsap.to(".node-wrapper", { scale: 1, opacity: 1, y: 0, duration: 0.5 });
      return;
    }
    
    setBoardX.current = gsap.quickTo(boardRef.current, "x", { duration: 0.9, ease: "power2.out" });
    setBoardY.current = gsap.quickTo(boardRef.current, "y", { duration: 0.9, ease: "power2.out" });
    gsap.ticker.add(updateWires);

    // Initial load animation
    gsap.fromTo(".node-wrapper",
      { scale: 0.5, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "elastic.out(1, 0.6)", delay: 0.2 }
    );
    gsap.fromTo(".board-wire",
      { strokeDasharray: "1200", strokeDashoffset: 1200 },
      { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", delay: 0.9 }
    );

    // Continuous idle floating
    gsap.to(".float-2", { y: "+=16", rotation: -1.8, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 });
    gsap.to(".float-3", { y: "-=11", rotation: -1.2, duration: 3.9, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.7 });
    gsap.to(".float-4", { y: "+=13", rotation: 1.6, duration: 3.3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.0 });

    // --- NEW: Parallax & Scroll-Linked Animation ---
    // This creates the 3D depth effect mentioned by the user
    gsap.utils.toArray(".parallax-layer").forEach((layer: any, i) => {
      const speed = layer.dataset.speed || (i + 1) * 0.15;
      gsap.to(layer, {
        y: () => (ScrollTrigger.maxScroll(window) * speed) + "px",
        rotation: () => i % 2 === 0 ? 15 : -15, // Scroll-linked rotation
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2, // Smooth scroll-linked animation
          invalidateOnRefresh: true
        }
      });
    });

    return () => gsap.ticker.remove(updateWires);
  }, { scope: sectionRef, dependencies: [isMobile] });

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #E8F5E0 0%, #D4EDCA 45%, #E0F0D5 100%)" }}
    >
      <style>{eliteStyles}</style>

      {/* Dot grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#A8C89A 1.5px, transparent 1.5px)", backgroundSize: "38px 38px", opacity: 0.45 }} 
      />
      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(212,237,202,0.6) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none noise-overlay" />

      {/* THE CANVAS BOARD */}
      <div 
        ref={boardRef} 
        className={`relative w-full ${isMobile ? "min-h-[90vh] py-20 px-6 flex-col gap-8" : "h-screen"} shrink-0 flex items-center justify-center select-none`}
        style={{ willChange: "transform", minWidth: isMobile ? "auto" : "1100px", minHeight: isMobile ? "auto" : "750px" }}
      >
        
        {/* SVG Wires (Desktop only) */}
        {!isMobile && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <filter id="wire-glow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <path ref={wireTargetRef} className="board-wire wire-flow" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" opacity="0.75" filter="url(#wire-glow)"/>
          <path ref={wireStreakRef} className="board-wire wire-flow" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" opacity="0.75" filter="url(#wire-glow)"/>
          <path ref={wireXpRef} className="board-wire wire-flow" fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" opacity="0.75" filter="url(#wire-glow)"/>
        </svg>
        )}

        {/* 1. CENTER — Glass CTA Node */}
        <motion.div 
          className={`z-20 ${isMobile ? "relative w-full" : "absolute"}`}
          style={isMobile ? {} : { left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          drag={!isMobile} dragConstraints={boardRef} dragElastic={0.08} dragMomentum={false}
          whileDrag={{ scale: 1.015, zIndex: 50, cursor: "grabbing" }}
        >
          <div ref={centerRef} className={`node-wrapper ${isMobile ? "bg-white/90 border border-white/50 shadow-xl" : "glass-board"} rounded-[2rem] p-8 lg:p-14 ${isMobile ? "" : "cursor-grab active:cursor-grabbing"}`}
               style={{ maxWidth: "580px", width: "100%", margin: "0 auto" }}>
            {/* Port dots */}
            <div className="absolute -left-3 top-[38%] w-6 h-6 bg-[#F59E0B] rounded-full border-4 border-white shadow-lg hidden lg:block" />
            <div className="absolute -right-3 top-[30%] w-6 h-6 bg-[#58CC02] rounded-full border-4 border-white shadow-lg hidden lg:block" />
            <div className="absolute -left-3 bottom-[30%] w-6 h-6 bg-[#EF4444] rounded-full border-4 border-white shadow-lg hidden lg:block" />
            <div className="absolute -right-3 bottom-[22%] w-6 h-6 bg-[#3B82F6] rounded-full border-4 border-white shadow-lg hidden lg:block" />

            <h1 className="font-extrabold leading-[1.05] tracking-tight mb-5 text-center"
                style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(34px, 4.5vw, 60px)", color: "#1A3A0A" }}>
              <span className="block">Study alone.<br />Fail alone.</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58CC02] to-[#2E7A0A]">
                Get a mentor that never forgets.
              </span>
            </h1>
            <p className="text-center text-[16px] lg:text-[18px] font-medium mb-9 leading-relaxed" style={{ color: "#3D6B2E" }}>
              The intelligent study accountability system built by students who failed consistency. Now we help thousands stay on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {isLoaded && !userId ? (
                <MagneticButton href="/sign-up"
                  className="px-10 py-4 rounded-2xl text-[18px] font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg, #58CC02 0%, #2E7A0A 100%)", boxShadow: "0 8px 28px rgba(88,204,2,0.35)", fontFamily: "var(--font-baloo)" }}>
                  Start Free — 2 minutes →
                </MagneticButton>
              ) : isLoaded && userId ? (
                <Link href="/dashboard"
                  className="px-10 py-4 rounded-2xl text-[18px] font-extrabold text-white hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  style={{ background: "linear-gradient(135deg, #58CC02 0%, #2E7A0A 100%)", boxShadow: "0 8px 28px rgba(88,204,2,0.35)", fontFamily: "var(--font-baloo)" }}>
                  Go to Dashboard →
                </Link>
              ) : (
                <div className="h-[60px]" />
              )}
              <a href="#features" className="text-[15px] font-semibold underline-offset-2 hover:underline" style={{ color: "#3D6B2E" }}>
                See how it works
              </a>
            </div>
          </div>
        </motion.div>


          {/* 3. TODAY'S TARGETS — Top Left (pushed further out to not overlap CTA) */}
        <motion.div 
          className={`z-20 ${isMobile ? "relative w-full mt-6" : "absolute"}`}
          style={isMobile ? {} : { left: "calc(50% - 530px)", top: "calc(50% - 200px)" }}
          drag={!isMobile} dragConstraints={boardRef} dragElastic={0.1} dragMomentum={false}
          whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
          onDragStart={() => setHintVisible(false)}
        >
          <div ref={targetRef} className={`node-wrapper ${isMobile ? "" : "float-2 cursor-grab active:cursor-grabbing"} bg-[#FEF08A] p-6 rounded-2xl border border-[#FDE047] mx-auto`}
               style={{ width: "248px", boxShadow: "0 16px 40px -6px rgba(202,138,4,0.25), inset 0 2px 5px rgba(255,255,255,0.55)", transform: isMobile ? "none" : "rotate(-4deg)" }}>
            <WashiTape color="rgba(255,255,255,0.65)" />
            
            {hintVisible && (
              <div className="absolute -top-11 -right-6 bg-[#1A3A0A] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg rotate-12 flex items-center gap-1 pointer-events-none z-50 whitespace-nowrap">
                Drag me! 👋
                <div className="absolute -bottom-1 left-5 w-2 h-2 bg-[#1A3A0A] rotate-45" />
              </div>
            )}

            <div className="flex items-center gap-2 mb-4 mt-2">
              <div className="p-1.5 bg-[#EAB308] rounded-lg shadow-sm">
                <TargetIcon />
              </div>
              <p className="font-extrabold text-[#854D0E] text-[17px]" style={{ fontFamily: "var(--font-baloo)" }}>
                Today's Targets
              </p>
            </div>
            <div className="space-y-2.5 font-semibold text-[#A16207] text-[14px] bg-white/45 p-3 rounded-xl border border-white/50">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#EAB308] flex-shrink-0" />
                Physics — 30 min
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#EAB308] flex-shrink-0" />
                Maths — 45 min
              </div>
              <div className="flex items-center gap-2.5 opacity-60">
                <div className="w-2 h-2 rounded-full bg-[#D97706] flex-shrink-0" />
                Chemistry — 1h
              </div>
            </div>
            <p className="text-[11px] font-bold text-[#A16207]/60 mt-2.5 text-right">Tap to mark done ✓</p>
          </div>
        </motion.div>


        {/* 4. DAY STREAK — Bottom Left */}
        <motion.div 
          className={`z-20 ${isMobile ? "relative w-full mt-6" : "absolute"}`}
          style={isMobile ? {} : { left: "calc(50% - 500px)", top: "calc(50% + 160px)" }}
          drag={!isMobile} dragConstraints={boardRef} dragElastic={0.1} dragMomentum={false}
          whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
        >
          <div ref={streakRef} className={`node-wrapper ${isMobile ? "" : "float-3 cursor-grab active:cursor-grabbing"} bg-[#FDF9F0] p-0 rounded-xl overflow-hidden border-2 border-[#D9A441] mx-auto`}
               style={{ width: "210px", boxShadow: "4px 8px 0px rgba(217,164,65,0.2)", transform: isMobile ? "none" : "rotate(-4deg)" }}>
              {/* Top spiral/calendar binding simulation */}
              <div className="bg-[#D9A441] h-[35px] w-full flex items-center justify-center gap-6 border-b-2 border-[#B8862D] relative shadow-inner">
                 <div className="w-3 h-5 bg-white rounded-full border-2 border-[#B8862D] absolute top-[-10px] shadow-sm" style={{ left: "20%" }} />
                 <div className="w-3 h-5 bg-white rounded-full border-2 border-[#B8862D] absolute top-[-10px] shadow-sm" style={{ left: "46%" }} />
                 <div className="w-3 h-5 bg-white rounded-full border-2 border-[#B8862D] absolute top-[-10px] shadow-sm" style={{ left: "72%" }} />
              </div>

              <div className="p-5 text-center flex flex-col items-center bg-[url('/noise.png')]">
                 <p className="text-[12px] font-extrabold uppercase tracking-widest text-[#B8862D] mb-1">Day Streak</p>
                 <div className="relative">
                   <h3 className="text-[54px] font-extrabold text-[#3D2E24] leading-none mb-3" style={{ fontFamily: "var(--font-baloo)", filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.05))" }}>
                     14
                   </h3>
                   <div className="absolute -top-1 -right-4 text-[24px]">🔥</div>
                 </div>
                 
                 <div className="flex gap-2 mt-2 bg-white/50 p-2 rounded-xl border border-[rgba(0,0,0,0.04)]">
                   {['M','T','W','T','F'].map((day, i) => (
                     <div key={i} className="flex flex-col items-center gap-1.5">
                       <span className="text-[9px] font-bold text-[#9B8E84]">{day}</span>
                       <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" 
                            style={{ background: i === 4 ? "#FF7A00" : "#58CC02", color: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                         {i === 4 ? "🔥" : "✓"}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
          </div>
        </motion.div>


        {/* 5. LEVEL UP / XP — Bottom Right */}
        <motion.div 
          className={`z-20 ${isMobile ? "relative w-full mt-6 mb-12" : "absolute"}`}
          style={isMobile ? {} : { left: "calc(50% + 370px)", top: "calc(50% + 190px)" }}
          drag={!isMobile} dragConstraints={boardRef} dragElastic={0.1} dragMomentum={false}
          whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
        >
          <div ref={xpRef} className={`node-wrapper ${isMobile ? "" : "float-4 cursor-grab active:cursor-grabbing"} bg-[#DBEAFE] p-6 rounded-2xl border border-[#BFDBFE] mx-auto`}
               style={{ width: "252px", boxShadow: "0 16px 40px -6px rgba(37,99,235,0.22), inset 0 2px 5px rgba(255,255,255,0.55)", transform: isMobile ? "none" : "rotate(-2deg)" }}>
            <WashiTape color="rgba(255,255,255,0.65)" />

              <div className="flex items-center gap-2.5 mb-4 mt-2">
                {/* Premium star/level icon */}
                <div className="p-2 bg-gradient-to-br from-[#60A5FA] to-[#2563EB] rounded-xl shadow-md"
                     style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
                  <LevelUpIcon />
                </div>
                <div>
                  <p className="font-extrabold text-[#1E3A8A] text-[17px] leading-none" style={{ fontFamily: "var(--font-baloo)" }}>Level Up!</p>
                  <p className="text-[11px] font-bold text-[#1E40AF] opacity-60 mt-0.5">Rank: Focused</p>
                </div>
              </div>

              {/* XP Bar with percentage */}
              <div className="relative mb-2">
                <div className="w-full h-3.5 bg-white/70 rounded-full overflow-hidden border border-white shadow-inner">
                  <div className="h-full rounded-full relative overflow-hidden" style={{ width: "75%", background: "linear-gradient(90deg, #60A5FA, #3B82F6, #2563EB)" }}>
                    <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", animation: "shimmer 2s linear infinite", backgroundSize: "200% 100%" }} />
                  </div>
                </div>
              <div className="absolute -right-1 -top-1 bg-[#2563EB] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow">75%</div>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="font-bold text-[#1E40AF]">Lv 12</span>
              <span className="font-extrabold text-[#1E3A8A]">750 / 1000 XP</span>
            </div>

              {/* Mini achievement badges */}
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {["⚡ Focus", "🎯 Sharp", "🔥 Hot"].map(badge => (
                  <span key={badge} className="text-[10px] font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded-full">{badge}</span>
                ))}
              </div>
          </div>
        </motion.div>

        {/* Subtle cursor glow */}
        <div className="awwwards-cursor absolute w-8 h-8 rounded-full border-2 border-[#58CC02] pointer-events-none z-[100] hidden lg:block opacity-0" />
      </div>
    </section>
  );
}
 );
}
