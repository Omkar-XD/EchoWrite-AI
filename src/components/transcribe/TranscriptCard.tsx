"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ActionBar from "./ActionBar";
import { ChevronDown, ChevronRight } from "lucide-react";

interface TranscriptCardProps {
  title: string;
  transcript: string;
  summary?: string;
  onSummary?: () => Promise<string | undefined>;
}

export default function TranscriptCard({
  title,
  transcript,
  summary,
  onSummary,
}: TranscriptCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="bg-white/5 text-white shadow-lg border border-white/10 rounded-2xl backdrop-blur">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {expanded ? "Hide" : "Show"}
        </button>
      </CardHeader>

      {/* Transcript + Actions */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardContent>
              {/* Scrollable transcript area */}
              <div className="max-h-64 overflow-y-auto pr-2 mb-4 text-sm leading-relaxed text-gray-200">
                {transcript}
              </div>

              {/* ✅ Reusable Actions (copy/download/summary) */}
              <ActionBar transcript={transcript} onSummary={onSummary} summary={summary} />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
