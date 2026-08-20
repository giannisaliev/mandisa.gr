import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { BlockList } from "@/components/blocks/BlockRenderer";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription ?? undefined,
  };
}

export default async function CmsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page || !page.published) notFound();

  return (
    <>
      {page.blocks.length === 0 && (
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h1 className="font-display text-3xl text-white">{page.title}</h1>
          <p className="mt-4 text-white/60">Αυτή η σελίδα δεν έχει ακόμα περιεχόμενο.</p>
        </div>
      )}
      <BlockList blocks={page.blocks} />
    </>
  );
}
