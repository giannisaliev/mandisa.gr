import type { VideoGridData } from "@/lib/blocks";
import { YouTubeFacade } from "@/components/blocks/YouTubeFacade";

export function VideoGrid({ data }: { data: VideoGridData }) {
  if (data.items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <div key={i} className="flex flex-col gap-3">
            <YouTubeFacade youtubeId={item.youtubeId} title={item.label} />
            <h4 className="font-display text-center text-lg text-white">{item.label}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
