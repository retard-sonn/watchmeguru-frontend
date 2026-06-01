"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Ornament from "@/components/illustrations/Ornament";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
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
            WatchMe<span style={{ color: "var(--moss)" }}>Guru</span>
          </span>
          <Ornament variant="dots" />
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
          <Link
            href="/sign-in"
            className="text-[14px] font-semibold px-4 py-2 rounded-[var(--radius-btn)] transition-all duration-200"
            style={{ color: "var(--earthy)", fontFamily: "var(--font-body)" }}
          >
            Log in
          </Link>
          <Link href="/sign-up" className="btn-mustard text-[14px] py-2.5 px-5">
            Start free
          </Link>
        </div>
      </div>
    </nav>
  );
}
