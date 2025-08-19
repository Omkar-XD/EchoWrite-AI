"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { listTranscriptsByUser } from "@/lib/firestore";  // <-- FIXED

type Item = {
  id: string;
  videoId: string;
  videoUrl: string;
  title?: string;
  thumbnail?: string;
  createdAt?: any;
};

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setBusy(true);
      try {
        const data = await listTranscriptsByUser(user.uid);
        setItems(data as Item[]);
      } finally {
        setBusy(false);
      }
    })();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading…</div>;
  }
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-300">Please sign in.</div>;
  }

  return (
    <section className="min-h-screen bg-[#0d1117] text-white px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-b from-[#00E5FF] to-[#007E92]">
        My Profile
      </h1>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* User card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <Image
            src={user.photoURL || "/assets/default-avatar.png"}
            alt="User"
            width={72}
            height={72}
            className="rounded-full border border-white/20"
          />
          <div className="flex-1">
            <div className="text-xl font-semibold">{user.displayName || "User"}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30"
          >
            Logout
          </button>
        </div>

        {/* History */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">History</h2>
          {busy ? (
            <div className="text-gray-300">Loading history…</div>
          ) : items.length === 0 ? (
            <div className="text-gray-400">No transcripts saved yet.</div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4 items-center">
                  {it.thumbnail ? (
                    <Image
                      src={it.thumbnail}
                      alt={it.title || it.videoId}
                      width={120}
                      height={68}
                      className="rounded border border-white/10"
                    />
                  ) : (
                    <div className="w-[120px] h-[68px] bg-black/30 rounded" />
                  )}

                  <div className="flex-1">
                    <div className="font-medium">{it.title || "Untitled video"}</div>
                    <div className="text-gray-400 text-sm">{it.videoUrl}</div>
                    <div className="text-gray-500 text-xs">
                      {it.createdAt?.toDate ? it.createdAt.toDate().toLocaleString() : ""}
                    </div>
                  </div>

                  <Link
                    href={`/transcribe?url=${encodeURIComponent(it.videoUrl)}`}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm"
                  >
                    🔗 View Transcript
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
