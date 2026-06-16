"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MascotPenguin from "@/app/landing/components/MascotPenguin";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function GlobalMascot() {
  const mascotRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const lastState = useRef<"idle" | "eye-track" | "celebrate">("eye-track");
  const [mascotState, setMascotState] = useState<"idle" | "eye-track" | "celebrate">("eye-track");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!mascotRef.current || !floatRef.current) return;

      // 1. Continuous idle float (Applied to inner wrapper so it doesn't fight the scroll timeline)
      gsap.to(floatRef.current, {
        y: 25,
        rotation: 4,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // 2. Global Scroll Journey (Scrollytelling) applied to outer wrapper
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Tighter scrub for more responsive feel
          invalidateOnRefresh: true, // Recalculates viewport values on resize
          onUpdate: (self) => {
            const p = self.progress;
            let nextState: "eye-track" | "celebrate" | "idle" = "eye-track";
            
            // Map states to scroll progress to trigger jumping/swinging animations
            if (p > 0.85) nextState = "celebrate"; // Bottom CTA
            else if (p > 0.60 && p < 0.75) nextState = "celebrate"; // Transformation section
            else if (p > 0.25 && p < 0.40) nextState = "celebrate"; // LearningTree section
            
            if (lastState.current !== nextState) {
              lastState.current = nextState;
              setMascotState(nextState);
            }
          }
        }
      });

      // Breakpoints for the journey using dynamic functional values
      // Start: Hero (top right) -> x: 0, y: 0

      tl.to(mascotRef.current, {
        x: () => window.innerWidth * -0.65, // Move to left side for InAppDemo
        y: () => window.innerHeight * 0.05, // Small downward move
        rotation: -15,
        duration: 1,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.25, // Swoop right for LearningTree
        y: () => window.innerHeight * 0.15,
        rotation: 10,
        scale: 1.15,
        duration: 1,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.60, // Swoop left for StreakEngine/Features
        y: () => window.innerHeight * 0.25,
        rotation: -20,
        scale: 0.9,
        duration: 1,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.30, // Center for Transformation
        y: () => window.innerHeight * 0.35,
        rotation: 360, // Does a full flip!
        scale: 1.1,
        duration: 1.5,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.45, // Center for final CTA
        y: () => window.innerHeight * 0.50, // Max travel 50vh + starting 15vh = 65vh (leaves 35vh for 288px penguin, keeps it on screen!)
        rotation: 720, // Does another full flip to land!
        scale: 1.25,
        duration: 1.5,
        ease: "back.out(1.2)"
      });

    });
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={mascotRef} 
      className="fixed pointer-events-none hidden lg:block"
      style={{ top: "15%", right: "15%", willChange: "transform", zIndex: 9999 }}
    >
      {/* Inner wrapper separates continuous float from scroll timeline */}
      <div ref={floatRef} className="relative w-72 h-72">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#58CC02] rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <MascotPenguin className="w-full h-full" state={mascotState} />
      </div>
    </div>
  );
}