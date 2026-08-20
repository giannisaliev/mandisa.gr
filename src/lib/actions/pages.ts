"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { BLOCK_TYPES, defaultBlockData, type BlockType } from "@/lib/blocks";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type PageFormState = { error?: string };

export async function createPageAction(_prev: PageFormState, formData: FormData): Promise<PageFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);

  if (!title) return { error: "Ο τίτλος είναι υποχρεωτικός." };
  if (!slug) return { error: "Το slug είναι υποχρεωτικό." };
  if (slug === "admin" || slug.startsWith("admin/")) return { error: "Μη έγκυρο slug." };

  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    return { error: `Υπάρχει ήδη σελίδα με slug "${slug}".` };
  }

  const page = await prisma.page.create({
    data: { title, slug, published: false },
  });

  revalidatePath("/[slug]", "page");
  redirect(`/admin/pages/${page.id}`);
}

export async function updatePageMetaAction(pageId: string, _prev: PageFormState, formData: FormData): Promise<PageFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? ""));
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) return { error: "Ο τίτλος είναι υποχρεωτικός." };
  if (!slug) return { error: "Το slug είναι υποχρεωτικό." };

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) return { error: "Η σελίδα δεν βρέθηκε." };

  if (slug !== page.slug) {
    const clash = await prisma.page.findUnique({ where: { slug } });
    if (clash) return { error: `Υπάρχει ήδη σελίδα με slug "${slug}".` };
  }

  await prisma.page.update({
    where: { id: pageId },
    data: { title, slug, metaDescription: metaDescription || null, published },
  });

  revalidatePath("/[slug]", "page");
  revalidatePath("/");
  return {};
}

export async function deletePageAction(pageId: string) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page || page.isHome) return;
  await prisma.page.delete({ where: { id: pageId } });
  revalidatePath("/[slug]", "page");
  redirect("/admin/pages");
}

export async function addBlockAction(pageId: string, formData: FormData) {
  const type = String(formData.get("type") ?? "") as BlockType;
  if (!BLOCK_TYPES.includes(type)) return;

  const count = await prisma.block.count({ where: { pageId } });
  const block = await prisma.block.create({
    data: {
      pageId,
      type,
      order: count,
      data: JSON.stringify(defaultBlockData(type)),
    },
  });

  revalidatePath("/[slug]", "page");
  revalidatePath("/");
  redirect(`/admin/pages/${pageId}/blocks/${block.id}`);
}

export async function deleteBlockAction(pageId: string, blockId: string) {
  await prisma.block.delete({ where: { id: blockId } });
  revalidatePath("/[slug]", "page");
  revalidatePath("/");
  redirect(`/admin/pages/${pageId}`);
}

export async function moveBlockAction(pageId: string, blockId: string, direction: "up" | "down") {
  const blocks = await prisma.block.findMany({ where: { pageId }, orderBy: { order: "asc" } });
  const index = blocks.findIndex((b) => b.id === blockId);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= blocks.length) return;

  const a = blocks[index];
  const b = blocks[swapWith];

  await prisma.$transaction([
    prisma.block.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.block.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePath("/[slug]", "page");
  revalidatePath("/");
  redirect(`/admin/pages/${pageId}`);
}

