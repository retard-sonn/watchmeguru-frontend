"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { Sparkles, XCircle, CheckCircle2 } from "lucide-react";
import { getSubjectIcon } from "@/components/illustrations/SubjectIcons";
import { useAuth } from "@clerk/nextjs";

interface Question {
  q: string;
  options: string[];
  answer: number;
}

interface Props {
  subject: string;
  topic?: string;
  earnedXP: number;
  taskId: string;
  onComplete: (success: boolean, finalXP: number, skipped?: boolean) => void;
}

export default function LightningReview({ subject, topic, earnedXP, taskId, onComplete }: Props) {
  const { getToken } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = await getToken();
        const B = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${B}/api/v1/verify/lightning-quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ subject, topic: topic || "" })
        });
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [subject, topic, getToken]);

  // GSAP Entrance for each question
  useEffect(() => {
    if (loading || questions.length === 0) return;
    if (cardRef.current && optionsRef.current) {
      gsap.fromTo(cardRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" });
      gsap.fromTo(optionsRef.current.children, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, [qIndex, loading, questions]);

  const handleSelect = (index: number) => {
    if (selected !== null) return; // Prevent double click
    setSelected(index);
    const correct = index === questions[qIndex].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
      // Success feedback (Green pop)
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
      // Failure feedback (Red shake)
      if (navigator.vibrate) navigator.vibrate(300);
      gsap.to(cardRef.current, {
        x: '+=10', yoyo: true, repeat: 5, duration: 0.05, ease: 'sine.inOut',
        onComplete: () => gsap.set(cardRef.current, { x: 0 })
      });
    }

    setTimeout(() => {
      if (qIndex < 2) {
        // Next question
        gsap.to(cardRef.current, { x: -100, opacity: 0, duration: 0.3, onComplete: () => {
          setSelected(null);
          setIsCorrect(null);
          setQIndex(i => i + 1);
        }});
      } else {
        // End Review
        const finalScore = correct ? score + 1 : score;
        const passed = finalScore >= 2; // Need 2/3 to pass
        const finalXP = passed ? earnedXP + (finalScore * 10) : 0; // Bonus XP for correct answers
        onComplete(passed, finalXP);
      }
    }, 1500);
  };

  const Icon = getSubjectIcon(subject);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF9F0]/95 backdrop-blur-md">
        <div className="w-16 h-16 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-[24px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>Generating Lightning Review...</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF9F0]/95 backdrop-blur-md px-6 text-center">
        <h2 className="text-[24px] font-extrabold text-[#3D2E24] mb-4" style={{ fontFamily: "var(--font-baloo)" }}>Oops, something went wrong.</h2>
        <button onClick={() => onComplete(true, earnedXP, true)} className="btn-moss px-8 py-3">Skip Verification</button>
      </div>
    );
  }

  const currentQ = questions[qIndex];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#F4EEDB] overflow-hidden">
      {/* Header */}
      <div className="w-full p-6 flex justify-between items-center bg-white shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 opacity-80"><Icon /></div>
          <div>
            <h1 className="text-[18px] font-extrabold capitalize leading-tight" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>{subject}</h1>
            <p className="text-[12px] font-bold text-[#9B8E84] uppercase tracking-widest">Lightning Review</p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-8 h-2.5 rounded-full transition-all duration-300" 
              style={{ background: i < qIndex ? "#58CC02" : i === qIndex ? "#D9A441" : "rgba(0,0,0,0.06)" }} 
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto p-6 relative">
        
        {/* Feedback Overlay */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div 
              className="absolute inset-0 z-0 rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, background: isCorrect ? "radial-gradient(circle, rgba(88,204,2,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(255,75,75,0.1) 0%, transparent 70%)" }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        <div ref={cardRef} className="relative z-10">
          <h2 className="text-[28px] md:text-[32px] font-extrabold mb-8 text-center" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)", lineHeight: 1.2 }}>
            {currentQ.q}
          </h2>

          <div ref={optionsRef} className="flex flex-col gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selected === i;
              const isActuallyCorrect = i === currentQ.answer;
              
              let bg = "white";
              let border = "2px solid rgba(0,0,0,0.08)";
              let shadow = "0 4px 0 rgba(0,0,0,0.05)";
              let textColor = "#6B5D52";

              if (selected !== null) {
                if (isActuallyCorrect) {
                  bg = "#58CC02";
                  border = "2px solid #58CC02";
                  shadow = "0 4px 0 #46A302";
                  textColor = "white";
                } else if (isSelected) {
                  bg = "#FF4B4B";
                  border = "2px solid #FF4B4B";
                  shadow = "0 4px 0 #D93636";
                  textColor = "white";
                } else {
                  bg = "rgba(255,255,255,0.5)";
                  textColor = "#9B8E84";
                }
              }

              return (
                <button
                  key={i}
                  disabled={selected !== null}
                  onClick={() => handleSelect(i)}
                  className="w-full p-5 rounded-2xl text-left text-[16px] font-bold transition-all relative overflow-hidden flex items-center justify-between"
                  style={{ background: bg, border, boxShadow: shadow, color: textColor }}
                >
                  <span className="relative z-10">{opt}</span>
                  {selected !== null && isActuallyCorrect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10">
                      <CheckCircle2 size={24} color="white" />
                    </motion.div>
                  )}
                  {selected !== null && isSelected && !isActuallyCorrect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10">
                      <XCircle size={24} color="white" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
