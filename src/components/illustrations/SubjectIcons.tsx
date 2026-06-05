"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

// Core Visual Language: Duolingo-inspired sticker aesthetic
// - 48x48 viewBox
// - 2.5px to 3px stroke width (thick outlines)
// - Bright primary colors with slightly offset background highlights
// - Bouncy, organic GSAP animations

const STROKE = 2.5;

function useBouncyFloat() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, { y: -4, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

function StickerBg({ color, children }: { color: string; children: React.ReactNode }) {
  // A chunky, offset circle base that gives a 2.5D sticker feel
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="overflow-visible">
      {/* Background shadow/highlight */}
      <circle cx="24" cy="26" r="20" fill={`${color}20`} />
      {/* Main Base */}
      <circle cx="24" cy="24" r="20" fill={`${color}10`} stroke={color} strokeWidth="1" strokeOpacity="0.2" />
      {children}
    </svg>
  );
}

export function ChemistryIcon() {
  const ref = useBouncyFloat();
  const bubbleRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (!bubbleRef.current) return;
    const bubbles = bubbleRef.current.children;
    gsap.to(bubbles, { y: -8, opacity: 0, duration: 1.5, stagger: 0.3, repeat: -1, ease: "power1.in" });
  }, []);
  
  return (
    <StickerBg color="#58CC02">
      <g ref={ref}>
        <path d="M21 14H27V18L33 30C34 32 32 34 29 34H19C16 34 14 32 15 30L21 18V14Z" fill="#FFF" stroke="#58CC02" strokeWidth={STROKE} strokeLinejoin="round"/>
        <path d="M16 28L32 28L30 32C29 33 28 34 24 34C20 34 19 33 18 32L16 28Z" fill="#58CC02" />
        <line x1="22" y1="14" x2="26" y2="14" stroke="#58CC02" strokeWidth={STROKE} strokeLinecap="round" />
        {/* Animated Bubbles */}
        <g ref={bubbleRef}>
          <circle cx="24" cy="24" r="1.5" fill="#58CC02" />
          <circle cx="21" cy="26" r="1" fill="#58CC02" />
          <circle cx="27" cy="25" r="1.5" fill="#58CC02" />
        </g>
      </g>
    </StickerBg>
  );
}

export function PhysicsIcon() {
  const ref = useBouncyFloat();
  const orbitRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (!orbitRef.current) return;
    gsap.to(orbitRef.current, { rotation: 360, transformOrigin: "24px 24px", duration: 8, repeat: -1, ease: "linear" });
  }, []);
  
  return (
    <StickerBg color="#0F2167">
      <g ref={ref}>
        <g ref={orbitRef}>
          <ellipse cx="24" cy="24" rx="14" ry="5" stroke="#0F2167" strokeWidth={STROKE} fill="none" transform="rotate(30, 24, 24)" />
          <ellipse cx="24" cy="24" rx="14" ry="5" stroke="#0F2167" strokeWidth={STROKE} fill="none" transform="rotate(90, 24, 24)" />
          <ellipse cx="24" cy="24" rx="14" ry="5" stroke="#0F2167" strokeWidth={STROKE} fill="none" transform="rotate(150, 24, 24)" />
          {/* Electrons */}
          <circle cx="12" cy="17" r="2.5" fill="#0F2167" />
          <circle cx="36" cy="31" r="2.5" fill="#0F2167" />
        </g>
        {/* Core */}
        <circle cx="24" cy="24" r="4.5" fill="#FFC800" stroke="#0F2167" strokeWidth={STROKE-1} />
      </g>
    </StickerBg>
  );
}

