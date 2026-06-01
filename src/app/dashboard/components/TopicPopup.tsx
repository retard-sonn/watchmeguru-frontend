"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, ArrowRight } from "lucide-react";

interface TopicPopupProps {
  isOpen: boolean;
  subject: string;
  onConfirm: (topic: string, subtopic?: string) => void;
  onCancel: () => void;
}

export default function TopicPopup({ isOpen, subject, onConfirm, onCancel }: TopicPopupProps) {
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");

  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: "rgba(61,46,36,0.5)", backdropFilter: "blur(12px)" }}>
      <motion.div className="w-full max-w-sm rounded-3xl p-6"
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{ background: "#FDF9F0", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(88,204,2,0.08)" }}>
          <BookOpen size={22} style={{ color: "#58CC02" }} />
        </div>
        <h3 className="text-[18px] font-extrabold mb-1" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>
          What will you study?
        </h3>
        <p className="text-[12px] font-medium mb-4" style={{ color: "#6B5D52" }}>
          You're starting <strong>{subject}</strong>. What topic will you cover?
        </p>
        <input
          autoFocus
          placeholder="e.g., Quadratic Equations, Chapter 5"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border text-[14px] outline-none mb-3"
          style={{ borderColor: "rgba(0,0,0,0.1)", background: "#F4EEDB" }}
        />
        <input
          placeholder="Subtopic or chapter range (optional)"
          value={subtopic}
          onChange={e => setSubtopic(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border text-[13px] outline-none mb-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "#F4EEDB" }}
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-[14px] font-bold border"
            style={{ borderColor: "rgba(0,0,0,0.08)", color: "#6B5D52" }}>Cancel</button>
          <button onClick={() => { if (topic.trim()) onConfirm(topic.trim(), subtopic.trim() || undefined); }}
            disabled={!topic.trim()}
            className="flex-1 py-3 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #58CC02, #46A302)" }}>
            Start Session <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
