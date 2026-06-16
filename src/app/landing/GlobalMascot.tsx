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

      gsap.to(floatRef.current, {
        y: 25,
        rotation: 4,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            let nextState: "eye-track" | "celebrate" | "idle" = "eye-track";

            if (p > 0.85) nextState = "celebrate";
            else if (p > 0.60 && p < 0.75) nextState = "celebrate";
            else if (p > 0.25 && p < 0.40) nextState = "celebrate";
            
            if (lastState.current !== nextState) {
              lastState.current = nextState;
              setMascotState(nextState);
            }
          }
        }
      });

      tl.to(mascotRef.current, {
        x: () => window.innerWidth * -0.65,
        y: () => window.innerHeight * 0.05,
        rotation: -15,
        duration: 1,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.25,
        y: () => window.innerHeight * 0.15,
        rotation: 10,
        scale: 1.15,
        duration: 1,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.60,
        y: () => window.innerHeight * 0.25,
        rotation: -20,
        scale: 0.9,
        duration: 1,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.30,
        y: () => window.innerHeight * 0.35,
        rotation: 360,
        scale: 1.1,
        duration: 1.5,
        ease: "sine.inOut"
      })
      .to(mascotRef.current, {
        x: () => window.innerWidth * -0.45,
        y: () => window.innerHeight * 0.50,
        rotation: 720,
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
      
      <div ref={floatRef} className="relative w-72 h-72">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#58CC02] rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <MascotPenguin className="w-full h-full" state={mascotState} />
      </div>
    </div>
  );
}