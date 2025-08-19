"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Props = {
original?: string;
translated?: string;
};

export default function TranscriptPanel({ original, translated }: Props) {
const [showEnglish, setShowEnglish] = useState(false);
const containerRef = useRef<HTMLDivElement>(null);

if (!original && !translated) return null;

const hasTranslation = Boolean(translated && translated.trim().length > 0);
const text = showEnglish && hasTranslation ? translated! : original || "";

// Auto-scroll to bottom when transcript updates
useEffect(() => {
if (containerRef.current) {
containerRef.current.scrollTop = containerRef.current.scrollHeight;
}
}, [text]);

return (
<motion.div
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: "easeOut" }}
className="w-full bg-white/5 border border-white/10 rounded-2xl p-5"
>
{/* Header */}
<div className="flex items-center justify-between mb-3">
<p className="text-sm text-gray-300">
{showEnglish && hasTranslation ? "🌐 English Translation" : "📝 Original Transcript"}
</p>


    <button
      onClick={() => hasTranslation && setShowEnglish((s) => !s)}
      aria-label={
        showEnglish ? "Show Original Transcript" : "Show English Translation"
      }
      disabled={!hasTranslation}
      className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
        hasTranslation
          ? "border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10"
          : "border-gray-500 text-gray-500 cursor-not-allowed"
      }`}
      title={hasTranslation ? "" : "No English translation available"}
    >
      {showEnglish ? "Show Original" : "Translate to English"}
    </button>
  </div>

  {/* Transcript Box */}
  <div
    ref={containerRef}
    className="h-72 overflow-y-auto rounded-xl bg-black/30 border border-white/10 p-4 leading-7 text-gray-100 scrollbar-thin scrollbar-thumb-[#00E5FF]/40"
  >
    {text ? (
      <pre className="whitespace-pre-wrap break-words">{text}</pre>
    ) : (
      <p className="text-gray-400 italic">
        No transcript available. Please fetch a transcript first.
      </p>
    )}
  </div>
</motion.div>
);
}