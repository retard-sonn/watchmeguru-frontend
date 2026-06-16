"use client";

import React, { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface MascotPenguinProps {
  className?: string;
  state?: "idle" | "eye-track" | "celebrate";
}

export default function MascotPenguin({ className = "", state = "eye-track" }: MascotPenguinProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const bodyWrapRef = useRef<SVGGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);
  const leftFlipperRef = useRef<SVGPathElement>(null);
  const rightFlipperRef = useRef<SVGPathElement>(null);

  const [isAnimating, setIsAnimating] = useState(false);

  const quickXLeft = useRef<gsap.QuickToFunc>(null as any);
  const quickYLeft = useRef<gsap.QuickToFunc>(null as any);
  const quickXRight = useRef<gsap.QuickToFunc>(null as any);
  const quickYRight = useRef<gsap.QuickToFunc>(null as any);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Cross-browser safe SVG origins using gsap.set svgOrigin
    gsap.set(bodyWrapRef.current, { svgOrigin: "100 195" });
    gsap.set(leftFlipperRef.current, { svgOrigin: "30 105" });
    gsap.set(rightFlipperRef.current, { svgOrigin: "170 105" });

    quickXLeft.current = gsap.quickTo(leftPupilRef.current, "x", { duration: 0.15, ease: "power2.out" });
    quickYLeft.current = gsap.quickTo(leftPupilRef.current, "y", { duration: 0.15, ease: "power2.out" });
    quickXRight.current = gsap.quickTo(rightPupilRef.current, "x", { duration: 0.15, ease: "power2.out" });
    quickYRight.current = gsap.quickTo(rightPupilRef.current, "y", { duration: 0.15, ease: "power2.out" });

    // Idle breathing (gentle vertical bounce, NO SCALING to prevent geometry warping)
    gsap.timeline({ repeat: -1, yoyo: true }).to(bodyWrapRef.current, {
      y: -4, duration: 1.8, ease: "sine.inOut",
    });

    if (state === "eye-track") {
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current || isAnimating) return;
        const rect = containerRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        // Restrict eye movement to a tight 6px radius to keep pupils fully inside the sclera
        const mx = Math.max(-6, Math.min(6, dx * 0.015));
        const my = Math.max(-6, Math.min(6, dy * 0.015));
        quickXLeft.current?.(mx);
        quickYLeft.current?.(my);
        quickXRight.current?.(mx);
        quickYRight.current?.(my);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }

    if (state === "celebrate") {
      // Symmetrical happy flap
      gsap.timeline({ repeat: -1 })
        .to(leftFlipperRef.current, { rotation: 35, duration: 0.2, yoyo: true, repeat: 3 }, 0)
        .to(rightFlipperRef.current, { rotation: -35, duration: 0.2, yoyo: true, repeat: 3 }, 0);
    }
  }, { dependencies: [state, isAnimating], scope: containerRef });

  const handleClick = useCallback(() => {
    if (isAnimating || !containerRef.current) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to([bodyWrapRef.current, leftFlipperRef.current, rightFlipperRef.current], {
          x: 0, y: 0, rotation: 0, duration: 0.4, ease: "back.out(1.5)", overwrite: "auto",
        });
        setIsAnimating(false);
      },
    });

    // Cute, symmetrical bounce animation. NO SCALING to prevent fangs/face warping.
    tl.to(bodyWrapRef.current, { y: 6, duration: 0.1, overwrite: "auto" })
      .to(bodyWrapRef.current, { y: -20, duration: 0.2, ease: "power2.out", overwrite: "auto" })
      .to(leftFlipperRef.current, { rotation: 50, duration: 0.15, yoyo: true, repeat: 1 }, 0.1)
      .to(rightFlipperRef.current, { rotation: -50, duration: 0.15, yoyo: true, repeat: 1 }, 0.1)
      .to(bodyWrapRef.current, { y: 0, duration: 0.45, ease: "elastic.out(1, 0.5)", overwrite: "auto" });

  }, [isAnimating]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative mx-auto cursor-pointer group ${className}`}
      style={{ isolation: "isolate", position: "relative", zIndex: 10 }}
      >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        {/* Drop shadow */}
        <ellipse cx="100" cy="195" rx="60" ry="10" fill="rgba(0,0,0,0.15)" />

        <g ref={bodyWrapRef}>
          {/* Symmetrical Feet */}
          <ellipse cx="65" cy="190" rx="18" ry="10" fill="#f5a623" stroke="#000" strokeWidth="3.5" />
          <ellipse cx="135" cy="190" rx="18" ry="10" fill="#f5a623" stroke="#000" strokeWidth="3.5" />

          {/* Symmetrical Left Wing */}
          <path ref={leftFlipperRef} d="M 30 105 C 5 130 5 165 20 175 C 35 185 40 140 35 110 Z" fill="#2b2b2b" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />

          {/* Symmetrical Right Wing */}
          <path ref={rightFlipperRef} d="M 170 105 C 195 130 195 165 180 175 C 165 185 160 140 165 110 Z" fill="#2b2b2b" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />

          {/* Tuft */}
          <path d="M 90 22 L 85 2 L 98 12 L 100 -2 L 102 12 L 115 2 L 110 22 Z" fill="#2b2b2b" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />

          {/* Main Body - Perfectly symmetric stout squircle/egg shape */}
          <path d="M 100 20 C 155 20 185 60 185 125 C 185 185 150 195 100 195 C 50 195 15 185 15 125 C 15 60 45 20 100 20 Z" fill="#2b2b2b" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          
          {/* White Belly */}
          <path d="M 100 50 C 135 50 155 80 155 130 C 155 170 130 185 100 185 C 70 185 45 170 45 130 C 45 80 65 50 100 50 Z" fill="#ffffff" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />

          {/* Symmetrical Eyes */}
          <circle cx="72" cy="75" r="22" fill="#ffffff" stroke="#000" strokeWidth="3.5" />
          <circle cx="128" cy="75" r="22" fill="#ffffff" stroke="#000" strokeWidth="3.5" />

          {/* Left Iris & Pupil */}
          <g ref={leftPupilRef}>
            <circle cx="74" cy="75" r="9" fill="#4da6ff" stroke="#000" strokeWidth="2" />
            <circle cx="76" cy="75" r="4.5" fill="#000" />
            <circle cx="73" cy="72" r="2.5" fill="#fff" />
          </g>

          {/* Right Iris & Pupil */}
          <g ref={rightPupilRef}>
            <circle cx="126" cy="75" r="9" fill="#4da6ff" stroke="#000" strokeWidth="2" />
            <circle cx="124" cy="75" r="4.5" fill="#000" />
            <circle cx="127" cy="72" r="2.5" fill="#fff" />
          </g>

          {/* Symmetrical Eyebrows */}
          <path d="M 52 45 Q 72 35 85 45" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />
          <path d="M 148 45 Q 128 35 115 45" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />

          {/* Beak - Perfectly centered, closed, smiling */}
          <path d="M 85 92 Q 100 85 115 92 L 100 105 Z" fill="#f5a623" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M 85 92 Q 100 100 115 92" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />

          {/* Professor Glasses */}
          <circle cx="72" cy="75" r="26" fill="rgba(255,255,255,0.1)" stroke="#111" strokeWidth="3" />
          <circle cx="128" cy="75" r="26" fill="rgba(255,255,255,0.1)" stroke="#111" strokeWidth="3" />
          <line x1="98" y1="75" x2="102" y2="75" stroke="#111" strokeWidth="3" strokeLinecap="round" />
          <path d="M 46 75 L 30 70" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
          <path d="M 154 75 L 170 70" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
