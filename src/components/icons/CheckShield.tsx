"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function CheckShield({ size = 40, color = "#58CC02" }: { size?: number; color?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".check-path", { strokeDashoffset: 30 }, {
        strokeDashoffset: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
      gsap.to(".shield-bg", { scale: 1.05, transformOrigin: "center", duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path className="shield-bg" d="M24 4L6 12V24C6 34 14 42 24 46C34 42 42 34 42 24V12L24 4Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      <path className="check-path" d="M16 24L21 29L32 18" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" />
    </svg>
  );
}
