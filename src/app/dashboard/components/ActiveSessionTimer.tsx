"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { getSubjectIcon } from "@/components/illustrations/SubjectIcons";
import { Sparkles, StopCircle, CheckCircle2, FastForward, X } from "lucide-react";
import InteractiveMascot from "@/components/InteractiveMascot";

interface Props {
  subject: string;
  topic?: string;
  durationSeconds: number;
  startTime: number;
  onEndSession: (elapsedSeconds: number, earnedXP: number) => void;
}

export default function ActiveSessionTimer({ subject, topic, durationSeconds, startTime, onEndSession }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const timeTextRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const holdTween = useRef<gsap.core.Tween | null>(null);
  
  const [elapsed, setElapsed] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const radius = 130;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  
  const remaining = Math.max(0, durationSeconds - elapsed);
  const progress = Math.min(1, elapsed / durationSeconds);
  const isComplete = elapsed >= durationSeconds;
  
  const earnedXP = Math.floor((elapsed / 3600) * 50);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current, 
      { scale: 0.7, opacity: 0, y: 40 }, 
      { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.6)" }
    );
  }, []);

  useEffect(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current, { strokeDashoffset: circumference - (progress * circumference), duration: 1, ease: "linear" });
    }
  }, [progress, circumference]);

  const handleHoldStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isComplete) return;
    if (holdTween.current) holdTween.current.kill();
    holdTween.current = gsap.to(fillRef.current, {
      width: "100%",
      duration: 3,
      ease: "linear",
      onComplete: () => {
        setIsConfirming(true);
        if (navigator.vibrate) navigator.vibrate(200);
        gsap.set(fillRef.current, { width: "0%" });
      }
    });
  }, [isComplete]);

  const handleHoldEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (holdTween.current) {
      holdTween.current.kill();
      holdTween.current = null;
    }
    gsap.to(fillRef.current, { width: "0%", duration: 0.3, ease: "power2.out" });
  }, []);

  const Icon = getSubjectIcon(subject);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex flex-col items-center justify-center py-12 px-6 rounded-[2rem] relative overflow-hidden" 
      style={{ 
        background: "linear-gradient(180deg, #FFFFFF 0%, #F9FFF0 100%)", 
        border: "3px solid #58CC02", 
        boxShadow: "0 16px 40px rgba(88,204,2,0.15), inset 0 -4px 0 rgba(88,204,2,0.1)" 
      }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #58CC02 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between w-full max-w-sm mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(88,204,2,0.12)", border: "2px solid rgba(88,204,2,0.2)" }}>
            <Sparkles size={16} color="#58CC02" />
            <span className="text-[13px] font-extrabold uppercase tracking-widest text-[#58CC02]" style={{ fontFamily: "var(--font-baloo)" }}>Focus Mode</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-bold text-[#9B8E84] uppercase">Earned</span>
            <span className="text-[18px] font-extrabold text-[#D9A441]" style={{ fontFamily: "var(--font-baloo)", lineHeight: 1 }}>+{earnedXP} XP</span>
          </div>
        </div>

        {/* The Massive Focus Ring */}
        <div className="relative flex items-center justify-center mb-10" style={{ width: radius * 2 + strokeWidth, height: radius * 2 + strokeWidth }}>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-xl" style={{ filter: "drop-shadow(0 0 12px rgba(88,204,2,0.3))" }}>
            {/* Background Track */}
            <circle
              cx="50%" cy="50%" r={radius}
              fill="none" stroke="rgba(88,204,2,0.15)" strokeWidth={strokeWidth} strokeLinecap="round"
            />
            {/* Animated Progress Ring */}
            <circle
              ref={ringRef}
              cx="50%" cy="50%" r={radius}
              fill="none" stroke="#58CC02" strokeWidth={strokeWidth} strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              className="transition-all"
            />
          </svg>
          
          {/* Inner Content */}
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="w-16 h-16 flex items-center justify-center mb-1 opacity-80">
              <Icon />
            </div>
            <div 
              ref={timeTextRef} 
              className="text-[56px] font-extrabold tabular-nums tracking-tighter" 
              style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)", lineHeight: 1, textShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              {formatTime(remaining)}
            </div>
            <span className="text-[14px] font-bold text-[#9B8E84] mt-1">Remaining</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center max-w-sm w-full">
          <h2 className="text-[24px] font-extrabold mb-2 capitalize" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>
            {subject} {topic ? `— ${topic}` : ""}
          </h2>
          <p className="text-[15px] font-medium mb-8" style={{ color: "#6B5D52" }}>
            Deep work in progress. Avoid distractions to maximize your XP reward.
          </p>
          
          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            {isComplete ? (
              <button 
                onClick={() => onEndSession(elapsed, earnedXP)}
                className="w-full py-4 rounded-2xl text-[18px] font-extrabold text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform" 
                style={{ background: "#58CC02", boxShadow: "0 6px 0 #46A302", fontFamily: "var(--font-baloo)" }}
              >
                <CheckCircle2 size={22} /> Complete & Review
              </button>
            ) : (
              <button 
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onMouseLeave={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
                className="w-full py-3.5 rounded-2xl text-[15px] font-extrabold flex items-center justify-center gap-2 border-2 relative overflow-hidden select-none" 
                style={{ color: "#FF4B4B", borderColor: "rgba(255,75,75,0.2)", fontFamily: "var(--font-baloo)", background: "#FFF5F5" }}
              >
                <div ref={fillRef} className="absolute left-0 top-0 bottom-0 bg-[#FF4B4B]" style={{ width: "0%", opacity: 0.15 }} />
                <div className="relative z-10 flex items-center gap-2 pointer-events-none">
                  <StopCircle size={18} /> Hold to Wrap Up
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-[2rem] p-6 text-center border-2 shadow-2xl flex flex-col items-center" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
            <InteractiveMascot size={120} initialState="sad" className="mb-4" />
            <h3 className="text-[22px] font-extrabold mb-2" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>Giving up early?</h3>
            <p className="text-[14px] font-medium text-[#6B5D52] mb-6">
              You've earned <span className="font-extrabold text-[#D9A441]">{earnedXP} XP</span> so far. Wrapping up now means you'll miss out on the full reward. Are you sure?
            </p>
            <div className="w-full flex gap-3">
              <button 
                onClick={() => setIsConfirming(false)}
                className="flex-1 py-3 rounded-xl font-extrabold text-[#6B5D52] bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)]"
              >
                Keep Studying
              </button>
              <button 
                onClick={() => { setIsConfirming(false); onEndSession(elapsed, earnedXP); }}
                className="flex-1 py-3 rounded-xl font-extrabold text-white bg-[#FF4B4B] hover:bg-[#FF3333] shadow-[0_4px_0_#D93636]"
              >
                Yes, Wrap Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
