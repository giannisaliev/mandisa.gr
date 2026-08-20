"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageCarouselData } from "@/lib/blocks";

export function ImageCarousel({ data }: { data: ImageCarouselData }) {
  const [index, setIndex] = useState(0);
  const count = data.images.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel md:aspect-[16/9]">
        {data.images.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <Image
              src={img.url}
              alt={img.alt || ""}
              fill
              sizes="(min-width: 768px) 900px, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setIndex((i) => (i + 1) % count)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {data.images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-accent" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
