"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function YouTubeFacade({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-square w-full overflow-hidden bg-black md:aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerate-orientation-lock; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative aspect-square w-full overflow-hidden bg-panel md:aspect-video"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/50 text-white transition group-hover:scale-110 group-hover:border-accent group-hover:text-accent">
          <Play size={24} fill="currentColor" />
        </span>
      </span>
    </button>
  );
}
