"use client";
import Link from "next/link";
import Ornament from "@/components/illustrations/Ornament";

export default function Footer() {
  return (
    <footer style={{ background: "#081F0E" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[20px] font-extrabold tracking-tight" style={{ color: "#F0FDF4", fontFamily: "var(--font-baloo)" }}>
              WatchMe<span style={{ color: "var(--moss)" }}>Guru</span>
            </span>
          </Link>

          <div className="flex gap-8">
            {["Features", "How it works", "Dashboard", "Smart Mentor"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[13px] font-medium transition-colors hover:text-[#F0FDF4]"
                style={{ color: "rgba(253,249,240,0.4)" }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex gap-5">
            <Link href="/sign-in" className="text-[13px] font-medium transition-colors" style={{ color: "rgba(253,249,240,0.4)" }}>
              Log in
            </Link>
            <Link href="/sign-up" className="text-[13px] font-bold" style={{ color: "var(--moss)" }}>
              Sign up free
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: "rgba(253,249,240,0.06)" }}>
          <p className="text-[12px] font-medium" style={{ color: "rgba(253,249,240,0.25)" }}>
            Built for India&apos;s exam warriors. JEE · NEET · UPSC · NDA · CBSE
          </p>
          <div className="flex items-center gap-3">
            <Ornament variant="dots" />
            <p className="text-[12px]" style={{ color: "rgba(253,249,240,0.2)" }}>
              &copy; 2026 WatchMeGuru
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
