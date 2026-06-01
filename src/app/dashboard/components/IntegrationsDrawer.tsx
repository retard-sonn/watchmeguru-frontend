"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Props {
  whatsappNumber: string;
  discordId: string;
  telegramHandle: string;
  guardianContact: string;
  onUpdate: () => void;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\+\-\(\)]/g, "").replace(/^91/, "");
}

export default function IntegrationsDrawer({ whatsappNumber, discordId, telegramHandle, guardianContact, onUpdate }: Props) {
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState(whatsappNumber);
  const [discord, setDiscord] = useState(discordId);
  const [telegram, setTelegram] = useState(telegramHandle);
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/v1/students/me/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          whatsapp_number: whatsapp,
          discord_user_id: discord || undefined,
          telegram_chat_id: telegram || undefined,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onUpdate();
    },
  });

  const hasWhatsApp = !!whatsapp.trim();
  const samePhone = guardianContact && whatsapp && normalizePhone(whatsapp) === normalizePhone(guardianContact);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-earthy text-[13px] py-2 px-4 flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1C3.7 1 1 3.7 1 7c0 1.1.3 2.1.8 2.9L1 13l3.2-.8C5 12.7 6 13 7 13c3.3 0 6-2.7 6-6s-2.7-6-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Platforms
        {!hasWhatsApp && <span className="w-2 h-2 rounded-full bg-[#D9A441] anim-pulse" />}
      </button>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(61,46,36,0.3)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md p-6"
              style={{ background: "#FDF9F0" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[20px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  Platforms
                </h2>
                <button onClick={() => setOpen(false)} className="text-[24px]" style={{ color: "var(--ink-muted)" }}>&times;</button>
              </div>

              <div className="space-y-5">
                {/* WhatsApp */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold" style={{ color: "var(--earthy)" }}>WhatsApp</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: "#DC2626", color: "#fff" }}>Required</span>
                    {hasWhatsApp && <span className="w-2 h-2 rounded-full" style={{ background: "#7BA65B" }} />}
                  </div>
                  <input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none"
                    style={{ borderColor: hasWhatsApp ? "rgba(123,166,91,0.3)" : "rgba(91,70,54,0.12)", background: "#fff" }}
                  />
                </div>

                {/* Discord */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold" style={{ color: "var(--earthy)" }}>Discord</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: "rgba(91,70,54,0.08)", color: "var(--ink-muted)" }}>Optional</span>
                  </div>
                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    placeholder="username#0000"
                    className="w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none"
                    style={{ borderColor: "rgba(91,70,54,0.12)", background: "#fff" }}
                  />
                </div>

                {/* Telegram */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold" style={{ color: "var(--earthy)" }}>Telegram</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: "rgba(91,70,54,0.08)", color: "var(--ink-muted)" }}>Optional</span>
                  </div>
                  <input
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@username"
                    className="w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none"
                    style={{ borderColor: "rgba(91,70,54,0.12)", background: "#fff" }}
                  />
                </div>
              </div>

              <div className="mt-8">
                {samePhone && (
                  <p className="text-[12px] font-semibold mb-3 text-center flex items-center justify-center gap-1.5" style={{ color: "#DC2626" }}>
                    ⚠ Your number cannot match your parent&apos;s number.
                  </p>
                )}
                <button
                  onClick={() => save.mutate()}
                  disabled={save.isPending || !!samePhone}
                  className="btn-moss w-full text-[15px] py-3 disabled:opacity-50"
                >
                  {save.isPending ? "Saving..." : saved ? "✓ Saved" : "Save & Activate"}
                </button>
                {save.isError && (
                  <p className="text-[12px] font-medium mt-2 text-center" style={{ color: "#DC2626" }}>
                    Failed to save. Try again.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
