"use client";

import { useState } from "react";
import type { TabsVideoData } from "@/lib/blocks";
import { YouTubeFacade } from "@/components/blocks/YouTubeFacade";

export function TabsVideo({ data }: { data: TabsVideoData }) {
  const [active, setActive] = useState(0);
  if (data.items.length === 0) return null;
  const current = data.items[active];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {data.items.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 border-l-2 px-4 py-3 text-left text-sm tracking-wide uppercase transition-colors ${
                i === active
                  ? "border-accent bg-panel text-accent"
                  : "border-transparent text-white/70 hover:border-white/30 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <YouTubeFacade youtubeId={current.youtubeId} title={current.label} />
          <div className="space-y-4">
            {current.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-white/85">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
