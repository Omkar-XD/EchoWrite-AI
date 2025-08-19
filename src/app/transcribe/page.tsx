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
import { Timestamp } from "firebase/firestore";

// ---------- Types ----------
interface TranscriptSavePayload {
  userId: string;
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnail: string;
  language: string;
  transcript: string;
  createdAt: Timestamp;
}

interface NoEmbedResponse {
  title?: string;
}

// ---------- Helper ----------
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
  const [reason, setReason] = useState<string>("");

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

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  // Fetch video title
  async function fetchTitle(url: string) {
    try {
      const res = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(url)}`
      );
      const data: NoEmbedResponse = await res.json();
      if (data?.title) setTitle(data.title);
    } catch {
      // ignore
    }
  }

  // Transcribe
  async function handleTranscribe() {
    const id = getYouTubeId(videoUrl);
    setVideoId(id);
    setTranscript("");
    setReason("");

    if (!id) {
      setReason("❌ Invalid YouTube URL or ID");
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

      const data: { transcript?: string; language?: string; reason?: string } =
        await res.json();

      if (data?.transcript) {
        setTranscript(data.transcript);
        setLanguage(data.language || "Unknown");
        setReason(data.reason || "✅ Success");
      } else {
        setTranscript("");
        setLanguage("Unknown");
        setReason(data.reason || "⚠️ Transcript not available.");
      }
    } catch (err: unknown) {
      console.error(err);
      setTranscript("");
      setLanguage("Unknown");
      setReason("❌ Failed to fetch transcript (server error).");
    } finally {
      setBusy(false);
    }
  }

  // Summarize
  async function handleSummarize() {
    if (!transcript) return alert("Add or generate a transcript first.");
    setBusy(true);
    try {
      const result = await summarizeTranscript(transcript);
      setSummary(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gemini summarize failed");
      }
    } finally {
      setBusy(false);
    }
  }

  // Keywords
  async function handleKeywords() {
    if (!transcript) return alert("Add or generate a transcript first.");
    setBusy(true);
    try {
      const result = await extractKeywords(transcript);
      setKeywords(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gemini keywords failed");
      }
    } finally {
      setBusy(false);
    }
  }

  // Study Notes
  async function handleNotes() {
    if (!transcript) return alert("Add or generate a transcript first.");
    setBusy(true);
    try {
      const result = await makeStudyNotes(transcript);
      setNotes(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gemini notes failed");
      }
    } finally {
      setBusy(false);
    }
  }

  // Translate toggle
  async function handleTranslateToggle() {
    if (!transcript) return alert("Add or generate a transcript first.");
    const willTurnOn = !translateOn;
    setTranslateOn(willTurnOn);
    if (willTurnOn) {
      setBusy(true);
      try {
        const result = await translateToEnglish(transcript);
        setTranslated(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("Gemini translate failed");
        }
      } finally {
        setBusy(false);
      }
    }
  }

  // Helpers
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

  // Save
  async function handleSave() {
    if (!user) return alert("Please sign in.");
    if (!transcript) return alert("Nothing to save yet.");

    try {
      const payload: TranscriptSavePayload = {
        userId: user.uid,
        videoId: videoId || "",
        videoUrl,
        title,
        thumbnail,
        language,
        transcript: getActiveTranscript(),
        createdAt: Timestamp.now(),
      };
      await saveTranscript(payload);
      alert("Saved to your profile history!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to save");
      }
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
      {/* ... UI remains unchanged ... */}
    </section>
  );
}
