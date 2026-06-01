"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

function useBadgeAnim() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { scale: 0, rotate: -15 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

// Consistency — shield with flame
export function ConsistencyBadge({ size = 48, unlocked = true }: { size?: number; unlocked?: boolean }) {
  const ref = useBadgeAnim();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity: unlocked ? 1 : 0.3, filter: unlocked ? "none" : "grayscale(1)" }}>
      <path d="M24 4L8 12V22C8 32 16 40 24 44C32 40 40 32 40 22V12L24 4Z" fill={unlocked ? "#58CC02" : "#9B8E84"} opacity="0.15" stroke={unlocked ? "#58CC02" : "#9B8E84"} strokeWidth="1.5"/>
      <path d="M24 16 Q28 28 24 34 Q20 28 24 16Z" fill={unlocked ? "#FF7A00" : "#9B8E84"} opacity={unlocked ? 0.8 : 0.5}/>
      <text x="24" y="30" textAnchor="middle" fontSize="7" fontWeight="800" fill={unlocked ? "#FF7A00" : "#9B8E84"} fontFamily="sans-serif">STREAK</text>
    </svg>
  );
}

// Discipline — target with arrow
export function DisciplineBadge({ size = 48, unlocked = true }: { size?: number; unlocked?: boolean }) {
  const ref = useBadgeAnim();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity: unlocked ? 1 : 0.3, filter: unlocked ? "none" : "grayscale(1)" }}>
      <circle cx="24" cy="24" r="20" fill={unlocked ? "#1CB0F6" : "#9B8E84"} opacity="0.1" stroke={unlocked ? "#1CB0F6" : "#9B8E84"} strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="14" fill={unlocked ? "#1CB0F6" : "#9B8E84"} opacity="0.06" stroke={unlocked ? "#1CB0F6" : "#9B8E84"} strokeWidth="1"/>
      <circle cx="24" cy="24" r="8" fill={unlocked ? "#1CB0F6" : "#9B8E84"} opacity="0.08" stroke={unlocked ? "#1CB0F6" : "#9B8E84"} strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="3" fill={unlocked ? "#1CB0F6" : "#9B8E84"}/>
      <path d="M24 4 L27 20 L24 24 L21 20Z" fill={unlocked ? "#1CB0F6" : "#9B8E84"} opacity="0.6"/>
    </svg>
  );
}

// Deep Focus — eye/concentration
export function DeepFocusBadge({ size = 48, unlocked = true }: { size?: number; unlocked?: boolean }) {
  const ref = useBadgeAnim();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity: unlocked ? 1 : 0.3, filter: unlocked ? "none" : "grayscale(1)" }}>
      <rect x="8" y="8" width="32" height="32" rx="8" fill={unlocked ? "#CE82FF" : "#9B8E84"} opacity="0.1" stroke={unlocked ? "#CE82FF" : "#9B8E84"} strokeWidth="1.5"/>
      <ellipse cx="24" cy="22" rx="10" ry="8" fill={unlocked ? "#CE82FF" : "#9B8E84"} opacity="0.15" stroke={unlocked ? "#CE82FF" : "#9B8E84"} strokeWidth="1.5"/>
      <circle cx="24" cy="22" r="4" fill={unlocked ? "#CE82FF" : "#9B8E84"}/>
      <circle cx="22" cy="20" r="1.5" fill="white"/>
      <path d="M20,34 L28,34 L26,38 L22,38Z" fill={unlocked ? "#CE82FF" : "#9B8E84"} opacity="0.4"/>
    </svg>
  );
}

// Night Owl — moon + stars
export function NightOwlBadge({ size = 48, unlocked = true }: { size?: number; unlocked?: boolean }) {
  const ref = useBadgeAnim();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity: unlocked ? 1 : 0.3, filter: unlocked ? "none" : "grayscale(1)" }}>
      <circle cx="24" cy="24" r="20" fill="#1a1a2e" opacity="0.08" stroke={unlocked ? "#78A6D8" : "#9B8E84"} strokeWidth="1.5"/>
      <path d="M30 14 Q24 10 28 22 Q18 20 24 30 Q28 24 30 14Z" fill={unlocked ? "#FFC800" : "#9B8E84"} opacity={unlocked ? 0.9 : 0.5}/>
      <circle cx="14" cy="16" r="1.5" fill={unlocked ? "#FFC800" : "#9B8E84"} opacity={unlocked ? 0.6 : 0.3}/>
      <circle cx="36" cy="28" r="1" fill={unlocked ? "#FFC800" : "#9B8E84"} opacity={unlocked ? 0.4 : 0.2}/>
      <circle cx="10" cy="32" r="1.5" fill={unlocked ? "#FFC800" : "#9B8E84"} opacity={unlocked ? 0.5 : 0.25}/>
    </svg>
  );
}

// Early Bird — sun + rising
export function EarlyBirdBadge({ size = 48, unlocked = true }: { size?: number; unlocked?: boolean }) {
  const ref = useBadgeAnim();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity: unlocked ? 1 : 0.3, filter: unlocked ? "none" : "grayscale(1)" }}>
      <circle cx="24" cy="24" r="20" fill="#FFF8E0" opacity="0.15" stroke={unlocked ? "#D9A441" : "#9B8E84"} strokeWidth="1.5"/>
      <circle cx="24" cy="22" r="8" fill={unlocked ? "#D9A441" : "#9B8E84"} opacity={unlocked ? 0.5 : 0.3}/>
      <path d="M24 14 L25.5 18 L30 18 L26.5 21 L28 25 L24 22.5 L20 25 L21.5 21 L18 18 L22.5 18Z" fill={unlocked ? "#FFC800" : "#9B8E84"} opacity={unlocked ? 0.7 : 0.4}/>
      <path d="M24 28 L24 38" stroke={unlocked ? "#D9A441" : "#9B8E84"} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 36 L28 36" stroke={unlocked ? "#D9A441" : "#9B8E84"} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

export const ACHIEVEMENT_BADGES = {
  consistency: ConsistencyBadge,
  discipline: DisciplineBadge,
  deepFocus: DeepFocusBadge,
  nightOwl: NightOwlBadge,
  earlyBird: EarlyBirdBadge,
} as const;
