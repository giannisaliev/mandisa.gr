"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type MenuFormState = { error?: string };

export async function createMenuItemAction(_prev: MenuFormState, formData: FormData): Promise<MenuFormState> {
  const label = String(formData.get("label") ?? "").trim();
  const pageId = String(formData.get("pageId") ?? "").trim();
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();
  const parentId = String(formData.get("parentId") ?? "").trim();
  const openNewTab = formData.get("openNewTab") === "on";

  if (!label) return { error: "Ο τίτλος είναι υποχρεωτικός." };
  if (!pageId && !externalUrl) return { error: "Επιλέξτε σελίδα ή εισάγετε εξωτερικό link." };

  const count = await prisma.menuItem.count({ where: { parentId: parentId || null } });

  await prisma.menuItem.create({
    data: {
      label,
      order: count,
      pageId: pageId || null,
      externalUrl: pageId ? null : externalUrl,
      parentId: parentId || null,
      openNewTab,
    },
  });

  revalidatePath("/", "layout");
  return {};
}

export async function deleteMenuItemAction(id: string) {
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function moveMenuItemAction(id: string, direction: "up" | "down") {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return;

  const siblings = await prisma.menuItem.findMany({
    where: { parentId: item.parentId },
    orderBy: { order: "asc" },
  });
  const index = siblings.findIndex((s) => s.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= siblings.length) return;

  const a = siblings[index];
  const b = siblings[swapWith];

  await prisma.$transaction([
    prisma.menuItem.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.menuItem.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePath("/", "layout");
}
