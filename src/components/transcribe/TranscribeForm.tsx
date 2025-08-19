"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { parseYouTubeId } from "@/lib/transcribe-utils";

type Props = {
  onTranscribe: (url: string) => Promise<void>;
};

export default function TranscribeForm({ onTranscribe }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // prevent double-submit
    setError("");

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("❌ Please paste a YouTube link");
      return;
    }

    const id = parseYouTubeId(trimmedUrl);
    if (!id) {
      setError("❌ Please enter a valid YouTube URL");
      return;
    }

    try {
      setLoading(true);
      await onTranscribe(trimmedUrl);
    } catch (err: any) {
      setError(err?.message || "Something went wrong while transcribing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur"
    >
      <label
        htmlFor="youtube-url"
        className="block text-sm text-gray-300 mb-2"
      >
        📥 Paste your YouTube video link
      </label>

      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          id="youtube-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=example"
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                     text-white placeholder-gray-400 focus:outline-none 
                     focus:border-[#00E5FF]"
          aria-label="YouTube video URL"
          autoComplete="off"
          spellCheck={false}
          inputMode="url"
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md
            ${
              loading
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-[#00E5FF] text-black hover:bg-[#00c4e5] shadow-[#00E5FF]/40 hover:shadow-[#00E5FF]/80"
            }`}
          aria-busy={loading}
        >
          {loading ? "Processing..." : "Transcribe"}
        </motion.button>
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </motion.form>
  );
}
