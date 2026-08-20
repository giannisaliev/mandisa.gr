import type { SpacerData } from "@/lib/blocks";

const heightClass: Record<SpacerData["size"], string> = {
  sm: "h-8",
  md: "h-16",
  lg: "h-28",
};

export function Spacer({ data }: { data: SpacerData }) {
  return <div className={heightClass[data.size]} aria-hidden="true" />;
}
