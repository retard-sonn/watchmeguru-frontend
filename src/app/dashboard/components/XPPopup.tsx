"use client";
import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface XPEvent { id: string; amount: number; label: string; x: number; }
interface XPPopupContextValue { triggerXP: (amount: number, label: string) => void; }
const XPPopupContext = createContext<XPPopupContextValue>({ triggerXP: () => {} });
export function useXPPopup() { return useContext(XPPopupContext); }

const COLORS = ["#58CC02", "#FFC800", "#1CB0F6", "#CE82FF", "#FF7A00"];

let counter = 0;

export function XPPopupProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<XPEvent[]>([]);

  const triggerXP = useCallback((amount: number, label: string) => {
    const id = `xp-${++counter}-${Date.now()}`;
    const x = (Math.random() - 0.5) * 80;
    setEvents(prev => [...prev, { id, amount, label, x }]);
    setTimeout(() => setEvents(prev => prev.filter(e => e.id !== id)), 1800);
  }, []);

  useEffect(() => () => setEvents([]), []);

  return (
    <XPPopupContext.Provider value={{ triggerXP }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[200]">
        <AnimatePresence>
          {events.map(event => (
            <motion.div key={event.id}
              initial={{ opacity: 0, y: 20, scale: 0.3 }}
              animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.3, 1.3, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, times: [0, 0.15, 0.4, 1], ease: "easeOut" }}
              className="absolute flex flex-col items-center"
              style={{ left: `calc(50% + ${event.x}px)`, top: "40%" }}>
              {/* Main XP badge */}
              <span className="text-[32px] font-extrabold leading-none px-4 py-2 rounded-2xl text-white"
                style={{
                  background: "linear-gradient(135deg, #58CC02, #46A302)",
                  boxShadow: "0 6px 24px rgba(88,204,2,0.5)",
                  fontFamily: "var(--font-baloo)",
                }}>
                +{event.amount}
              </span>
              <span className="text-[12px] font-bold px-3 py-1 rounded-full mt-1 text-white"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>{event.label}</span>
              {/* Sparkle particles */}
              {COLORS.map((c, i) => (
                <motion.div key={i} className="absolute rounded-full"
                  style={{ width: 6, height: 6, background: c, top: "50%", left: "50%" }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{ x: (i - 2) * 25, y: -15 - i * 8, scale: [0, 1, 0], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06 }} />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </XPPopupContext.Provider>
  );
}

export default XPPopupProvider;
