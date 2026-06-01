"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function HourGlass({ size = 40, color = "#1CB0F6" }: { size?: number; color?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".sand-top", { y: 4, opacity: 0.3, duration: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut" });
      gsap.to(".sand-bottom", { y: -4, opacity: 1, duration: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 0.75 });
      gsap.to(ref.current, { rotate: 360, duration: 6, repeat: -1, ease: "none" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="14" y="4" width="20" height="8" rx="2" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="36" width="20" height="8" rx="2" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M34 12L24 24L14 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 36L24 24L34 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line className="sand-top" x1="14" y1="14" x2="34" y2="14" stroke={color} strokeWidth="2" opacity="0.5" />
      <line className="sand-bottom" x1="14" y1="32" x2="34" y2="32" stroke={color} strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
