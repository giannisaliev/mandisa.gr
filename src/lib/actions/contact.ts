"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Παρακαλώ συμπληρώστε το όνομά σας"),
  email: z.string().trim().email("Μη έγκυρο email"),
  subject: z.string().trim().optional(),
  eventType: z.string().trim().optional(),
  message: z.string().trim().optional(),
  // honeypot: real users never fill this, only bots
  website: z.string().trim().max(0).optional(),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    eventType: formData.get("eventType"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Κάτι πήγε στραβά." };
  }

  if (parsed.data.website) {
    // Honeypot tripped — silently pretend success so the bot moves on.
    return { status: "success" };
  }

  await prisma.contactSubmission.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      eventType: parsed.data.eventType || null,
      message: parsed.data.message || null,
    },
  });

  return { status: "success" };
}
