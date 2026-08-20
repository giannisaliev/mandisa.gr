import type { RichTextData } from "@/lib/blocks";

export function RichText({ data }: { data: RichTextData }) {
  if (data.paragraphs.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="space-y-5">
        {data.paragraphs.map((p, i) => (
          <p key={i} className="text-balance-pretty text-base leading-relaxed text-white/85 md:text-lg">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
