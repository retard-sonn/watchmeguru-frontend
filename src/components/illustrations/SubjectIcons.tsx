"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

// Unified visual system: 48px viewBox, 1.5px stroke, rounded, mascot-compatible
const STROKE = 1.5;
const RADIUS = 20;

function useFloat() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, { y: -3, duration: 2.5, repeat: -1, yoyo: true, ease: "power1.inOut" });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

function CircleBg({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r={RADIUS} fill={`${color}0A`} />
      {children}
    </svg>
  );
}

export function MathIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#DC2626">
      <g ref={ref}>
        <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="800" fill="#DC2626" fontFamily="serif" fontStyle="italic">∑</text>
      </g>
    </CircleBg>
  );
}

export function PhysicsIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#0F2167">
      <g ref={ref}>
        <circle cx="24" cy="18" r="3" fill="#0F2167" opacity="0.6"/>
        <ellipse cx="24" cy="18" rx="10" ry="4" stroke="#0F2167" strokeWidth={STROKE} fill="none" transform="rotate(-25,24,18)"/>
        <ellipse cx="24" cy="18" rx="10" ry="4" stroke="#0F2167" strokeWidth={STROKE} fill="none" transform="rotate(25,24,18)"/>
        <ellipse cx="24" cy="18" rx="10" ry="4" stroke="#0F2167" strokeWidth={STROKE} fill="none"/>
      </g>
    </CircleBg>
  );
}

export function ChemistryIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#7BA65B">
      <g ref={ref}>
        <rect x="20" y="12" width="8" height="8" rx="2" stroke="#7BA65B" strokeWidth={STROKE} fill="#7BA65B15"/>
        <line x1="24" y1="20" x2="24" y2="24" stroke="#7BA65B" strokeWidth={STROKE} strokeLinecap="round"/>
        <path d="M16 28 L32 28 L34 36 L14 36 Z" fill="#7BA65B15" stroke="#7BA65B" strokeWidth={STROKE} strokeLinejoin="round"/>
        <circle cx="20" cy="33" r="1.5" fill="#58CC02" opacity="0.6"/>
        <circle cx="24" cy="33" r="1.5" fill="#94A84D" opacity="0.5"/>
        <circle cx="28" cy="33" r="1.5" fill="#58CC02" opacity="0.4"/>
      </g>
    </CircleBg>
  );
}

export function BiologyIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#58CC02">
      <g ref={ref}>
        <path d="M24 12 Q32 20 24 28 Q16 20 24 12Z" stroke="#58CC02" strokeWidth={STROKE} fill="none"/>
        <line x1="24" y1="14" x2="24" y2="28" stroke="#58CC02" strokeWidth={STROKE*0.8} opacity="0.4" strokeLinecap="round"/>
        <circle cx="24" cy="18" r="2.5" fill="#58CC02" opacity="0.5"/>
      </g>
    </CircleBg>
  );
}

export function HistoryIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#D9A441">
      <g ref={ref}>
        <path d="M14 14 L36 14 L36 36 L14 36 Z" stroke="#D9A441" strokeWidth={STROKE} fill="#D9A4410A" strokeLinejoin="round"/>
        <line x1="18" y1="20" x2="32" y2="20" stroke="#D9A441" strokeWidth={STROKE*0.8} strokeLinecap="round" opacity="0.5"/>
        <line x1="18" y1="24" x2="28" y2="24" stroke="#D9A441" strokeWidth={STROKE*0.8} strokeLinecap="round" opacity="0.5"/>
        <line x1="18" y1="28" x2="30" y2="28" stroke="#D9A441" strokeWidth={STROKE*0.8} strokeLinecap="round" opacity="0.3"/>
        <rect x="15" y="12" width="18" height="4" rx="1" fill="#D9A441" opacity="0.2"/>
      </g>
    </CircleBg>
  );
}

