import Link from "next/link";
import type { ButtonRowData } from "@/lib/blocks";

const alignClass: Record<ButtonRowData["align"], string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function ButtonRow({ data }: { data: ButtonRowData }) {
  if (data.buttons.length === 0) return null;

  return (
    <div className={`mx-auto flex max-w-3xl flex-wrap gap-4 px-6 py-6 ${alignClass[data.align]}`}>
      {data.buttons.map((btn, i) => {
        const external = isExternal(btn.href);
        const className =
          "inline-flex items-center border border-white bg-white px-7 py-3 text-sm tracking-widest text-black uppercase transition-colors duration-200 hover:bg-black hover:text-white";
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
  );
}
