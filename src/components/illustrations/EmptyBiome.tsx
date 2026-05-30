"use client";

export default function EmptyBiome() {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-auto opacity-50">
      {/* Empty terrain */}
      <ellipse cx="60" cy="72" rx="50" ry="8" fill="rgba(91,70,54,0.04)" />
      <ellipse cx="60" cy="66" rx="38" ry="14" fill="#EBE3C8" opacity="0.6" />
      <ellipse cx="60" cy="64" rx="28" ry="10" fill="#F4EEDB" opacity="0.5" />
      {/* Single seed */}
      <circle cx="60" cy="58" r="2.5" fill="rgba(123,166,91,0.3)" />
      <line x1="60" y1="60" x2="60" y2="64" stroke="rgba(91,70,54,0.15)" strokeWidth="1" />
      {/* Tiny question mark */}
      <text x="60" y="45" textAnchor="middle" fontSize="18" fill="rgba(91,70,54,0.15)" fontFamily="var(--font-baloo)">?</text>
    </svg>
  );
}