export function EnglishIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#CE82FF">
      <g ref={ref}>
        <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="#CE82FF" fontFamily="serif">A</text>
        <line x1="16" y1="34" x2="32" y2="34" stroke="#CE82FF" strokeWidth={STROKE} strokeLinecap="round"/>
      </g>
    </CircleBg>
  );
}

export function CompSciIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#0F2167">
      <g ref={ref}>
        <rect x="14" y="14" width="20" height="16" rx="3" stroke="#0F2167" strokeWidth={STROKE} fill="#0F21670A"/>
        <line x1="18" y1="36" x2="30" y2="36" stroke="#0F2167" strokeWidth={STROKE} strokeLinecap="round"/>
        <line x1="20" y1="36" x2="20" y2="38" stroke="#0F2167" strokeWidth={STROKE} strokeLinecap="round"/>
        <line x1="28" y1="36" x2="28" y2="38" stroke="#0F2167" strokeWidth={STROKE} strokeLinecap="round"/>
        <text x="24" y="26" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0F2167" fontFamily="monospace">{'</>'}</text>
      </g>
    </CircleBg>
  );
}

export function GeographyIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#FF7A00">
      <g ref={ref}>
        <circle cx="24" cy="24" r={14} stroke="#FF7A00" strokeWidth={STROKE} fill="#FF7A000A"/>
        <ellipse cx="24" cy="24" rx="7" ry={14} stroke="#FF7A00" strokeWidth={STROKE*0.6} fill="none" opacity="0.3"/>
        <line x1="24" y1="10" x2="24" y2="38" stroke="#FF7A00" strokeWidth={STROKE*0.6} opacity="0.3"/>
      </g>
    </CircleBg>
  );
}

export function EconomicsIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#D9A441">
      <g ref={ref}>
        <path d="M14 20 L24 14 L34 20 L34 32 L24 38 L14 32 Z" stroke="#D9A441" strokeWidth={STROKE} fill="#D9A4410A" strokeLinejoin="round"/>
        <circle cx="24" cy="28" r="4" stroke="#D9A441" strokeWidth={STROKE*0.8} fill="none"/>
        <text x="24" y="32" textAnchor="middle" fontSize="9" fontWeight="900" fill="#D9A441" fontFamily="sans-serif">$</text>
      </g>
    </CircleBg>
  );
}

export function DefaultIcon() {
  const ref = useFloat();
  return (
    <CircleBg color="#58CC02">
      <g ref={ref}>
        <path d="M24 12 L27 18 L33 18 L28 22 L30 28 L24 24 L18 28 L20 22 L15 18 L21 18 Z" fill="#58CC0220" stroke="#58CC02" strokeWidth={STROKE} strokeLinejoin="round"/>
      </g>
    </CircleBg>
  );
}

// Map subject names to icons
const SUBJECT_MAP: Record<string, React.ComponentType> = {
  physics: PhysicsIcon, phys: PhysicsIcon,
  math: MathIcon, maths: MathIcon, mathematics: MathIcon,
  chemistry: ChemistryIcon, chem: ChemistryIcon,
  biology: BiologyIcon, bio: BiologyIcon,
  history: HistoryIcon, hist: HistoryIcon,
  english: EnglishIcon, eng: EnglishIcon,
  geography: GeographyIcon, geo: GeographyIcon,
  economics: EconomicsIcon, econ: EconomicsIcon,
  "computer science": CompSciIcon, cs: CompSciIcon, computer: CompSciIcon,
  revision: DefaultIcon, notes: DefaultIcon, study: DefaultIcon,
};

export function getSubjectIcon(subject: string): React.ComponentType {
  const key = (subject || "").toLowerCase().trim();
  if (SUBJECT_MAP[key]) return SUBJECT_MAP[key];
  for (const [k, v] of Object.entries(SUBJECT_MAP)) {
    if (key.includes(k)) return v;
  }
  return DefaultIcon;
}
