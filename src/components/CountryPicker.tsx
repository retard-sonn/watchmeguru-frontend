"use client";

import { useState, useEffect, useRef } from "react";
import { Command } from "cmdk";
import ReactCountryFlag from "react-country-flag";
import { Search, Check } from "lucide-react";
import gsap from "gsap";
import { COUNTRIES, searchCountries } from "@/lib/countries";

interface CountryPickerProps {
  selected: string;
  onSelect: (code: string, dial: string) => void;
  onClose: () => void;
}

export default function CountryPicker({ selected, onSelect, onClose }: CountryPickerProps) {
  const [search, setSearch] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = search ? searchCountries(search) : COUNTRIES.slice(0, 15);

  useEffect(() => {
    // GSAP entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(".cmdk-overlay", { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(".cmdk-panel", { scale: 0.96, y: 10, opacity: 0 }, {
        scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "power3.out",
      });
    }, overlayRef);
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);
    // ESC to close
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("keydown", esc); ctx.revert(); };
  }, [onClose]);

  return (
    <div ref={overlayRef} className="cmdk-overlay fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(61,46,36,0.4)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cmdk-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#FDF9F0", border: "1px solid rgba(123,166,91,0.12)" }}>
        <Command>
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
            <Search size={16} style={{ color: "#9B8E84" }} />
            <Command.Input
              ref={inputRef}
              value={search}
              onValueChange={setSearch}
              placeholder="Search countries..."
              className="flex-1 bg-transparent outline-none text-[15px] font-medium"
              style={{ color: "#3D2E24" }}
            />
            <button onClick={onClose} className="text-[13px] font-bold px-3 py-1 rounded-lg hover:bg-[rgba(0,0,0,0.04)]" style={{ color: "#9B8E84" }}>ESC</button>
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-[13px] font-medium" style={{ color: "#9B8E84" }}>
              No countries found
            </Command.Empty>
            {results.map(c => (
              <Command.Item
                key={c.code}
                value={`${c.name} ${c.code}`}
                onSelect={() => { onSelect(c.code, c.dial); onClose(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium cursor-pointer transition-all"
                style={{ color: selected === c.code ? "#58CC02" : "#3D2E24" }}
              >
                <ReactCountryFlag countryCode={c.code} svg style={{ width: 24, height: 18, borderRadius: 3 }} />
                <span className="flex-1">{c.name}</span>
                <span style={{ color: "#9B8E84" }}>{c.dial}</span>
                {selected === c.code && <Check size={15} style={{ color: "#58CC02" }} />}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
