import type { HeadingData } from "@/lib/blocks";

const alignClass: Record<HeadingData["align"], string> = {
  left: "text-left",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
};

const sizeClass: Record<HeadingData["level"], string> = {
  h1: "text-4xl md:text-6xl",
  h2: "text-3xl md:text-5xl",
  h3: "text-2xl md:text-3xl",
  h4: "text-xl md:text-2xl",
};

export function Heading({ data }: { data: HeadingData }) {
  const Tag = data.level;
  const fontClass = data.variant === "display" ? "font-display" : "font-sans font-light";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Tag
        className={`text-balance-pretty ${sizeClass[data.level]} ${fontClass} ${alignClass[data.align]} max-w-3xl text-white`}
      >
        {data.text}
      </Tag>
    </div>
  );
}
