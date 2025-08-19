// src/app/api/transcribe/route.ts
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { franc } from "franc-min";
import langs from "langs";

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json(
        { transcript: null, language: "Unknown", reason: "Missing videoId" },
        { status: 400 }
      );
    }

    let transcriptArray: { text: string }[] = [];
    let fetched = false;

    console.log("🎬 Fetching transcript for:", videoId);

    // ✅ Multi-language fallback for English captions
    const fallbackLangs = ["en", "en-US", "en-GB", "en-CA", "en-AU"];
    for (const lang of fallbackLangs) {
      try {
        transcriptArray = await YoutubeTranscript.fetchTranscript(videoId, { lang });
        console.log(`✅ Fetched transcript using lang: ${lang}`);
        fetched = true;
        break;
      } catch (err) {
        console.warn(`⚠️ Failed to fetch transcript with lang ${lang}`);
      }
    }

    // If no fallback worked, try default (auto-detect)
    if (!fetched) {
      try {
        transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
        console.log("✅ Fetched transcript using default language");
        fetched = true;
      } catch (err) {
        console.error("⚠️ Failed to fetch transcript with default language", err);
      }
    }

    // If still no transcript, return early
    if (!transcriptArray || transcriptArray.length === 0) {
      return NextResponse.json(
        {
          transcript: null,
          language: "Unknown",
          reason: "No captions found (try another video with CC)",
        },
        { status: 200 }
      );
    }

    // Combine transcript into a single string
    const transcript = transcriptArray.map((i) => i.text).join(" ").trim() || null;

    // Detect language
    let language = "Unknown";
    if (transcript && transcript.length > 20) {
      const code = franc(transcript, { minLength: 10 });
      if (code && code !== "und") {
        const info = langs.where("3", code);
        if (info) language = info.name;
      }
    }

    return NextResponse.json({ transcript, language, reason: "Success" });
  } catch (err) {
    console.error("Transcript fetch error:", err);
    return NextResponse.json(
      {
        transcript: null,
        language: "Unknown",
        reason: "Server error",
      },
      { status: 200 }
    );
  }
}
