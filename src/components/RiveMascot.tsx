"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import GuruGuardian from "@/components/illustrations/GuruGuardian";

type MascotState = "idle" | "active" | "alert" | "celebrate" | "level_up";

interface RiveMascotProps {
  size?: number;
  state?: MascotState;
}

// Note: Replace this URL with your actual .riv file hosted on Rive or your CDN
// Create your mascot at https://rive.app and export the .riv file
const RIVE_FILE_URL = "/mascot.riv";

export default function RiveMascot({ size = 80, state = "idle" }: RiveMascotProps) {
  const [hasRive, setHasRive] = useState(false);
  const [riveError, setRiveError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if Rive file exists (will fail gracefully if not)
    fetch(RIVE_FILE_URL)
      .then(r => { if (r.ok) setHasRive(true); })
      .catch(() => setHasRive(false));
  }, []);

  // Fallback to GuruGuardian SVG if no Rive file available
  if (!hasRive || riveError) {
    return <GuruGuardian size={size} state={state === "celebrate" || state === "level_up" ? "active" : state === "alert" ? "alert" : "idle"} />;
  }

  // Rive canvas placeholder — will be replaced with actual Rive runtime when .riv file is ready
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.5,
        }}
      >
        <GuruGuardian size={size} state={state === "celebrate" || state === "level_up" ? "active" : state === "alert" ? "alert" : "idle"} />
      </div>
    </div>
  );
}

// Export state names for external use
export type { MascotState };
