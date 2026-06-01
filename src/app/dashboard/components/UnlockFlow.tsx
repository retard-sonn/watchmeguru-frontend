"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ShieldCheck } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Props {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export default function UnlockFlow({ open, onClose, onUnlocked }: Props) {
  const { getToken } = useAuth();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const requestOtp = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/v1/students/me/unlock/request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      return res.json();
    },
    onSuccess: () => {
      setStep("verify");
      setError("");
    },
    onError: (e: Error) => setError(e.message),
  });

  const verifyOtp = useMutation({
    mutationFn: async (code: string) => {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/v1/students/me/unlock/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ otp: code }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid OTP");
      }
      return res.json();
    },
    onSuccess: () => {
      onUnlocked();
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        style={{ background: "rgba(61,46,36,0.4)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-sm rounded-2xl p-6"
          style={{ background: "#FDF9F0", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(61,46,36,0.15)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {step === "request" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(123,166,91,0.1)" }}>
                  <Lock size={20} strokeWidth={1.5} color="var(--moss)" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>Request Unlock</h3>
                  <p className="text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>Parent verification required</p>
                </div>
              </div>
              <p className="text-[13px] font-medium mb-6" style={{ color: "var(--ink-light)" }}>
                A 6-digit verification code will be sent to your parent&apos;s WhatsApp.
              </p>
              <button
                onClick={() => requestOtp.mutate()}
                disabled={requestOtp.isPending}
                className="btn-moss w-full text-[14px] py-3 disabled:opacity-50"
              >
                {requestOtp.isPending ? "Sending..." : "Send Code"}
              </button>
            </>
          )}

          {step === "verify" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(123,166,91,0.1)" }}>
                  <ShieldCheck size={20} strokeWidth={1.5} color="var(--moss)" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>Enter Code</h3>
                  <p className="text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>Sent to parent&apos;s WhatsApp</p>
                </div>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => { if (e.key === "Enter" && otp.length === 6) verifyOtp.mutate(otp); }}
                className="w-full text-center text-[28px] font-extrabold tracking-[0.3em] py-3 rounded-xl border mb-6 outline-none"
                style={{ borderColor: "rgba(91,70,54,0.12)", background: "#F4EEDB", color: "var(--earthy)", letterSpacing: "0.3em" }}
              />
              <button
                onClick={() => verifyOtp.mutate(otp)}
                disabled={otp.length !== 6 || verifyOtp.isPending}
                className="btn-moss w-full text-[14px] py-3 disabled:opacity-50"
              >
                {verifyOtp.isPending ? "Verifying..." : "Verify & Unlock"}
              </button>
            </>
          )}

          {error && (
            <p className="text-[12px] font-semibold mt-4 text-center flex items-center justify-center gap-1.5" style={{ color: "#DC2626" }}>
              {error}
            </p>
          )}

          <button
            onClick={() => { setStep("request"); setOtp(""); setError(""); onClose(); }}
            className="w-full mt-3 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[rgba(91,70,54,0.03)]"
            style={{ color: "var(--ink-muted)" }}
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
