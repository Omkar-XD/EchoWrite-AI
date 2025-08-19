import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { franc } from "franc-min";
import langs from "langs";

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptArray || transcriptArray.length === 0) {
      return NextResponse.json({ transcript: null, language: "Unknown" });
    }

    const transcript =
      transcriptArray.map((item) => item.text).join(" ").trim() || null;

    let language = "Unknown";
    if (transcript && transcript.length > 20) {
      const langCode = franc(transcript, { minLength: 10 });
      if (langCode && langCode !== "und") {
        const info = langs.where("3", langCode);
        if (info) language = info.name;
      }
    }

    return NextResponse.json({ transcript, language });
  } catch (err) {
    console.error("Transcript fetch error:", err);
    return NextResponse.json(
      { transcript: null, language: "Unknown" },
      { status: 200 }
    );
  }
}
