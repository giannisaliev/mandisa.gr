"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function markMessageReadAction(id: string, read: boolean) {
  await prisma.contactSubmission.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessageAction(id: string) {
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
