// src/lib/gemini.ts
import type { AIAction } from "@/types/transcript";

// 🔹 Run specific AI actions
export async function summarizeTranscript(transcript: string) {
  return runGeminiAction("summary", transcript);
}

export async function extractKeywords(transcript: string) {
  return runGeminiAction("keywords", transcript);
}

export async function makeStudyNotes(transcript: string) {
  return runGeminiAction("notes", transcript);
}

export async function translateToEnglish(transcript: string) {
  return runGeminiAction("translate", transcript, "English");
}

// 🔹 Generic Gemini API caller with improved error handling
async function runGeminiAction(
  action: AIAction,
  text: string,
  targetLang?: string
): Promise<string> {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, text, targetLang }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Gemini API HTTP error: ${res.status} - ${errText}`);
      return `⚠️ Gemini API request failed for "${action}" with status ${res.status}.`;
    }

    const data: { content?: string; error?: string } = await res.json();

    if (data.error) {
      console.error(`Gemini API returned error for "${action}":`, data.error);
      return `⚠️ Gemini failed for "${action}": ${data.error}`;
    }

    if (!data.content) {
      console.warn(`Gemini API returned empty content for "${action}"`);
      return `⚠️ Gemini returned no content for "${action}".`;
    }

    return data.content;
  } catch (err: any) {
    console.error(`Gemini action "${action}" failed:`, err);
    return `⚠️ Gemini action "${action}" encountered an error. Please try again.`;
  }
}
