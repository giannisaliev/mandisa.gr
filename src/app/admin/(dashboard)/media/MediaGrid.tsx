"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Trash2, Video } from "lucide-react";
import { deleteMediaAction } from "@/lib/actions/media";

type Asset = {
  id: string;
  url: string;
  filename: string;
  kind: string;
};

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-xs font-medium text-neutral-800 shadow hover:bg-white"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Έγινε" : "URL"}
    </button>
  );
}

export function MediaGrid({ assets }: { assets: Asset[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {assets.map((asset) => (
        <div key={asset.id} className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="relative aspect-square bg-neutral-100">
            {asset.kind === "video" ? (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                <Video size={28} />
              </div>
            ) : (
              <Image src={asset.url} alt={asset.filename} fill sizes="200px" className="object-cover" />
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
            <CopyButton url={asset.url} />
            <form action={deleteMediaAction.bind(null, asset.id)}>
              <button type="submit" className="rounded bg-white/90 p-1.5 text-red-600 shadow hover:bg-white" aria-label="Διαγραφή">
                <Trash2 size={12} />
              </button>
            </form>
          </div>
          <p className="truncate px-2 py-1.5 text-xs text-neutral-500">{asset.filename}</p>
        </div>
      ))}
    </div>
  );
}
