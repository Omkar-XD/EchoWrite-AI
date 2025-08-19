// src/lib/transcripts.ts
import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  DocumentData,
} from "firebase/firestore";
import type { TranscriptDoc, AIResult } from "@/types/transcript";

// 🔹 Save a transcript
export async function saveTranscript(doc: TranscriptDoc): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "transcriptions"), {
      ...doc,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error("Error saving transcript:", error);
    throw error;
  }
}

// 🔹 List transcripts for a specific user
export async function listTranscriptsByUser(userId: string) {
  try {
    const q = query(
      collection(db, "transcriptions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as DocumentData),
    })) as (TranscriptDoc & { id: string })[];
  } catch (error) {
    console.error("Error fetching transcripts:", error);
    throw error;
  }
}

// ===============================
// 🔹 AI Results (subcollection)
// ===============================

// Save an AI result under a transcript
export async function saveAIResult(
  transcriptId: string,
  result: Omit<AIResult, "id" | "transcriptId" | "createdAt">
): Promise<string> {
  try {
    const col = collection(db, "transcriptions", transcriptId, "aiResults");
    const ref = await addDoc(col, {
      ...result,
      transcriptId,
      createdAt: Date.now(),
    });
    return ref.id;
  } catch (error) {
    console.error("Error saving AI result:", error);
    throw error;
  }
}

// List AI results for a transcript
export async function listAIResults(transcriptId: string): Promise<AIResult[]> {
  try {
    const col = collection(db, "transcriptions", transcriptId, "aiResults");
    const snap = await getDocs(query(col, orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as AIResult),
    }));
  } catch (error) {
    console.error("Error fetching AI results:", error);
    throw error;
  }
}
