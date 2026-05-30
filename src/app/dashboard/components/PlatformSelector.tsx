"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (platform: "whatsapp" | "discord" | "telegram") => void;
  connectedPlatforms: string[];
}

const PLATFORM_INFO: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  whatsapp: {
    label: "WhatsApp",
    color: "#25D366",
    bg: "rgba(37,211,102,0.06)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  discord: {
    label: "Discord",
    color: "#5865F2",
    bg: "rgba(88,101,242,0.06)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25-1.845-.277-3.68-.277-5.487 0-.164-.394-.406-.875-.618-1.25a.077.077 0 00-.078-.037 19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C.533 9.046-.32 13.58.1 18.058a.082.082 0 00.031.056c2.053 1.507 4.041 2.423 5.993 3.03a.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106c-.653-.248-1.274-.55-1.872-.892a.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.009c.12.099.246.198.372.292a.077.077 0 01-.006.128 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 00-.031-.029zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
  },
  telegram: {
    label: "Telegram",
    color: "#0088cc",
    bg: "rgba(0,136,204,0.06)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#0088cc"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>,
  },
};

export default function PlatformSelector({ open, onClose, onSelect, connectedPlatforms }: Props) {
  const available = connectedPlatforms.filter((p) => PLATFORM_INFO[p]);

  useEffect(() => {
    if (open && available.length === 1) {
      onSelect(available[0] as "whatsapp" | "discord" | "telegram");
    }
  }, [open, available, onSelect]);

  if (available.length <= 1 && open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-60"
            style={{ background: "rgba(61,46,36,0.3)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-70 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: "#FDF9F0", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(61,46,36,0.15)" }}
            >
              <h3
                className="text-[17px] font-extrabold mb-1 text-center"
                style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
              >
                Start Session On
              </h3>
              <p className="text-[13px] font-medium mb-6 text-center" style={{ color: "var(--ink-light)" }}>
                Where should your mentor message you during this session?
              </p>

              <div className="space-y-3">
                {available.map((platform) => {
                  const info = PLATFORM_INFO[platform];
                  return (
                    <button
                      key={platform}
                      onClick={() => onSelect(platform as any)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01]"
                      style={{ borderColor: info.color + "33", background: info.bg }}
                    >
                      {info.icon}
                      <div className="text-left">
                        <p className="text-[14px] font-bold" style={{ color: "var(--earthy)" }}>{info.label}</p>
                        <p className="text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>
                          Messages via {info.label}
                        </p>
                      </div>
                      <div className="ml-auto w-2 h-2 rounded-full" style={{ background: info.color }} />
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[rgba(91,70,54,0.03)] transition-colors"
                style={{ color: "var(--ink-muted)" }}
              >
                Skip — Keep in Dashboard
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
