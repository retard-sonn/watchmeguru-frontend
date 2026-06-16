"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { fireConfetti } from "@/lib/confetti";
import { useRouter } from "next/navigation";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function MagneticButton({ children, href, className, style, onClick }: MagneticButtonProps) {    
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const router = useRouter();

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (!boundsRef.current) boundsRef.current = el.getBoundingClientRect();
      const bounds = boundsRef.current;
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;
      const dist = Math.sqrt(x * x + y * y);
      const maxDist = bounds.width;
      if (dist < maxDist) {
        const power = (1 - dist / maxDist) * 1.5;
        gsap.to(el, { x: x * power * 0.3, y: y * power * 0.3, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
      }
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      boundsRef.current = null;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    fireConfetti();

    // Add a tiny springy 3D push effect
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    }

    if (onClick) {
      onClick();
    } else if (href) {
      e.preventDefault();
      setTimeout(() => {
        router.push(href);
      }, 150); // slight delay so we can see the confetti pop
    }
  };

  return (
    <button ref={btnRef as any} onClick={handleClick} className={className} style={{ display: "inline-flex", cursor: "pointer", ...style }}>
      {children}
    </button>
  );
}
