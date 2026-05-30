"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BULLETS = [
  "Your mentor checks in every morning. No excuses accepted.",
  "Missed a session? WatchMeGuru notices before you do.",
  "3 days inactive? Your parent gets a full report.",
  "Reaches you on WhatsApp, Telegram or Discord.",
];

export default function SignUpPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (isSignedIn) return null;
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Earthy gradient ── */}
      <div
        className="hidden lg:flex flex-col w-[42%] relative overflow-hidden"
        style={{ background: "linear-gradient(165deg, #3D2E24 0%, #5B4636 40%, #7BA65B 85%, #94A84D 100%)" }}
      >
        {/* Warm glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div style={{ position: "absolute", width: 400, height: 400, top: "0%", left: "55%", background: "radial-gradient(circle, rgba(217,164,65,0.16) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", width: 300, height: 300, top: "55%", left: "10%", background: "radial-gradient(circle, rgba(123,166,91,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        </div>

        <div className="relative z-10 flex flex-col h-full p-14">
          <Link href="/" className="text-[20px] font-extrabold tracking-tight" style={{ color: "#FDF9F0", fontFamily: "var(--font-baloo)" }}>
            WatchMe<span style={{ color: "var(--mustard)" }}>Guru</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-xs">
            <div className="space-y-5">
              {BULLETS.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(217,164,65,0.18)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--mustard)" }} />
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: "rgba(253,249,240,0.65)" }}>{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[12px]" style={{ color: "rgba(253,249,240,0.25)" }}>
            JEE · NEET · UPSC · NDA · CBSE
          </div>
        </div>
      </div>

      {/* ── Right Panel — Parchment ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 overflow-y-auto texture-bg" style={{ background: "#FDF9F0" }}>
        <div className="w-full max-w-[440px] py-8">
          <Link href="/" className="text-[20px] font-extrabold tracking-tight mb-10 block lg:hidden" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
            WatchMe<span style={{ color: "var(--moss)" }}>Guru</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-extrabold tracking-tight mb-2" style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(26px, 4vw, 32px)", color: "var(--earthy)" }}>
              Plant your seed.
            </h1>
            <p className="text-[15px] font-medium" style={{ color: "var(--ink-light)" }}>
              Your AI companion starts tomorrow.
            </p>
          </div>

          <SignUp
            fallbackRedirectUrl="/dashboard"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none border-0 bg-transparent p-0",
                card: "w-full shadow-none border-0 bg-transparent p-0",
                header: "hidden",
                main: "gap-4",
                socialButtons: "w-full",
                socialButtonsBlockButton: "w-full rounded-[14px] border border-[rgba(91,70,54,0.15)] font-medium text-[14px] py-3",
                dividerRow: "my-5",
                form: "gap-4",
                formFieldInput: "rounded-[14px] border border-[rgba(91,70,54,0.15)] text-[14px] px-4 py-3.5",
                formButtonPrimary: "w-full rounded-[14px] font-bold text-[15px] py-3.5",
                footer: "pt-4",
              },
            }}
          />

          <div className="mt-8 text-center">
            <Link href="/" className="text-[13px] font-medium hover:underline" style={{ color: "var(--ink-muted)" }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
