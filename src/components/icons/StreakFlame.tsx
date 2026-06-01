"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function StreakFlame({ size = 40, color = "#FF4B4B" }: { size?: number; color?: string }) {
  const flameRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".flame-outer", { scale: 1.08, transformOrigin: "center bottom", duration: 0.5, repeat: -1, yoyo: true, ease: "power1.inOut" });
      gsap.to(".flame-inner", { scale: 1.12, transformOrigin: "center bottom", duration: 0.4, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 0.1 });
      gsap.to(".flame-spark", { y: -2, opacity: 0.7, duration: 0.3, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 0.2 });
    }, flameRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={flameRef} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path className="flame-outer" d="M24 4C18 16 14 22 14 30C14 36.6 18.5 42 24 42C29.5 42 34 36.6 34 30C34 22 30 16 24 4Z" fill={color} opacity="0.3" />
      <path className="flame-inner" d="M24 10C20 18 18 24 18 30C18 34.4 20.7 38 24 38C27.3 38 30 34.4 30 30C30 24 28 18 24 10Z" fill={color} opacity="0.7" />
      <path d="M24 16C22 22 21 26 21 30C21 32.8 22.3 35 24 35C25.7 35 27 32.8 27 30C27 26 26 22 24 16Z" fill={color} />
      <circle className="flame-spark" cx="26" cy="12" r="1.5" fill={color} opacity="0.8" />
      <circle cx="22" cy="8" r="1" fill={color} opacity="0.5" />
    </svg>
  );
}
