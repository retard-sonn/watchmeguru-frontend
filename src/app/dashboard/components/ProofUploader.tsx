"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Camera, X, Check, Sparkles, ShieldCheck, ShieldAlert } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface VerifyResult {
  verdict: "verified" | "partial" | "unrelated";
  feedback: string;
  xp_awarded: number;
  confidence: number;
}

interface Props {
  onUploaded: (fileUrl: string, verifyResult?: VerifyResult) => void;
  taskTitle?: string;
  subject?: string;
  compact?: boolean;
}

const VERDICT_META = {
  verified: {
    icon: ShieldCheck,
    color: "#58CC02",
    bg: "rgba(88,204,2,0.08)",
    border: "rgba(88,204,2,0.2)",
    label: "Verified! ✓",
  },
  partial: {
    icon: ShieldAlert,
    color: "#D9A441",
    bg: "rgba(217,164,65,0.08)",
    border: "rgba(217,164,65,0.2)",
    label: "Partial Credit",
  },
  unrelated: {
    icon: X,
    color: "#DC2626",
    bg: "rgba(220,38,38,0.06)",
    border: "rgba(220,38,38,0.15)",
    label: "Not Accepted",
  },
};

export default function ProofUploader({ onUploaded, taskTitle, subject, compact = false }: Props) {
  const { getToken } = useAuth();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(file);
    });

    setPreview(dataUrl);
    setUploading(true);
    setError("");
    setVerifyResult(null);

    try {
     
      let fileUrl = dataUrl;
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dvrdvdnxvnattcjqosdw.supabase.co";
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
        const fileName = `proofs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const res = await fetch(`${supabaseUrl}/storage/v1/object/proofs/${fileName}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${supabaseAnonKey}`, "Content-Type": file.type },
          body: file,
        });
        if (res.ok) {
          fileUrl = `${supabaseUrl}/storage/v1/object/public/proofs/${fileName}`;
        }
      } catch {
       
      }

      setUploading(false);
      setVerifying(true);

      const token = await getToken();
      const verifyRes = await fetch(`${API_BASE}/api/v1/ai/verify-proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          image_data_url: dataUrl,
          task_title: taskTitle || "",
          subject: subject || "",
        }),
      });

      if (!verifyRes.ok) throw new Error("Verification request failed");
      const vdata = await verifyRes.json();

      const result: VerifyResult = {
        verdict: vdata.verdict,
        feedback: vdata.feedback,
        xp_awarded: vdata.xp_awarded,
        confidence: vdata.confidence,
      };

      setVerifyResult(result);
      setUploaded(true);
      onUploaded(fileUrl, result);
    } catch {
     
      setUploaded(true);
      onUploaded(dataUrl, undefined);
      setError("Uploaded, but AI verification failed. Proof recorded without bonus XP.");
    } finally {
      setUploading(false);
      setVerifying(false);
    }
  }, [onUploaded, taskTitle, subject, getToken]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = () => { setPreview(null); setUploaded(false); setError(""); setVerifyResult(null); };

  if (compact && uploaded && verifyResult) {
    const meta = VERDICT_META[verifyResult.verdict];
    const Icon = meta.icon;
    return (
      <motion.div
        className="flex flex-col gap-1"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14 }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold proof-verified-badge"
          style={{ background: meta.bg, border: `1.5px solid ${meta.border}`, color: meta.color }}
        >
          <Icon size={13} strokeWidth={2} />
          <span>{meta.label}</span>
          {verifyResult.xp_awarded > 0 && (
            <span className="ml-1 anim-xp-slam" style={{ color: "#58CC02" }}>+{verifyResult.xp_awarded} XP</span>
          )}
        </div>
        <p className="text-[11px] font-medium px-1" style={{ color: "#9B8E84" }}>{verifyResult.feedback}</p>
      </motion.div>
    );
  }

  if (compact && uploaded) {
    return (
      <motion.div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "#7BA65B" }} initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Check size={16} /> Uploaded
      </motion.div>
    );
  }

  if (compact) {
    const isProcessing = uploading || verifying;
    return (
      <div>
        <input ref={fileInput} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <button
          onClick={() => fileInput.current?.click()}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-[12px] font-semibold py-1.5 px-3 rounded-full border transition-all disabled:opacity-50"
          style={{ borderColor: "rgba(91,70,54,0.15)", color: "var(--earthy)", background: "rgba(91,70,54,0.02)" }}
        >
          {isProcessing ? (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-moss border-t-transparent animate-spin" />
          ) : (
            <Camera size={14} strokeWidth={1.5} />
          )}
          {uploading ? "Uploading..." : verifying ? "AI checking..." : "Add Proof"}
        </button>
        {error && <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragOver ? "border-moss bg-[rgba(123,166,91,0.03)]" : "border-[rgba(91,70,54,0.1)] hover:border-[rgba(91,70,54,0.2)]"
        }`}
        style={{ background: dragOver ? "rgba(123,166,91,0.03)" : "#FDF9F0" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploaded && fileInput.current?.click()}
      >
        <input ref={fileInput} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-3 border-moss border-t-transparent animate-spin" />
              <p className="text-[14px] font-semibold" style={{ color: "var(--earthy)" }}>Uploading proof...</p>
            </motion.div>
          ) : verifying ? (
            <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
              <div className="relative">
                <Sparkles size={36} className="anim-heartbeat" style={{ color: "#58CC02" }} />
              </div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--earthy)" }}>AI is verifying your work...</p>
              <p className="text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>AI Vision is checking for genuine study evidence</p>
            </motion.div>
          ) : uploaded && verifyResult ? (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
              {(() => {
                const meta = VERDICT_META[verifyResult.verdict];
                const Icon = meta.icon;
                return (
                  <>
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: meta.bg }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, delay: 0.1 }}
                    >
                      <Icon size={28} strokeWidth={1.8} style={{ color: meta.color }} />
                    </motion.div>
                    <div>
                      <p className="text-[16px] font-extrabold mb-1" style={{ color: meta.color, fontFamily: "var(--font-baloo)" }}>
                        {meta.label}
                        {verifyResult.xp_awarded > 0 && (
                          <span className="ml-2 anim-xp-slam inline-block">+{verifyResult.xp_awarded} XP</span>
                        )}
                      </p>
                      <p className="text-[13px] font-medium italic" style={{ color: "#6B5D52" }}>"{verifyResult.feedback}"</p>
                    </div>
                    {preview && <img src={preview} alt="Proof" className="w-24 h-24 object-cover rounded-xl mt-1 opacity-80" />}
                  </>
                );
              })()}
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-xl" />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(91,70,54,0.04)" }}>
                  <Upload size={22} strokeWidth={1.5} color="var(--earthy)" />
                </div>
              )}
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "var(--earthy)" }}>
                  {dragOver ? "Drop your proof here" : taskTitle ? `Upload proof for "${taskTitle}"` : "Upload study proof"}
                </p>
                <p className="text-[12px] font-medium mt-1" style={{ color: "var(--ink-muted)" }}>
                  AI Vision will verify your study evidence • Max 10MB
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>
                  <Camera size={14} /> Photo
                </span>
                <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>
                  <ShieldCheck size={14} /> AI-Verified +50 XP
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#DC2626" }}>
          <X size={14} /> {error}
          <button onClick={() => setError("")} className="ml-auto" style={{ color: "var(--ink-muted)" }}>Dismiss</button>
        </div>
      )}

      {uploaded && !uploading && !verifying && (
        <button onClick={reset} className="mt-2 text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>
          Upload a different photo
        </button>
      )}
    </div>
  );
}
