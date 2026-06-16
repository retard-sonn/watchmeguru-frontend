"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

type State = "idle" | "happy" | "celebrate" | "thinking" | "sleepy" | "sad";
interface Props { size?: number; state?: State; animated?: boolean; lx?: number; ly?: number; rx?: number; ry?: number; }

export default function GuruMascot({ size = 180, state = "idle", animated = true, lx = 0, ly = 0, rx = 0, ry = 0 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const bodyWrapRef = useRef<SVGGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);
  const leftFlipperRef = useRef<SVGPathElement>(null);
  const rightFlipperRef = useRef<SVGPathElement>(null);
  const s = size / 200; // Native SVG viewBox is 200x200

  useEffect(() => {
    if (!animated || !ref.current) return;
    const ctx = gsap.context(() => {
      // Cross-browser safe SVG origins
      gsap.set(leftFlipperRef.current, { svgOrigin: "30 105" });
      gsap.set(rightFlipperRef.current, { svgOrigin: "170 105" });
      gsap.set(bodyWrapRef.current, { svgOrigin: "100 195" });

      // Gentle float
      gsap.to(ref.current, { y: -5, duration: 2.8, repeat: -1, yoyo: true, ease: "power1.inOut" });

      if (state === "celebrate") {
        gsap.to(leftFlipperRef.current, { rotation: 35, duration: 0.2, yoyo: true, repeat: 7 });
        gsap.to(rightFlipperRef.current, { rotation: -35, duration: 0.2, yoyo: true, repeat: 7 });
        gsap.to(".guru-sparkles", { scale: 1.5, opacity: 1, duration: 0.35, repeat: 10, yoyo: true, ease: "power1.inOut" });
      }
      if (state === "sad") {
        gsap.to(".guru-teardrop", { y: 10, opacity: 0, duration: 1.2, stagger: 0.4, repeat: -1, ease: "power1.in" });
      }
      if (state === "thinking") {
        gsap.to(".guru-think-dot", { opacity: 0, duration: 0.5, stagger: 0.2, repeat: -1, yoyo: true });
        gsap.to(rightFlipperRef.current, { rotation: -60, duration: 0.5 }); // Hand to chin
      }
      if (state === "happy") {
        gsap.to(leftFlipperRef.current, { rotation: 20, duration: 0.5, yoyo: true, repeat: -1 });
        gsap.to(rightFlipperRef.current, { rotation: -20, duration: 0.5, yoyo: true, repeat: -1 });
      }
    }, ref);
    return () => ctx.revert();
  }, [animated, state]);

  // Eye tracking update
  useEffect(() => {
    if (leftPupilRef.current && rightPupilRef.current && state !== "sleepy") {
      gsap.to(leftPupilRef.current, { x: lx * 1.5, y: ly * 1.5, duration: 0.1, ease: "power2.out" });
      gsap.to(rightPupilRef.current, { x: rx * 1.5, y: ry * 1.5, duration: 0.1, ease: "power2.out" });
    }
  }, [lx, ly, rx, ry, state]);

  return (
    <svg
      ref={ref}
      width={200 * s}
      height={200 * s}
      viewBox="0 0 200 200"
      fill="none"
      style={{ overflow: "visible" }}
    >
      {/* Shadow */}
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

        {/* Sleepy state - closed eyes */}
        {state === "sleepy" && (
          <>
            <path d="M 55 75 Q 72 85 89 75" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 111 75 Q 128 85 145 75" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* Normal Eyes */}
        {state !== "sleepy" && (
          <>
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
          </>
        )}

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

        {/* ── TEARDROPS (sad) ── */}
        {state === "sad" && (
          <g className="guru-teardrop">
            <circle cx="72" cy="105" r="3" fill="#78C8F0" />
            <circle cx="128" cy="105" r="3" fill="#78C8F0" />
          </g>
        )}

        {/* ── THINKING DOTS ── */}
        {state === "thinking" && (
          <g className="guru-think-dots">
            <circle className="guru-think-dot" cx="130" cy="30" r="2.5" fill="#FFC107" />
            <circle className="guru-think-dot" cx="145" cy="20" r="3.5" fill="#FFC107" />
            <circle className="guru-think-dot" cx="165" cy="12" r="5" fill="#FFC107" />
          </g>
        )}

        {/* ── SPARKLES (celebrate) ── */}
        {state === "celebrate" && (
          <g className="guru-sparkles" opacity="0.8">
            <path d="M160,30 l2,-6 2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 z" fill="#FFC107" />
            <path d="M30,50 l1.5,-4 1.5,4 4,1.5 -4,1.5 -1.5,4 -1.5,-4 -4,-1.5 z" fill="#4da6ff" />
            <circle cx="170" cy="50" r="2" fill="#4da6ff" opacity="0.7" />
            <circle cx="20" cy="40" r="1.5" fill="#FFC107" opacity="0.7" />
          </g>
        )}
      </g>
    </svg>
  );
}

export type { State as MascotState };