export function MathIcon() {
  const ref = useBouncyFloat();
  return (
    <StickerBg color="#DC2626">
      <g ref={ref}>
        {/* Thick, friendly calculator / geometry set */}
        <rect x="15" y="12" width="18" height="24" rx="4" fill="#FFF" stroke="#DC2626" strokeWidth={STROKE} />
        <rect x="19" y="16" width="10" height="6" rx="2" fill="#DC2626" />
        <circle cx="19" cy="26" r="1.5" fill="#DC2626" />
        <circle cx="24" cy="26" r="1.5" fill="#DC2626" />
        <circle cx="29" cy="26" r="1.5" fill="#DC2626" />
        <circle cx="19" cy="31" r="1.5" fill="#DC2626" />
        <circle cx="24" cy="31" r="1.5" fill="#DC2626" />
        <circle cx="29" cy="31" r="1.5" fill="#DC2626" />
      </g>
    </StickerBg>
  );
}

export function BiologyIcon() {
  const ref = useBouncyFloat();
  const leafRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (!leafRef.current) return;
    gsap.to(leafRef.current, { rotation: 10, transformOrigin: "bottom center", duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);
  
  return (
    <StickerBg color="#7BA65B">
      <g ref={ref}>
        {/* Cute potted plant */}
        <path d="M18 30H30V34C30 35.1 29.1 36 28 36H20C18.9 36 18 35.1 18 34V30Z" fill="#FFF" stroke="#7BA65B" strokeWidth={STROKE} strokeLinejoin="round" />
        <line x1="24" y1="30" x2="24" y2="20" stroke="#7BA65B" strokeWidth={STROKE} strokeLinecap="round" />
        <path ref={leafRef} d="M24 24C24 24 16 22 16 16C22 16 24 24 24 24Z" fill="#7BA65B" />
        <path d="M24 20C24 20 32 18 32 12C26 12 24 20 24 20Z" fill="#58CC02" />
      </g>
    </StickerBg>
  );
}

export function EconomicsIcon() {
  const ref = useBouncyFloat();
  const coinRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (!coinRef.current) return;
    gsap.to(coinRef.current, { y: -6, duration: 0.8, repeat: -1, yoyo: true, ease: "power1.out" });
  }, []);

  return (
    <StickerBg color="#D9A441">
      <g ref={ref}>
        {/* Rising chart */}
        <path d="M14 34L14 26 L22 18 L28 24 L34 16" fill="none" stroke="#D9A441" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="36" x2="36" y2="36" stroke="#D9A441" strokeWidth={STROKE} strokeLinecap="round" />
        {/* Bouncing Coin */}
        <circle ref={coinRef} cx="34" cy="14" r="4" fill="#FFC800" stroke="#D9A441" strokeWidth="1.5" />
      </g>
    </StickerBg>
  );
}

export function GeographyIcon() {
  const ref = useBouncyFloat();
  const globeRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (!globeRef.current) return;
    gsap.to(globeRef.current, { rotation: -360, transformOrigin: "24px 24px", duration: 12, repeat: -1, ease: "linear" });
  }, []);

  return (
    <StickerBg color="#FF7A00">
      <g ref={ref}>
        <circle cx="24" cy="24" r="12" fill="#FFF" stroke="#FF7A00" strokeWidth={STROKE} />
        <g ref={globeRef}>
          <path d="M18 16C20 18 24 16 26 20C28 24 22 26 24 32" fill="none" stroke="#FF7A00" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 18C30 20 34 22 30 26" fill="none" stroke="#FF7A00" strokeWidth={STROKE} strokeLinecap="round" />
        </g>
        <line x1="24" y1="8" x2="24" y2="12" stroke="#FF7A00" strokeWidth={STROKE} strokeLinecap="round" />
        <line x1="24" y1="36" x2="24" y2="40" stroke="#FF7A00" strokeWidth={STROKE} strokeLinecap="round" />
      </g>
    </StickerBg>
  );
}

