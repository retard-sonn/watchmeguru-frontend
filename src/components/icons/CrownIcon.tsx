"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function CrownIcon({ size = 40, color = "#CE82FF" }: { size?: number; color?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".crown-ray", { rotate: 360, transformOrigin: "24px 24px", duration: 8, repeat: -1, ease: "none" });
      gsap.to(".crown-body", { y: -1, duration: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut" });
      gsap.to(".crown-gem", { scale: 1.1, transformOrigin: "center", duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 0.5 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <g className="crown-ray" opacity="0.3">
        <line x1="24" y1="24" x2="24" y2="4" stroke={color} strokeWidth="1.5" />
        <line x1="24" y1="24" x2="40" y2="12" stroke={color} strokeWidth="1.5" />
        <line x1="24" y1="24" x2="8" y2="12" stroke={color} strokeWidth="1.5" />
      </g>
      <path className="crown-body" d="M10 32L16 18L24 24L32 18L38 32H10Z" fill={color} opacity="0.2" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <rect x="12" y="32" width="24" height="6" rx="2" fill={color} opacity="0.3" />
      <circle className="crown-gem" cx="24" cy="22" r="2" fill={color} />
      <circle cx="16" cy="20" r="1.5" fill={color} opacity="0.6" />
      <circle cx="32" cy="20" r="1.5" fill={color} opacity="0.6" />
    </svg>
  );
}
