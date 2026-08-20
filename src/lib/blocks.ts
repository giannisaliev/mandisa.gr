export type ButtonData = { label: string; href: string };
export type TabItem = { label: string; paragraphs: string[]; youtubeId: string };
export type VideoItem = { label: string; youtubeId: string };

export interface HeroData {
  heading: string;
  subheading: string;
  videoUrl: string;
  imageUrl: string;
  buttons: ButtonData[];
}

export interface HeadingData {
  text: string;
  level: "h1" | "h2" | "h3" | "h4";
  align: "left" | "center" | "right";
  variant: "display" | "normal";
}

export interface RichTextData {
  paragraphs: string[];
}

export interface ImageWithTextData {
  imageUrl: string;
  imageAlt: string;
  heading: string;
  paragraphs: string[];
  button: ButtonData | null;
  imagePosition: "left" | "right";
}

export interface ButtonRowData {
  buttons: ButtonData[];
  align: "left" | "center" | "right";
}

export interface ImageCarouselData {
  images: { url: string; alt: string }[];
}

export interface VideoGridData {
  items: VideoItem[];
}

export interface TabsVideoData {
  items: TabItem[];
}

export interface MapLocationData {
  heading: string;
  address: string;
  mapQuery: string;
}

export interface ContactFormData {
  heading: string;
  note: string;
}

export interface SpacerData {
  size: "sm" | "md" | "lg";
}

export const BLOCK_TYPES = [
  "hero",
  "heading",
  "richtext",
  "imageWithText",
  "buttonRow",
  "imageCarousel",
  "videoGrid",
  "tabsVideo",
  "mapLocation",
  "contactForm",
  "spacer",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero (video/image banner)",
  heading: "Heading",
  richtext: "Text paragraphs",
  imageWithText: "Image + text",
  buttonRow: "Buttons",
  imageCarousel: "Image carousel",
  videoGrid: "Video grid",
  tabsVideo: "Tabs with video",
  mapLocation: "Map + address",
  contactForm: "Contact form",
  spacer: "Spacer",
};

export function defaultBlockData(type: BlockType): unknown {
  switch (type) {
    case "hero":
      return { heading: "", subheading: "", videoUrl: "", imageUrl: "", buttons: [] } satisfies HeroData;
    case "heading":
      return { text: "", level: "h2", align: "center", variant: "display" } satisfies HeadingData;
    case "richtext":
      return { paragraphs: [] } satisfies RichTextData;
    case "imageWithText":
      return {
        imageUrl: "",
        imageAlt: "",
        heading: "",
        paragraphs: [],
        button: null,
        imagePosition: "left",
      } satisfies ImageWithTextData;
    case "buttonRow":
      return { buttons: [], align: "center" } satisfies ButtonRowData;
    case "imageCarousel":
      return { images: [] } satisfies ImageCarouselData;
    case "videoGrid":
      return { items: [] } satisfies VideoGridData;
    case "tabsVideo":
      return { items: [] } satisfies TabsVideoData;
    case "mapLocation":
      return { heading: "", address: "", mapQuery: "" } satisfies MapLocationData;
    case "contactForm":
      return { heading: "Επικοινωνία", note: "" } satisfies ContactFormData;
    case "spacer":
      return { size: "md" } satisfies SpacerData;
  }
}

export function parseBlockData<T>(json: string): T {
  return JSON.parse(json) as T;
}

export function blockPreview(type: string, json: string): string {
  try {
    const data = JSON.parse(json) as Record<string, unknown>;
    switch (type) {
      case "hero":
        return String(data.heading || "(χωρίς τίτλο)");
      case "heading":
        return String(data.text || "(κενό)");
      case "richtext":
        return String((data.paragraphs as string[])?.[0] ?? "(κενό)").slice(0, 80);
      case "imageWithText":
        return String(data.heading || (data.paragraphs as string[])?.[0] || "(κενό)").slice(0, 80);
      case "buttonRow":
        return (data.buttons as { label: string }[])?.map((b) => b.label).join(", ") || "(χωρίς κουμπιά)";
      case "imageCarousel":
        return `${(data.images as unknown[])?.length ?? 0} εικόνες`;
      case "videoGrid":
        return `${(data.items as unknown[])?.length ?? 0} βίντεο`;
      case "tabsVideo":
        return `${(data.items as unknown[])?.length ?? 0} καρτέλες`;
      case "mapLocation":
        return String(data.heading || "(κενό)");
      case "contactForm":
        return String(data.heading || "Φόρμα επικοινωνίας");
      case "spacer":
        return `Μέγεθος: ${data.size}`;
      default:
        return "";
    }
  } catch {
    return "";
  }
}

/** Parses "label | href" per line into ButtonData[]. */
export function parseButtonLines(raw: string): ButtonData[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", href: href ?? "#" };
    })
    .filter((b) => b.label);
}

export function buttonsToLines(buttons: ButtonData[]): string {
  return buttons.map((b) => `${b.label} | ${b.href}`).join("\n");
}

/** Parses "label | youtubeId" per line into VideoItem[]. */
export function parseVideoLines(raw: string): VideoItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, youtubeId] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", youtubeId: extractYoutubeId(youtubeId ?? "") };
    })
    .filter((v) => v.label && v.youtubeId);
}

export function videosToLines(items: VideoItem[]): string {
  return items.map((v) => `${v.label} | ${v.youtubeId}`).join("\n");
}

export function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{6,})/);
  if (match) return match[1];
  return trimmed;
}

/**
 * Encodes tabs as blocks separated by a line of "---". Within each block:
 * line 1 = tab label, line 2 = YouTube URL/ID, remaining lines (separated
 * by a blank line) = paragraphs.
 */
export function tabsToText(items: TabItem[]): string {
  return items
    .map((t) => [t.label, t.youtubeId, ...t.paragraphs].join("\n"))
    .join("\n---\n");
}

export function textToTabs(raw: string): TabItem[] {
  return raw
    .split(/\n-{3,}\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split("\n");
      const label = (lines[0] ?? "").trim();
      const youtubeId = extractYoutubeId((lines[1] ?? "").trim());
      const rest = lines.slice(2).join("\n");
      return { label, youtubeId, paragraphs: textToParagraphs(rest) };
    })
    .filter((t) => t.label);
}

export function paragraphsToText(paragraphs: string[]): string {
  return paragraphs.join("\n\n");
}

export function textToParagraphs(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
