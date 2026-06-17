import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import MascotPenguin from '../../landing/components/MascotPenguin';

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #E8F5E0 0%, #D4EDCA 45%, #E0F0D5 100%)' }}>
      
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#A8C89A 1.5px, transparent 1.5px)', backgroundSize: '38px 38px', opacity: 0.45 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(212,237,202,0.6) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23111\\'/%3E%3C/svg%3E")' }} />

      <div className="absolute hidden lg:block" style={{ top: '15%', left: '12%', animation: 'float1 4s ease-in-out infinite alternate' }}>
        <div className="bg-[#FEF08A] p-5 rounded-2xl border border-[#FDE047] rotate-[-4deg] shadow-lg w-56 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/40 shadow-sm rotate-[-3deg]" style={{ clipPath: 'polygon(2% 4%, 98% 0%, 100% 96%, 0% 100%)' }} />
          <p className="font-extrabold text-[#854D0E] text-lg leading-tight mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Keep it going!</p>
          <p className="text-sm font-semibold text-[#A16207]">Your mentor is waiting for today's session.</p>
        </div>
      </div>

      <div className="absolute hidden lg:block" style={{ bottom: '15%', right: '12%', animation: 'float2 5s ease-in-out infinite alternate' }}>
        <div className="bg-white/80 p-4 rounded-3xl border border-white/60 backdrop-blur-sm rotate-[3deg] shadow-xl w-48 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/60 shadow-sm rotate-[2deg]" style={{ clipPath: 'polygon(2% 4%, 98% 0%, 100% 96%, 0% 100%)' }} />
          <MascotPenguin className="w-24 h-24 mx-auto" />
          <div className="text-center mt-2">
            <p className="font-bold text-[#1A3A0A] text-sm">Your Mentor</p>
            <p className="text-xs text-[#3D6B2E] font-medium">Always watching.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float1 {
          0% { transform: translateY(0px) rotate(-4deg); }
          100% { transform: translateY(-15px) rotate(-2deg); }
        }
        @keyframes float2 {
          0% { transform: translateY(0px) rotate(3deg); }
          100% { transform: translateY(-20px) rotate(5deg); }
        }
        .cl-header { display: none !important; }
        .cl-card { box-shadow: none !important; background: transparent !important; border: none !important; padding: 0 !important; margin: 0 !important; }
        .cl-footer { display: none !important; }
      `}</style>

      <div className="relative z-20 w-full max-w-[420px] px-4">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_60px_-8px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center mb-6">
            <Link href="/">
              <img src="/watchmeguru.png" alt="WatchMeGuru" className="h-14 sm:h-16 object-contain mb-4 hover:scale-105 transition-transform" />
            </Link>
            <h1 className="text-2xl font-extrabold text-[#1A3A0A]" style={{ fontFamily: 'var(--font-baloo)' }}>Welcome Back</h1>
            <p className="text-[13px] font-semibold text-[#3D6B2E] mt-1">Sign in to continue your streak.</p>
          </div>

          <SignIn
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: 'w-full',
                cardBox: 'shadow-none bg-transparent p-0 m-0 border-0',
                header: 'hidden',
                footer: 'hidden',
                formButtonPrimary: 'bg-gradient-to-r from-[#58CC02] to-[#46A302] hover:opacity-90 transition-opacity shadow-md text-white font-bold',
              }
            }}
          />

          <div className="mt-6 pt-6 border-t border-black/5 flex flex-col items-center gap-3">
            <p className="text-[13px] font-medium text-black/60">
              Don't have an account? <Link href="/sign-up" className="text-[#58CC02] font-bold hover:underline">Sign up</Link>
            </p>
            <Link href="/" className="text-[12px] font-medium hover:underline text-black/40">
              ? Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
