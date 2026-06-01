"use client";

import { useEffect, useRef } from "react";

export default function XPParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create 40 soft glowing dots
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < 40; i++) {
      const dot = document.createElement("div");
      const size = 3 + Math.random() * 6;
      const isGreen = Math.random() > 0.5;
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${isGreen ? "rgba(123,166,91,0.3)" : "rgba(217,164,65,0.2)"};
        box-shadow: 0 0 ${size * 3}px ${isGreen ? "rgba(88,204,2,0.3)" : "rgba(255,200,0,0.2)"};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float-particle ${4 + Math.random() * 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
      `;
      container.appendChild(dot);
      dots.push(dot);
    }

    return () => { dots.forEach(d => d.remove()); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px) scale(1.5); opacity: 0.6; }
          50% { transform: translateY(-60px) translateX(-10px) scale(1); opacity: 0.3; }
          75% { transform: translateY(-30px) translateX(-20px) scale(1.3); opacity: 0.5; }
        }
      `}</style>
      <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} />
    </>
  );
}
