"use client";

import { downloadTextFile, toCSV, copyToClipboard } from "@/lib/transcribe-utils";
import { useState } from "react";

type Props = {
  transcript?: string;
  onSummary?: () => Promise<string | undefined>;
  summary?: string;
};

export default function ActionBar({ transcript, onSummary, summary }: Props) {
  const [copyOk, setCopyOk] = useState(false);
  const hasText = !!transcript?.trim();

  const handleCopy = async () => {
    if (!hasText) return;
    const ok = await copyToClipboard(transcript!);
    setCopyOk(ok);
    setTimeout(() => setCopyOk(false), 1200);
  };

  const handleTxt = () => {
    if (!hasText) return;
    downloadTextFile("transcript.txt", transcript!);
  };

  const handleCsv = () => {
    if (!hasText) return;
    downloadTextFile("transcript.csv", toCSV(transcript!));
  };

  return (
    <div className="w-full grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
      <button
        onClick={handleCopy}
        disabled={!hasText}
        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50"
      >
        📋 {copyOk ? "Copied!" : "Copy Transcript"}
      </button>
      <button
        onClick={handleTxt}
        disabled={!hasText}
        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50"
      >
        📄 Download TXT
      </button>
      <button
        onClick={handleCsv}
        disabled={!hasText}
        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50"
      >
        📑 Download CSV
      </button>
      <SummaryButton onSummary={onSummary} summary={summary} />
    </div>
  );
}

function SummaryButton({ onSummary, summary }: { onSummary?: () => Promise<string | undefined>, summary?: string }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const click = async () => {
    if (!onSummary) return;
    setLoading(true);
    await onSummary();
    setLoading(false);
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={click}
        className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-semibold hover:bg-[#00c4e5]"
      >
        🤖 {loading ? "Generating..." : "AI Summary"}
      </button>

      {open && summary && (
        <div className="col-span-full bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-gray-300 mb-2">AI Summary</p>
          <p className="text-gray-100 leading-7">{summary}</p>
        </div>
      )}
    </>
  );
}
