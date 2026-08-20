import Image from "next/image";
import Link from "next/link";
import type { ImageWithTextData } from "@/lib/blocks";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function ImageWithText({ data }: { data: ImageWithTextData }) {
  const reverse = data.imagePosition === "right";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? "" : ""}`}>
        <div className={reverse ? "md:order-2" : ""}>
          {data.imageUrl && (
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={data.imageUrl}
                alt={data.imageAlt || ""}
                fill
                sizes="(min-width: 768px) 500px, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
        <div className={reverse ? "md:order-1" : ""}>
          {data.heading && (
            <h3 className="font-display mb-5 text-2xl text-white md:text-3xl">{data.heading}</h3>
          )}
          <div className="space-y-4">
            {data.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-white/85">
                {p}
              </p>
            ))}
          </div>
          {data.button && (
            <div className="mt-6">
              {isExternal(data.button.href) ? (
                <a
                  href={data.button.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-white bg-white px-7 py-3 text-sm tracking-widest text-black uppercase transition-colors hover:bg-black hover:text-white"
                >
                  {data.button.label}
                </a>
              ) : (
                <Link
                  href={data.button.href}
                  className="inline-flex items-center border border-white bg-white px-7 py-3 text-sm tracking-widest text-black uppercase transition-colors hover:bg-black hover:text-white"
                >
                  {data.button.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
