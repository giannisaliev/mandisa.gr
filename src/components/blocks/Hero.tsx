import Link from "next/link";
import type { HeroData } from "@/lib/blocks";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function Hero({ data }: { data: HeroData }) {
  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-black">
      {data.videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={data.videoUrl}
          poster={data.imageUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : data.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/40" />

      <div className="fade-up relative mx-auto max-w-3xl px-6 py-24 text-center">
        {data.heading && (
          <h1 className="font-display text-balance-pretty text-4xl text-white italic md:text-6xl">
            {data.heading}
          </h1>
        )}
        {data.subheading && (
          <p className="mt-6 text-balance-pretty text-base text-white/85 md:text-lg">{data.subheading}</p>
        )}
        {data.buttons.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {data.buttons.map((btn, i) => {
              const external = isExternal(btn.href);
              const className =
                "inline-flex items-center border border-white px-8 py-3 text-sm tracking-widest text-white uppercase transition-colors duration-200 hover:bg-white hover:text-black";
              return external ? (
                <a key={i} href={btn.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {btn.label}
                </a>
              ) : (
                <Link key={i} href={btn.href} className={className}>
                  {btn.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
