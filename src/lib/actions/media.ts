"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveUploadedFile } from "@/lib/storage";

export type MediaFormState = { error?: string };

export async function uploadMediaAction(_prev: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: "Επιλέξτε τουλάχιστον ένα αρχείο." };

  for (const file of files) {
    const { url, filename } = await saveUploadedFile(file);
    await prisma.mediaAsset.create({
      data: {
        url,
        filename,
        kind: file.type.startsWith("video/") ? "video" : "image",
      },
    });
  }

  revalidatePath("/admin/media");
  return {};
}

export async function deleteMediaAction(id: string) {
  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin/media");
}

export async function updateMediaAltAction(id: string, formData: FormData) {
  const altText = String(formData.get("altText") ?? "").trim();
  await prisma.mediaAsset.update({ where: { id }, data: { altText: altText || null } });
  revalidatePath("/admin/media");
}
