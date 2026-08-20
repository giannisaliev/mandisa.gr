import { notFound } from "next/navigation";
import { getHomePage } from "@/lib/content";
import { BlockList } from "@/components/blocks/BlockRenderer";

export default async function HomePage() {
  const page = await getHomePage();
  if (!page || !page.published) notFound();

  return <BlockList blocks={page.blocks} />;
}
