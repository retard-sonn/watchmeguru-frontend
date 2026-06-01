"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#2B1F18" }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <Link href="/" className="text-[20px] font-extrabold tracking-tight" style={{ color: "#FDF9F0", fontFamily: "var(--font-baloo)" }}>
              WatchMe<span style={{ color: "#7BA65B" }}>Guru</span><span className="text-[12px] font-medium ml-0.5" style={{ color: "rgba(253,249,240,0.3)" }}>.io</span>
            </Link>
            <p className="text-[12px] font-medium mt-1" style={{ color: "rgba(253,249,240,0.3)" }}>Built by students who struggled with consistency too.</p>
          </div>
          <div className="flex gap-8">
            {["Features","How it works","Dashboard","Smart Mentor"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`}
                className="text-[13px] font-medium transition-colors hover:text-[#FDF9F0]" style={{ color: "rgba(253,249,240,0.4)" }}>{item}</a>
            ))}
          </div>
          <div className="flex gap-5">
            <Link href="/sign-in" className="text-[13px] font-medium transition-colors" style={{ color: "rgba(253,249,240,0.4)" }}>Log in</Link>
            <Link href="/sign-up" className="text-[13px] font-bold" style={{ color: "#7BA65B" }}>Sign up free</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: "rgba(253,249,240,0.06)" }}>
          <p className="text-[11px] font-medium" style={{ color: "rgba(253,249,240,0.2)" }}>JEE · NEET · UPSC · NDA · CBSE — every exam warrior welcome.</p>
          <p className="text-[11px]" style={{ color: "rgba(253,249,240,0.15)" }}>&copy; 2026 WatchMeGuru.io</p>
        </div>
      </div>
    </footer>
  );
}
