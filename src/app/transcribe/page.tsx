// src/app/transcribe/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  summarizeTranscript,
  extractKeywords,
  makeStudyNotes,
  translateToEnglish,
} from "@/lib/gemini";
import { saveTranscript } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";

// ✅ Extract YouTube ID helper
function getYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{10,15}$/.test(trimmed)) return trimmed;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return u.pathname.replace(/^\/+/, "").split("/")[0] || null;
    }
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && ["shorts", "embed", "live"].includes(parts[0])) {
        return parts[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default function TranscribePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<string>("Unknown");
  const [reason, setReason] = useState<string>(""); // ✨ track API reason

  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [translateOn, setTranslateOn] = useState(false);

  const thumbnail = useMemo(
    () => (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ""),
    [videoId]
  );

  // ✅ Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  // ✅ Fetch video title
  async function fetchTitle(url: string) {
    try {
      const res = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();
      if (data?.title) setTitle(data.title);
    } catch {
      // ignore
    }
  }

  // ✅ Fetch transcript
  async function handleTranscribe() {
    const id = getYouTubeId(videoUrl);
    setVideoId(id);
    setTranscript("");
    setReason("");

    if (!id) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    await fetchTitle(videoUrl);

    setBusy(true);
    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: id }),
      });

      const data = await res.json();

      if (data?.transcript) {
        setTranscript(data.transcript);
        setLanguage(data.language || "Unknown");
        setReason(data.reason || "Success");
      } else {
        setTranscript("");
        setLanguage("Unknown");
        setReason(data.reason || "⚠️ Transcript not available.");
      }
    } catch (err) {
      console.error(err);
      setTranscript("");
      setLanguage("Unknown");
      setReason("❌ Failed to fetch transcript (server error).");
    } finally {
      setBusy(false);
    }
  }

  // ✅ Summarize
  async function handleSummarize() {
    if (!transcript) return alert("Add or generate a transcript first.");
    setBusy(true);
    try {
      const result = await summarizeTranscript(transcript);
      setSummary(result);
    } catch (e: any) {
      alert(e.message || "Gemini summarize failed");
    } finally {
      setBusy(false);
    }
  }

  // ✅ Keywords
  async function handleKeywords() {
    if (!transcript) return alert("Add or generate a transcript first.");
    setBusy(true);
    try {
      const result = await extractKeywords(transcript);
      setKeywords(result);
    } catch (e: any) {
      alert(e.message || "Gemini keywords failed");
    } finally {
      setBusy(false);
    }
  }

  // ✅ Study Notes
  async function handleNotes() {
    if (!transcript) return alert("Add or generate a transcript first.");
    setBusy(true);
    try {
      const result = await makeStudyNotes(transcript);
      setNotes(result);
    } catch (e: any) {
      alert(e.message || "Gemini notes failed");
    } finally {
      setBusy(false);
    }
  }

  // ✅ Translate toggle
  async function handleTranslateToggle() {
    if (!transcript) return alert("Add or generate a transcript first.");
    const willTurnOn = !translateOn;
    setTranslateOn(willTurnOn);
    if (willTurnOn) {
      setBusy(true);
      try {
        const result = await translateToEnglish(transcript);
        setTranslated(result);
      } catch (e: any) {
        alert(e.message || "Gemini translate failed");
      } finally {
        setBusy(false);
      }
    }
  }

  // ✅ Helpers
  function getActiveTranscript() {
    return translateOn && translated ? translated : transcript;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(getActiveTranscript());
  }
  function downloadText(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  function downloadCSV(filename: string) {
    const text = getActiveTranscript();
    const csv = text
      .split("\n")
      .map((l) => `"${l.replace(/"/g, '""')}"`)
      .join("\n");
    downloadText(filename, csv);
  }

  // ✅ Save
  async function handleSave() {
    if (!user) return alert("Please sign in.");
    if (!transcript) return alert("Nothing to save yet.");

    try {
      await saveTranscript({
        userId: user.uid,
        videoId: videoId || "",
        videoUrl,
        title,
        thumbnail,
        language,
        transcript: getActiveTranscript(),
      });
      alert("Saved to your profile history!");
    } catch (e: any) {
      alert(e.message || "Failed to save");
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-gray-300">
        Loading...
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0d1117] text-white px-6 py-16 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">
          YouTube Transcript & Study Tool
        </h1>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTranscribe}
            disabled={busy}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "Processing..." : "Fetch"}
          </button>
        </div>

        {/* Preview */}
        {videoId && (
          <div className="flex gap-4 items-center">
            <Image
              src={thumbnail}
              alt="Thumbnail"
              width={160}
              height={90}
              className="rounded-lg"
            />
            <div>
              <h2 className="font-semibold text-lg">{title || "Untitled Video"}</h2>
              <p className="text-sm text-gray-400">{language}</p>
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Transcript</h3>
          {reason && (
            <p className="text-sm text-gray-400">Status: {reason}</p> 
          )}
          <textarea
            value={getActiveTranscript()}
            onChange={(e) => {
              if (translateOn && translated) {
                setTranslated(e.target.value);
              } else {
                setTranscript(e.target.value);
              }
            }}
            rows={10}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700"
          />
          {!transcript && reason?.startsWith("⚠️") && (
            <p className="text-sm text-gray-400">
              Tip: Try another video with captions (CC) or use a standard watch/shorts/embed link.
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSummarize} className="px-3 py-1 bg-purple-600 rounded-lg hover:bg-purple-700">
              Summarize
            </button>
            <button onClick={handleKeywords} className="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-700">
              Keywords
            </button>
            <button onClick={handleNotes} className="px-3 py-1 bg-yellow-600 rounded-lg hover:bg-yellow-700">
              Study Notes
            </button>
            <button onClick={handleTranslateToggle} className="px-3 py-1 bg-pink-600 rounded-lg hover:bg-pink-700">
              {translateOn ? "Show Original" : "Translate"}
            </button>
            <button onClick={copyToClipboard} className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600">
              Copy
            </button>
            <button
              onClick={() => downloadText("transcript.txt", getActiveTranscript())}
              className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Download TXT
            </button>
            <button
              onClick={() => downloadCSV("transcript.csv")}
              className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Download CSV
            </button>
            <button onClick={handleSave} className="px-3 py-1 bg-blue-500 rounded-lg hover:bg-blue-600">
              Save
            </button>
          </div>
        </div>

        {/* Outputs */}
        {summary && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <p className="whitespace-pre-wrap bg-gray-900 p-4 rounded-lg">{summary}</p>
          </div>
        )}
        {keywords && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Keywords</h3>
            <p className="whitespace-pre-wrap bg-gray-900 p-4 rounded-lg">{keywords}</p>
          </div>
        )}
        {notes && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Study Notes</h3>
            <p className="whitespace-pre-wrap bg-gray-900 p-4 rounded-lg">{notes}</p>
          </div>
        )}
      </div>
    </section>
  );
}
