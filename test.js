import { YoutubeTranscript } from "youtube-transcript";

const videoId = "dQw4w9WgXcQ"; // replace with your YouTube videoId

YoutubeTranscript.fetchTranscript(videoId)
  .then(data => {
    console.log("✅ Transcript fetched:", data.slice(0, 5)); // show first 5 items
  })
  .catch(err => {
    console.error("❌ Failed:", err);
  });
