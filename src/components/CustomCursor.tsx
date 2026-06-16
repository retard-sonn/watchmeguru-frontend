"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const hoveringRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    // Hide default cursor only on content — NOT on scrollbar or browser chrome
    const style = document.createElement("style");
    style.id = "custom-cursor-hide";
    style.textContent = `body, a, button, input, select, textarea, [role="button"], [data-cursor-hover] { cursor: none !important; }`;
    document.head.appendChild(style);

    // Use requestAnimationFrame for smooth cursor — never freezes on scrollbar
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100, mouseY = -100, targetX = -100, targetY = -100;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onLeave = () => { targetX = -100; targetY = -100; };
    const onEnter = () => {};

    // Track hoverables
    const onHoverEnter = () => { hoveringRef.current = true; };
    const onHoverLeave = () => { hoveringRef.current = false; };
    const scan = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea, [data-cursor-hover]').forEach(el => {
        el.addEventListener("mouseenter", onHoverEnter);
        el.addEventListener("mouseleave", onHoverLeave);
      });
    };

    // RAF loop — independent of React render cycle, never freezes
    function tick() {
      // Lighter damping — feels more responsive during scroll
      const damp = 0.35;
      mouseX += (targetX - mouseX) * damp;
      mouseY += (targetY - mouseY) * damp;
      cursor!.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-2px, -2px)`;
      cursor!.style.opacity = (targetX < 0 && targetY < 0) ? "0" : "1";
      rafRef.current = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    scan();
    const obs = new MutationObserver(scan);
    obs.observe(document.body, { childList: true, subtree: true });
    document.documentElement.style.cursor = "none";

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      obs.disconnect();
      cancelAnimationFrame(rafRef.current);
      document.getElementById("custom-cursor-hide")?.remove();
    };
  }, []);

  const size = 28;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none"
      style={{
        left: 0, top: 0,
        width: size, height: size,
        zIndex: 999999,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
        willChange: "transform",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" style={{ display: "block" }}>
        <path
          fill="#FDF9F0"
          stroke="#58CC02"
          strokeWidth="1.8"
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
        />
      </svg>
    </div>
  );
}
