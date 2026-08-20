"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type SettingsFormState = { error?: string; success?: boolean };

export async function updateSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const siteName = String(formData.get("siteName") ?? "").trim();
  if (!siteName) return { error: "Το όνομα του ιστότοπου είναι υποχρεωτικό." };

  const field = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value || null;
  };

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      siteName,
      tagline: field("tagline"),
      logoUrl: field("logoUrl"),
      footerText: field("footerText"),
      contactNote: field("contactNote"),
      instagramUrl: field("instagramUrl"),
      facebookUrl: field("facebookUrl"),
      tiktokUrl: field("tiktokUrl"),
      youtubeUrl: field("youtubeUrl"),
    },
    create: {
      id: 1,
      siteName,
      tagline: field("tagline"),
      logoUrl: field("logoUrl"),
      footerText: field("footerText"),
      contactNote: field("contactNote"),
      instagramUrl: field("instagramUrl"),
      facebookUrl: field("facebookUrl"),
      tiktokUrl: field("tiktokUrl"),
      youtubeUrl: field("youtubeUrl"),
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
