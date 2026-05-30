"use client";

interface Props {
  variant?: "zigzag" | "dots" | "wave";
}

export default function Ornament({ variant = "dots" }: Props) {
  const patterns = {
    zigzag: (
      <path d="M0,8 L12,2 L24,8 L36,2 L48,8" stroke="#94A84D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ),
    dots: (
      <>
        <circle cx="6" cy="6" r="2.5" fill="#D9A441" opacity="0.4" />
        <circle cx="18" cy="6" r="3" fill="#7BA65B" opacity="0.35" />
        <circle cx="30" cy="6" r="2" fill="#D9A441" opacity="0.45" />
        <circle cx="42" cy="6" r="2.5" fill="#94A84D" opacity="0.3" />
      </>
    ),
    wave: (
      <path d="M0,6 Q12,0 24,6 Q36,12 48,6" stroke="rgba(91,70,54,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ),
  };

  return (
    <svg viewBox="0 0 48 12" className="w-12 h-auto opacity-70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {patterns[variant]}
    </svg>
  );
}
