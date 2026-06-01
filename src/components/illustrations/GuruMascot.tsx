"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

type State = "idle" | "happy" | "celebrate" | "thinking" | "sleepy";
interface Props { size?: number; state?: State; animated?: boolean; }

export default function GuruMascot({ size = 180, state = "idle", animated = true }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const s = size / 100;

  useEffect(() => {
    if (!animated || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, { y: -4, duration: 2.5, repeat: -1, yoyo: true, ease: "power1.inOut" });
      gsap.to(".cap-tassel", { rotation: 10, transformOrigin: "50px 22px", duration: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut" });
      if (state === "celebrate") {
        gsap.to(ref.current, { rotation: -4, duration: 0.2, repeat: 7, yoyo: true, ease: "power1.inOut" });
        gsap.to(".sparkles", { scale: 1.4, opacity: 1, duration: 0.4, repeat: 10, yoyo: true, ease: "power1.inOut" });
      }
    }, ref);
    return () => ctx.revert();
  }, [animated, state]);

  // Mouth shape per state
  const mouth = state === "happy" ? "M48,74 Q58,82 68,74" : state === "sleepy" ? "M50,76 Q58,72 66,76" : "M50,74 Q58,78 66,74";

  return (
    <svg ref={ref} width={100 * s} height={110 * s} viewBox="0 0 100 110" fill="none" style={{ overflow: "visible" }}>
      <ellipse cx="50" cy="106" rx="22" ry="3.5" fill="rgba(61,46,36,0.06)" />

      {/* Body — rounded pear shape */}
      <path d="M28,45 Q15,60 18,82 Q20,98 50,102 Q80,98 82,82 Q85,60 72,45 Z" fill="#F5E6D3" />
      <path d="M35,60 Q30,75 33,88 Q35,96 50,98 Q65,96 67,88 Q70,75 65,60 Z" fill="#E8D5BC" opacity="0.5" />

      {/* Feet */}
      <ellipse cx="38" cy="101" rx="10" ry="5" fill="#D9A441" />
      <ellipse cx="62" cy="101" rx="10" ry="5" fill="#D9A441" />

      {/* Wings */}
      <ellipse cx="16" cy="68" rx="10" ry="16" fill="#E8D5BC" transform="rotate(-20,16,68)" />
      <ellipse cx="84" cy="68" rx="10" ry="16" fill="#E8D5BC" transform="rotate(20,84,68)" />

      {/* Head */}
      <circle cx="50" cy="40" r="26" fill="#F5E6D3" />

      {/* Ears */}
      <path d="M30,28 L34,14 L40,26" fill="#E8D5BC" />
      <path d="M70,28 L66,14 L60,26" fill="#E8D5BC" />

      {/* Cap */}
      <rect x="32" y="6" width="36" height="6" rx="2" fill="#3D2E24" />
      <polygon points="36,0 64,0 50,8" fill="#3D2E24" />
      <line className="cap-tassel" x1="50" y1="6" x2="60" y2="16" stroke="#D9A441" strokeWidth="1.5" />
      <circle cx="61" cy="17" r="2" fill="#D9A441" />

      {/* Eyes — always open, clean, expressive */}
      <ellipse cx="38" cy="40" rx="10" ry="10.5" fill="white" />
      <ellipse cx="62" cy="40" rx="10" ry="10.5" fill="white" />
      <ellipse cx="38" cy="40" rx="6.5" ry="7.5" fill="#7BA65B" />
      <ellipse cx="62" cy="40" rx="6.5" ry="7.5" fill="#7BA65B" />
      <ellipse cx="38" cy="40" rx="4" ry="5" fill="#3D2E24" />
      <ellipse cx="62" cy="40" rx="4" ry="5" fill="#3D2E24" />
      <circle cx="35" cy="37" r="2.5" fill="white" />
      <circle cx="59" cy="37" r="2.5" fill="white" />

      {/* Eyebrows */}
      <path d="M30,42 Q36,40 42,42" stroke="#3D2E24" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M58,42 Q64,40 70,42" stroke="#3D2E24" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Beak */}
      <path d="M46,48 L50,54 L54,48 Z" fill="#D9A441" />

      {/* Mouth */}
      <path d={mouth} stroke="#3D2E24" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="30" cy="52" r="4.5" fill="#F0C8C0" opacity="0.5" />
      <circle cx="70" cy="52" r="4.5" fill="#F0C8C0" opacity="0.5" />

      {/* Sparkles (celebrate only) */}
      {state === "celebrate" && <g className="sparkles" opacity="0.7">
        <path d="M80,20 l1.5,-4.5 4.5,-1.5 -4.5,-1.5 -1.5,-4.5 -1.5,4.5 -4.5,1.5 4.5,1.5 z" fill="#D9A441" />
        <path d="M18,15 l1,-3 3,-1 -3,-1 -1,-3 -1,3 -3,1 3,1 z" fill="#58CC02" />
      </g>}
    </svg>
  );
}

export type { State as MascotState };
