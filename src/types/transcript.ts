// src/types/transcript.ts

// Existing type you already had
export type TranscribeResponse = {
  title: string;
  thumbnailUrl: string;
  language: string;
  transcript: string;        // original transcript (plain text)
  translated?: string;       // english translation (plain text)
  summary?: string;          // short AI summary
};

// New: AI actions we support
export type AIAction = 'summary' | 'notes' | 'keywords' | 'translate';

// New: Firestore transcript document
export interface TranscriptDoc {
  id?: string;
  userId: string;
  videoId: string;
  title: string;
  transcript: string;
  language?: string;
  createdAt: number; // Date.now()
}

// New: Firestore AI result document
export interface AIResult {
  id?: string;
  transcriptId: string;
  action: AIAction;
  content: string;
  targetLang?: string;
  model?: string;
  createdAt: number;
}
