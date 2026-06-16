"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#081F0E" }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <Link href="/" className="inline-block">
              <img src="/watchmeguru.png" alt="WatchMeGuru" className="h-10 md:h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-[12px] font-medium mt-2" style={{ color: "rgba(240,253,244,0.35)" }}>Built by students who struggled with consistency too.</p>
          </div>
          <div className="flex gap-8">
            {["Features","How it works","Dashboard","Smart Mentor"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`}
                className="text-[13px] font-medium transition-colors hover:text-[#F0FDF4]" style={{ color: "rgba(240,253,244,0.45)" }}>{item}</a>
            ))}
          </div>
          <div className="flex gap-5">
            <Link href="/sign-in" className="text-[13px] font-medium transition-colors" style={{ color: "rgba(240,253,244,0.45)" }}>Log in</Link>
            <Link href="/sign-up" className="text-[13px] font-bold" style={{ color: "#58CC02" }}>Sign up free</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: "rgba(240,253,244,0.08)" }}>
          <p className="text-[11px] font-medium" style={{ color: "rgba(240,253,244,0.25)" }}>JEE · NEET · UPSC · NDA · CBSE — every exam warrior welcome.</p>
          <p className="text-[11px]" style={{ color: "rgba(240,253,244,0.18)" }}>&copy; 2026 WatchMeGuru</p>
        </div>
      </div>
    </footer>
  );
}
