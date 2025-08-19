"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  title?: string;
  thumbnailUrl?: string;
  language?: string;
  loading?: boolean;
};

export default function VideoDetails({ title, thumbnailUrl, language, loading }: Props) {
  if (!title && !thumbnailUrl && !language && !loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 w-full bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-white/10 border border-white/10">
        {loading ? (
          <div className="w-full h-full animate-pulse bg-gray-700/40" />
        ) : thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title ? `Thumbnail for ${title}` : "Video thumbnail"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
            No thumbnail available
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400">🎬 Video Title</p>
        {loading ? (
          <div className="h-5 w-2/3 rounded-md animate-pulse bg-gray-700/40" />
        ) : (
          <h3 className="text-lg font-semibold text-white">
            {title || "Untitled video"}
          </h3>
        )}

        <p className="text-sm text-gray-400">
          Detected Language:{" "}
          {loading ? (
            <span className="inline-block h-4 w-16 rounded-md animate-pulse bg-gray-700/40" />
          ) : (
            <span className="text-white">{language || "Unknown"}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
