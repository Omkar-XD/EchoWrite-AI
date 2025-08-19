import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export type TranscriptDoc = {
  userId: string;
  videoId: string;
  videoUrl: string;
  title?: string;
  thumbnail?: string;
  language?: string;
  transcript: string;   // always free layer
  createdAt?: any;
};

// ✅ Save transcript (Free Layer)
export async function saveTranscript(doc: Omit<TranscriptDoc, "createdAt">) {
  try {
    await addDoc(collection(db, "transcriptions"), {
      ...doc,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("❌ Error saving transcript:", err);
    return false;
  }
}

// ✅ List transcripts by user (Free Layer)
export async function listTranscriptsByUser(userId: string) {
  const q = query(
    collection(db, "transcriptions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as TranscriptDoc),
  }));
}
