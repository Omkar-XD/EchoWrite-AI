// src/lib/transcribe-utils.ts

// Parse YouTube video ID
export function parseYouTubeId(input: string): string | null {
  try {
    const url = input.trim();

    if (!url.includes("/") && !url.includes("?") && !url.includes(" ")) {
      return url.length >= 10 ? url : null;
    }

    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const path = u.pathname.replace(/^\/+/, "");
      return path.split("/")[0] || null;
    }

    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        const first = parts[0];
        const second = parts[1];
        if (first === "shorts") return second;
        if (first === "embed") return second;
        if (first === "live") return second;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// ✅ Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Clipboard error:", err);
    return false;
  }
}

// ✅ Download a plain text file
export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ✅ Convert text (multiline) to CSV format
export function toCSV(text: string): string {
  return text
    .split("\n")
    .map((line) => `"${line.replace(/"/g, '""')}"`)
    .join("\n");
}
