import type { MapLocationData } from "@/lib/blocks";

export function MapLocation({ data }: { data: MapLocationData }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(data.mapQuery)}&t=m&z=13&output=embed&iwloc=near`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display mb-2 text-2xl text-white">{data.heading}</h3>
          <p className="text-white/80">{data.address}</p>
        </div>
        <div className="aspect-video w-full overflow-hidden border border-white/10 grayscale invert-[0.92] contrast-[1.05]">
          <iframe
            src={src}
            title={data.heading}
            loading="lazy"
            className="h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
