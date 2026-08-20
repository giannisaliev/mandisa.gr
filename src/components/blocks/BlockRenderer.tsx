import { Hero } from "@/components/blocks/Hero";
import { Heading } from "@/components/blocks/Heading";
import { RichText } from "@/components/blocks/RichText";
import { ImageWithText } from "@/components/blocks/ImageWithText";
import { ButtonRow } from "@/components/blocks/ButtonRow";
import { ImageCarousel } from "@/components/blocks/ImageCarousel";
import { VideoGrid } from "@/components/blocks/VideoGrid";
import { TabsVideo } from "@/components/blocks/TabsVideo";
import { MapLocation } from "@/components/blocks/MapLocation";
import { ContactForm } from "@/components/blocks/ContactForm";
import { Spacer } from "@/components/blocks/Spacer";
import type {
  HeroData,
  HeadingData,
  RichTextData,
  ImageWithTextData,
  ButtonRowData,
  ImageCarouselData,
  VideoGridData,
  TabsVideoData,
  MapLocationData,
  ContactFormData,
  SpacerData,
} from "@/lib/blocks";

export type BlockRecord = {
  id: string;
  type: string;
  data: string;
};

export function BlockRenderer({ block }: { block: BlockRecord }) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(block.data);
  } catch {
    return null;
  }

  switch (block.type) {
    case "hero":
      return <Hero data={parsed as HeroData} />;
    case "heading":
      return <Heading data={parsed as HeadingData} />;
    case "richtext":
      return <RichText data={parsed as RichTextData} />;
    case "imageWithText":
      return <ImageWithText data={parsed as ImageWithTextData} />;
    case "buttonRow":
      return <ButtonRow data={parsed as ButtonRowData} />;
    case "imageCarousel":
      return <ImageCarousel data={parsed as ImageCarouselData} />;
    case "videoGrid":
      return <VideoGrid data={parsed as VideoGridData} />;
    case "tabsVideo":
      return <TabsVideo data={parsed as TabsVideoData} />;
    case "mapLocation":
      return <MapLocation data={parsed as MapLocationData} />;
    case "contactForm":
      return <ContactForm data={parsed as ContactFormData} />;
    case "spacer":
      return <Spacer data={parsed as SpacerData} />;
    default:
      return null;
  }
}

export function BlockList({ blocks }: { blocks: BlockRecord[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}
