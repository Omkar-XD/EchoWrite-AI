import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 🔹 Prompt templates for different actions
const PROMPTS: Record<string, (input: string, lang?: string) => string> = {
  summary: (t) =>
    `Summarize the following transcript in 6-10 bullet points. Keep it concise and clear:\n\n${t}`,
  keywords: (t) =>
    `Extract 10-15 topical keywords/phrases from this transcript, comma-separated:\n\n${t}`,
  notes: (t) =>
    `Create study notes with headings and bullet points based on this transcript:\n\n${t}`,
  translate: (t, lang = "English") =>
    `Translate this transcript into clear, natural ${lang}. Preserve meaning:\n\n${t}`,
};

export async function POST(req: Request) {
  try {
    const { action = "free", text, targetLang } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No input text provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build final prompt
    let finalPrompt: string;
    if (action === "translate") {
      finalPrompt = PROMPTS.translate(text, targetLang);
    } else if (action === "free") {
      finalPrompt = text;
    } else {
      finalPrompt = PROMPTS[action]?.(text) ?? text;
    }

    // Call Gemini
    const result = await model.generateContent(finalPrompt);
    const content = result.response.text();

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Gemini request failed" },
      { status: 500 }
    );
  }
}