export function HistoryIcon() {
  const ref = useBouncyFloat();
  return (
    <StickerBg color="#D9A441">
      <g ref={ref}>
        {/* Ancient scroll / pillar */}
        <rect x="16" y="14" width="16" height="20" fill="#FFF" stroke="#D9A441" strokeWidth={STROKE} strokeLinejoin="round" />
        <line x1="12" y1="14" x2="36" y2="14" stroke="#D9A441" strokeWidth={STROKE} strokeLinecap="round" />
        <line x1="12" y1="34" x2="36" y2="34" stroke="#D9A441" strokeWidth={STROKE} strokeLinecap="round" />
        <line x1="20" y1="18" x2="28" y2="18" stroke="#D9A441" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="24" x2="28" y2="24" stroke="#D9A441" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="30" x2="25" y2="30" stroke="#D9A441" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </StickerBg>
  );
}

export function EnglishIcon() {
  const ref = useBouncyFloat();
  const bookRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (!bookRef.current) return;
    gsap.to(bookRef.current, { scaleY: 0.9, transformOrigin: "center bottom", duration: 1.2, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }, []);

  return (
    <StickerBg color="#CE82FF">
      <g ref={ref}>
        <g ref={bookRef}>
          <path d="M24 32C24 32 18 34 14 30V14C18 18 24 16 24 16" fill="#FFF" stroke="#CE82FF" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 32C24 32 30 34 34 30V14C30 18 24 16 24 16" fill="#FFF" stroke="#CE82FF" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
          <line x1="24" y1="16" x2="24" y2="32" stroke="#CE82FF" strokeWidth={STROKE} strokeLinecap="round" />
        </g>
      </g>
    </StickerBg>
  );
}

export function CompSciIcon() {
  const ref = useBouncyFloat();
  return (
    <StickerBg color="#1CB0F6">
      <g ref={ref}>
        {/* Retro Monitor */}
        <rect x="12" y="14" width="24" height="16" rx="2" fill="#FFF" stroke="#1CB0F6" strokeWidth={STROKE} strokeLinejoin="round" />
        <line x1="16" y1="20" x2="20" y2="24" stroke="#1CB0F6" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="28" x2="20" y2="24" stroke="#1CB0F6" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
        <line x1="23" y1="28" x2="28" y2="28" stroke="#1CB0F6" strokeWidth={STROKE} strokeLinecap="round" />
        <path d="M20 30L18 36H30L28 30" fill="none" stroke="#1CB0F6" strokeWidth={STROKE} strokeLinejoin="round" />
        <line x1="16" y1="36" x2="32" y2="36" stroke="#1CB0F6" strokeWidth={STROKE} strokeLinecap="round" />
      </g>
    </StickerBg>
  );
}

export function BusinessIcon() {
  const ref = useBouncyFloat();
  return (
    <StickerBg color="#5B4636">
      <g ref={ref}>
        {/* Briefcase */}
        <rect x="14" y="18" width="20" height="14" rx="2" fill="#FFF" stroke="#5B4636" strokeWidth={STROKE} strokeLinejoin="round" />
        <path d="M20 18V14C20 13 21 12 22 12H26C27 12 28 13 28 14V18" fill="none" stroke="#5B4636" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="22" y="23" width="4" height="4" rx="1" fill="#5B4636" />
        <line x1="14" y1="22" x2="34" y2="22" stroke="#5B4636" strokeWidth="1" opacity="0.3" />
      </g>
    </StickerBg>
  );
}

export function PsychologyIcon() {
  const ref = useBouncyFloat();
  const brainRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (!brainRef.current) return;
    gsap.to(brainRef.current, { scale: 1.05, transformOrigin: "center center", duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }, []);

  return (
    <StickerBg color="#CE82FF">
      <g ref={ref}>
        {/* Brain abstract */}
        <g ref={brainRef}>
          <path d="M24 16C20 16 16 19 16 23C16 25 17 27 19 28C18 31 20 34 24 34C28 34 30 31 29 28C31 27 32 25 32 23C32 19 28 16 24 16Z" fill="#FFF" stroke="#CE82FF" strokeWidth={STROKE} strokeLinejoin="round" />
          <path d="M24 16V34" fill="none" stroke="#CE82FF" strokeWidth={STROKE} strokeLinecap="round" />
          <path d="M20 20Q22 22 24 20" fill="none" stroke="#CE82FF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M28 24Q26 26 24 24" fill="none" stroke="#CE82FF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </StickerBg>
  );
}

