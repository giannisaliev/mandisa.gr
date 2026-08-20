import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

function safeFilename(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const unique = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  return `${base || "file"}-${unique}${ext}`;
}

/**
 * Saves an uploaded file and returns its public URL. Uses Vercel Blob when
 * BLOB_READ_WRITE_TOKEN is configured (production), otherwise falls back to
 * writing into /public/uploads for local development.
 */
export async function saveUploadedFile(file: File): Promise<{ url: string; filename: string }> {
  const filename = safeFilename(file.name);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return { url: blob.url, filename };
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, filename), Buffer.from(arrayBuffer));
  return { url: `/uploads/${filename}`, filename };
}
