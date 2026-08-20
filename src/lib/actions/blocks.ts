"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  parseButtonLines,
  parseVideoLines,
  textToParagraphs,
  textToTabs,
  type HeroData,
  type HeadingData,
  type RichTextData,
  type ImageWithTextData,
  type ButtonRowData,
  type ImageCarouselData,
  type VideoGridData,
  type TabsVideoData,
  type MapLocationData,
  type ContactFormData,
  type SpacerData,
} from "@/lib/blocks";

async function saveBlock(pageId: string, blockId: string, data: unknown) {
  await prisma.block.update({ where: { id: blockId }, data: { data: JSON.stringify(data) } });
  revalidatePath("/[slug]", "page");
  revalidatePath("/");
  redirect(`/admin/pages/${pageId}`);
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function updateHeroBlock(pageId: string, blockId: string, formData: FormData) {
  const data: HeroData = {
    heading: str(formData, "heading"),
    subheading: str(formData, "subheading"),
    videoUrl: str(formData, "videoUrl"),
    imageUrl: str(formData, "imageUrl"),
    buttons: parseButtonLines(str(formData, "buttons")),
  };
  await saveBlock(pageId, blockId, data);
}

export async function updateHeadingBlock(pageId: string, blockId: string, formData: FormData) {
  const data: HeadingData = {
    text: str(formData, "text"),
    level: str(formData, "level") as HeadingData["level"],
    align: str(formData, "align") as HeadingData["align"],
    variant: str(formData, "variant") as HeadingData["variant"],
  };
  await saveBlock(pageId, blockId, data);
}

export async function updateRichTextBlock(pageId: string, blockId: string, formData: FormData) {
  const data: RichTextData = { paragraphs: textToParagraphs(str(formData, "paragraphs")) };
  await saveBlock(pageId, blockId, data);
}

export async function updateImageWithTextBlock(pageId: string, blockId: string, formData: FormData) {
  const buttonLabel = str(formData, "buttonLabel");
  const buttonHref = str(formData, "buttonHref");
  const data: ImageWithTextData = {
    imageUrl: str(formData, "imageUrl"),
    imageAlt: str(formData, "imageAlt"),
    heading: str(formData, "heading"),
    paragraphs: textToParagraphs(str(formData, "paragraphs")),
    button: buttonLabel ? { label: buttonLabel, href: buttonHref || "#" } : null,
    imagePosition: str(formData, "imagePosition") as ImageWithTextData["imagePosition"],
  };
  await saveBlock(pageId, blockId, data);
}

export async function updateButtonRowBlock(pageId: string, blockId: string, formData: FormData) {
  const data: ButtonRowData = {
    buttons: parseButtonLines(str(formData, "buttons")),
    align: str(formData, "align") as ButtonRowData["align"],
  };
  await saveBlock(pageId, blockId, data);
}

export async function updateImageCarouselBlock(pageId: string, blockId: string, formData: FormData) {
  const lines = str(formData, "images")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const data: ImageCarouselData = {
    images: lines.map((line) => {
      const [url, alt] = line.split("|").map((s) => s.trim());
      return { url: url ?? "", alt: alt ?? "" };
    }),
  };
  await saveBlock(pageId, blockId, data);
}

export async function updateVideoGridBlock(pageId: string, blockId: string, formData: FormData) {
  const data: VideoGridData = { items: parseVideoLines(str(formData, "items")) };
  await saveBlock(pageId, blockId, data);
}

export async function updateTabsVideoBlock(pageId: string, blockId: string, formData: FormData) {
  const data: TabsVideoData = { items: textToTabs(str(formData, "items")) };
  await saveBlock(pageId, blockId, data);
}

export async function updateMapLocationBlock(pageId: string, blockId: string, formData: FormData) {
  const data: MapLocationData = {
    heading: str(formData, "heading"),
    address: str(formData, "address"),
    mapQuery: str(formData, "mapQuery"),
  };
  await saveBlock(pageId, blockId, data);
}

export async function updateContactFormBlock(pageId: string, blockId: string, formData: FormData) {
  const data: ContactFormData = {
    heading: str(formData, "heading"),
    note: str(formData, "note"),
  };
  await saveBlock(pageId, blockId, data);
}

export async function updateSpacerBlock(pageId: string, blockId: string, formData: FormData) {
  const data: SpacerData = { size: str(formData, "size") as SpacerData["size"] };
  await saveBlock(pageId, blockId, data);
}
