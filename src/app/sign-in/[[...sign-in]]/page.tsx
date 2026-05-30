import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Earthy gradient + illustrated scene ── */}
      <div
        className="hidden lg:flex flex-col w-[42%] relative overflow-hidden"
        style={{ background: "linear-gradient(165deg, #3D2E24 0%, #5B4636 40%, #7BA65B 85%, #94A84D 100%)" }}
      >
        {/* Warm atmospheric glow — replacing navy orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div style={{ position: "absolute", width: 380, height: 380, top: "5%", left: "50%", background: "radial-gradient(circle, rgba(217,164,65,0.18) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", width: 320, height: 320, top: "55%", left: "15%", background: "radial-gradient(circle, rgba(123,166,91,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        </div>

        <div className="relative z-10 flex flex-col h-full p-14">
          <Link href="/" className="text-[20px] font-extrabold tracking-tight" style={{ color: "#FDF9F0", fontFamily: "var(--font-baloo)" }}>
            WatchMe<span style={{ color: "var(--mustard)" }}>Guru</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <div className="w-12 h-0.5 mb-8" style={{ background: "var(--mustard)" }} />
            <p className="text-[22px] font-medium leading-snug mb-4" style={{ color: "rgba(253,249,240,0.85)" }}>
              &ldquo;It texted me at 7am and asked where I was. Nobody had ever done that before.&rdquo;
            </p>
            <div className="text-[13px] font-semibold" style={{ color: "var(--mustard)" }}>
              Ananya R. — JEE Advanced, AIR 847
            </div>
          </div>

          <div className="text-[12px]" style={{ color: "rgba(253,249,240,0.3)" }}>
            WhatsApp · Telegram · Discord
          </div>
        </div>
      </div>

      {/* ── Right Panel — Parchment ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 texture-bg" style={{ background: "#FDF9F0" }}>
        <div className="w-full max-w-[480px]">
          <Link href="/" className="text-[20px] font-extrabold tracking-tight mb-8 block lg:hidden" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
            WatchMe<span style={{ color: "var(--moss)" }}>Guru</span>
          </Link>
        </div>

        <SignIn
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />

        <div className="mt-6 text-center">
          <Link href="/" className="text-[13px] font-medium hover:underline" style={{ color: "var(--ink-muted)" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
