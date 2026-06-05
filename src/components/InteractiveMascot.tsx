"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import GuruMascot from "@/components/illustrations/GuruMascot";

interface InteractiveMascotProps {
  size?: number;
  className?: string;
  initialState?: "idle" | "happy" | "celebrate" | "thinking" | "sleepy" | "sad";
}

export default function InteractiveMascot({ size = 200, className = "", initialState = "idle" }: InteractiveMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyes, setEyes] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const [isJiggling, setIsJiggling] = useState(false);

  // Cursor tracking for eyes and body
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const clampX = Math.max(-1, Math.min(1, dx));
    const clampY = Math.max(-1, Math.min(1, dy));

    // Eye tracking — pupils move within a small radius
    setEyes({
      lx: clampX * 4,
      ly: clampY * 4,
      rx: clampX * 4,
      ry: clampY * 4,
    });

    // Body tilts toward cursor
    gsap.to(el, {
      rotateY: clampX * 15,
      rotateX: -clampY * 10,
      x: clampX * 25,
      y: clampY * 10,
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  // Click: jiggle/dance animation
  const handleClick = useCallback(() => {
    if (isJiggling) return;
    setIsJiggling(true);

    const el = containerRef.current;
    if (!el) return;

    const tl = gsap.timeline({
      onComplete: () => setIsJiggling(false),
    });

    tl.to(el, { scale: 1.08, duration: 0.1, ease: "power2.out" })
      .to(el, { scale: 0.95, duration: 0.1, ease: "power2.in" })
      .to(el, { scale: 1.05, duration: 0.1, ease: "power2.out" })
      .to(el, { scale: 0.97, duration: 0.08, ease: "power2.in" })
      .to(el, { scale: 1.02, duration: 0.08, ease: "power2.out" })
      .to(el, { scale: 1, duration: 0.15, ease: "elastic.out(1, 0.3)" })
      .to(el, { rotateZ: -5, duration: 0.1 })
      .to(el, { rotateZ: 5, duration: 0.1 })
      .to(el, { rotateZ: -3, duration: 0.08 })
      .to(el, { rotateZ: 3, duration: 0.08 })
      .to(el, { rotateZ: 0, duration: 0.2, ease: "elastic.out(1, 0.3)" });
  }, [isJiggling]);

  // Float animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    gsap.to(el, {
      y: -12,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);


  return (
    <div
      ref={containerRef}
      className={`cursor-pointer select-none ${className}`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{ transformStyle: "preserve-3d", perspective: 600, width: size, height: size * 1.1 }}
    >
      <div className="relative">
        {/* Glow behind mascot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: size * 1.3,
            height: size * 1.3,
            background: "radial-gradient(circle, rgba(123,166,91,0.15) 0%, transparent 70%)",
          }} />

        {/* Mascot */}
        <div className="mascot-eyes relative">
          <GuruMascot size={size} state={isJiggling ? "celebrate" : "idle"} />
        </div>

      </div>
    </div>
  );
}
