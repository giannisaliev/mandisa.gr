import { prisma } from "@/lib/db";
import { UploadForm } from "./UploadForm";
import { MediaGrid } from "./MediaGrid";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Πολυμέσα</h1>
        <p className="mt-1 text-neutral-500">
          {assets.length} αρχεία. Αντιγράψτε τη διεύθυνση (URL) ενός αρχείου για να το χρησιμοποιήσετε σε μια ενότητα σελίδας.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <UploadForm />
      </div>

      <MediaGrid assets={assets} />
    </div>
  );
}
