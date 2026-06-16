"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";
import Ornament from "@/components/illustrations/Ornament";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Nav() {
  const { isLoaded, userId } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-2 md:pt-4 ${
      scrolled
        ? "bg-parchment/90 backdrop-blur-xl shadow-[0_1px_0_rgba(26,58,10,0.08)] pb-2 md:pb-4"
        : "pb-2 md:pb-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[80px] md:min-h-[88px] flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0 mr-4">
          <img src="/watchmeguru.png" alt="WatchMeGuru" className="h-14 sm:h-16 md:h-20 w-auto object-contain" />
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {["Features", "How it works", "Dashboard", "Smart Mentor"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-[16px] font-bold transition-colors duration-150 hover:text-moss"
              style={{ color: "var(--ink-light)", fontFamily: "var(--font-body)" }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {isLoaded && !userId ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/sign-in" className="hidden sm:inline-flex btn-earthy text-[15px] md:text-[16px] hover:-translate-y-0.5 transition-transform" style={{ padding: "10px 20px" }}>Log in</Link>
              <MagneticButton href="/sign-up" className="text-[14px] md:text-[16px] font-bold rounded-xl text-white shadow-md hover:-translate-y-0.5 transition-transform" style={{ background: "linear-gradient(135deg, #58CC02 0%, #46A302 100%)", padding: "10px 20px" }}>Start free</MagneticButton>
            </div>
          ) : isLoaded && userId ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/dashboard" className="btn-moss text-[14px] md:text-[16px]" style={{ padding: "10px 20px" }}>Dashboard</Link>
              <div className="ml-1 md:ml-2"><UserButton /></div>
            </div>
          ) : (
            <div className="w-[80px] md:w-[160px] h-[36px] md:h-[44px]" />
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2 bg-[rgba(0,0,0,0.04)] rounded-xl shrink-0 hover:bg-[rgba(0,0,0,0.08)] transition-colors">
            <div className="w-5 h-0.5 rounded-full" style={{ background: "var(--earthy)" }} />
            <div className="w-5 h-0.5 rounded-full" style={{ background: "var(--earthy)" }} />
            <div className="w-5 h-0.5 rounded-full" style={{ background: "var(--earthy)" }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-6 pb-6 pt-2 space-y-4 bg-parchment/95 backdrop-blur-2xl shadow-xl border-t border-[rgba(0,0,0,0.05)]">
          {["Features","How it works","Dashboard","Smart Mentor"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`} onClick={() => setMenuOpen(false)}
              className="block text-[15px] font-semibold py-2" style={{ color: "var(--earthy)" }}>{item}</a>
          ))}
          {isLoaded && !userId ? (
            <>
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="btn-earthy text-[14px] py-2.5 px-5 w-full text-center block">Log in</Link>
              <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="text-[14px] py-2.5 px-5 font-bold rounded-xl text-white shadow-md w-full text-center block" style={{ background: "linear-gradient(135deg, #58CC02 0%, #46A302 100%)" }}>Start free</Link>
            </>
          ) : isLoaded && userId ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn-moss text-[14px] py-2.5 px-5 w-full text-center block mb-4">Go to Dashboard</Link>
              <div className="flex justify-center"><UserButton /></div>
            </>
          ) : null}
        </div>
      )}
    </nav>
  );
}