export function SociologyIcon() {
  const ref = useBouncyFloat();
  return (
    <StickerBg color="#FFC800">
      <g ref={ref}>
        {/* Two abstract figures interacting */}
        <circle cx="19" cy="18" r="4" fill="#FFF" stroke="#FFC800" strokeWidth={STROKE} />
        <path d="M14 34C14 29 16 27 19 27C21.5 27 23 29 24 31" fill="none" stroke="#FFC800" strokeWidth={STROKE} strokeLinecap="round" />
        
        <circle cx="29" cy="22" r="3.5" fill="#FFC800" />
        <path d="M24 34C24 30 26 29 29 29C32 29 34 31 34 34" fill="none" stroke="#FFC800" strokeWidth={STROKE} strokeLinecap="round" />
      </g>
    </StickerBg>
  );
}

export function FlashcardIcon() {
  const ref = useBouncyFloat();
  const cardRef = useRef<SVGRectElement>(null);
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotationY: 180, transformOrigin: "center center", duration: 2, repeat: -1, ease: "power2.inOut", repeatDelay: 1 });
  }, []);

  return (
    <StickerBg color="#FFC800">
      <g ref={ref}>
        {/* Back card */}
        <rect x="18" y="14" width="16" height="20" rx="3" fill="#FFF" stroke="#FFC800" strokeWidth={STROKE} opacity="0.6" transform="rotate(12, 26, 24)" />
        {/* Front card */}
        <rect ref={cardRef} x="14" y="14" width="16" height="20" rx="3" fill="#FFF" stroke="#FFC800" strokeWidth={STROKE} transform="rotate(-6, 22, 24)" />
      </g>
    </StickerBg>
  );
}

export function PyqIcon() {
  const ref = useBouncyFloat();
  return (
    <StickerBg color="#78A6D8">
      <g ref={ref}>
        <path d="M16 12 L30 12 L34 16 L34 34 C34 35 33 36 32 36 L16 36 C15 36 14 35 14 34 L14 14 C14 13 15 12 16 12 Z" fill="#FFF" stroke="#78A6D8" strokeWidth={STROKE} strokeLinejoin="round"/>
        <path d="M30 12 V16 H34" fill="none" stroke="#78A6D8" strokeWidth={STROKE} strokeLinejoin="round"/>
        <text x="24" y="27" textAnchor="middle" fontSize="12" fontWeight="900" fill="#78A6D8" fontFamily="sans-serif">?</text>
        <line x1="18" y1="31" x2="30" y2="31" stroke="#78A6D8" strokeWidth={STROKE} strokeLinecap="round" />
      </g>
    </StickerBg>
  );
}

export function DefaultIcon() {
  const ref = useBouncyFloat();
  return (
    <StickerBg color="#58CC02">
      <g ref={ref}>
        <path d="M24 14 L28 20 L34 20 L29 25 L31 32 L24 27 L17 32 L19 25 L14 20 L20 20 Z" fill="#FFF" stroke="#58CC02" strokeWidth={STROKE} strokeLinejoin="round"/>
      </g>
    </StickerBg>
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
  business: BusinessIcon, "business studies": BusinessIcon,
  psychology: PsychologyIcon, psych: PsychologyIcon,
  sociology: SociologyIcon, socio: SociologyIcon,
  flashcard: FlashcardIcon, flashcards: FlashcardIcon,
  pyq: PyqIcon, "previous year": PyqIcon, "past paper": PyqIcon, "past papers": PyqIcon, "questions": PyqIcon,
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
