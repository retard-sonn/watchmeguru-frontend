"use client";

import React, { useState, useEffect } from "react";
import { toggleMute } from "@/lib/sound";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {

  }, []);

  const handleToggle = () => {
    setIsMuted(toggleMute());
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200 text-slate-600 hover:text-green-600 hover:scale-110 transition-all duration-200"
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}
