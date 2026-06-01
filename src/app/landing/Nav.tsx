"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Ornament from "@/components/illustrations/Ornament";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-parchment/90 backdrop-blur-xl shadow-[0_1px_0_rgba(91,70,54,0.08)]"
        : ""
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[22px] font-extrabold tracking-tight" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
            WatchMe<span style={{ color: "var(--moss)" }}>Guru</span><span className="text-[12px] font-medium ml-0.5" style={{ color: "var(--ink-muted)" }}>.io</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Dashboard", "Smart Mentor"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-[14px] font-semibold transition-colors duration-150"
              style={{ color: "var(--ink-light)", fontFamily: "var(--font-body)" }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden sm:inline-flex btn-earthy text-[14px] py-2.5 px-5">Log in</Link>
          <Link href="/sign-up" className="hidden sm:inline-flex btn-mustard text-[14px] py-2.5 px-5">Start free</Link>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden flex flex-col gap-1.5 p-2">
            <div className="w-5 h-0.5 rounded-full" style={{ background: "var(--earthy)" }} />
            <div className="w-5 h-0.5 rounded-full" style={{ background: "var(--earthy)" }} />
            <div className="w-5 h-0.5 rounded-full" style={{ background: "var(--earthy)" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-6 pb-6 space-y-3 bg-parchment/95 backdrop-blur-xl">
          {["Features","How it works","Dashboard","Smart Mentor"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`} onClick={() => setMenuOpen(false)}
              className="block text-[15px] font-semibold py-2" style={{ color: "var(--earthy)" }}>{item}</a>
          ))}
          <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="btn-earthy text-[14px] py-2.5 px-5 w-full text-center block">Log in</Link>
          <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="btn-mustard text-[14px] py-2.5 px-5 w-full text-center block">Start free</Link>
        </div>
      )}
    </nav>
  );
}
