"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Image, X, Check } from "lucide-react";

interface Props {
  onUploaded: (fileUrl: string) => void;
  taskTitle?: string;
  compact?: boolean;
}

export default function ProofUploader({ onUploaded, taskTitle, compact = false }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
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

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dvrdvdnxvnattcjqosdw.supabase.co";
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      const fileName = `proofs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const res = await fetch(
        `${supabaseUrl}/storage/v1/object/proofs/${fileName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": file.type,
          },
          body: file,
        }
      );

      if (!res.ok) {
        // If upload to Supabase fails, use data URL as fallback
        const dataUrl = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(file);
        });
        setUploaded(true);
        onUploaded(dataUrl);
        return;
      }

      const fileUrl = `${supabaseUrl}/storage/v1/object/public/proofs/${fileName}`;
      setUploaded(true);
      onUploaded(fileUrl);
    } catch {
      // Fallback: use data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(file);
      });
      setUploaded(true);
      onUploaded(dataUrl);
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (compact && uploaded) {
    return (
      <motion.div
        className="flex items-center gap-2 text-[13px] font-semibold"
        style={{ color: "var(--moss)" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Check size={16} /> Proof uploaded
      </motion.div>
    );
  }

  if (compact) {
    return (
      <div>
        <input ref={fileInput} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <button
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-[12px] font-semibold py-1.5 px-3 rounded-full border transition-all disabled:opacity-50"
          style={{ borderColor: "rgba(91,70,54,0.15)", color: "var(--earthy)", background: "rgba(91,70,54,0.02)" }}
        >
          {uploading ? (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-moss border-t-transparent animate-spin" />
          ) : (
            <Camera size={14} strokeWidth={1.5} />
          )}
          {uploading ? "Uploading..." : "Add Proof"}
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
        onClick={() => fileInput.current?.click()}
      >
        <input ref={fileInput} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-3 border-moss border-t-transparent animate-spin" />
              <p className="text-[14px] font-semibold" style={{ color: "var(--earthy)" }}>Uploading proof...</p>
            </motion.div>
          ) : uploaded ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(123,166,91,0.1)" }}>
                <Check size={24} strokeWidth={2} color="var(--moss)" />
              </div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--moss)" }}>Proof uploaded!</p>
              {preview && (
                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-xl mt-2" />
              )}
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
                  Snap a photo of your notebook or drag an image here
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>
                  <Camera size={14} /> Photo
                </span>
                <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>
                  <Image size={14} /> Screenshot
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

      {uploaded && !uploading && (
        <button onClick={() => { setPreview(null); setUploaded(false); setError(""); }}
          className="mt-2 text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>
          Upload a different photo
        </button>
      )}
    </div>
  );
}
