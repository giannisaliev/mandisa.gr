import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronUp, ChevronDown, Trash2, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { BLOCK_LABELS, BLOCK_TYPES, blockPreview } from "@/lib/blocks";
import { addBlockAction, deleteBlockAction, deletePageAction, moveBlockAction } from "@/lib/actions/pages";
import { PageMetaForm } from "./PageMetaForm";
import { SubmitButton } from "@/components/admin/SubmitButton";

type Params = { id: string };

export default async function EditPagePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
  if (!page) notFound();

  const addBlock = addBlockAction.bind(null, page.id);
  const deletePage = deletePageAction.bind(null, page.id);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link href="/admin/pages" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={15} />
          Πίσω στις σελίδες
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{page.title}</h1>
      </div>

      <PageMetaForm
        pageId={page.id}
        title={page.title}
        slug={page.slug}
        metaDescription={page.metaDescription ?? ""}
        published={page.published}
        isHome={page.isHome}
      />

      <div>
        <h2 className="mb-3 font-medium text-neutral-700">Ενότητες περιεχομένου</h2>
        <div className="space-y-2">
          {page.blocks.length === 0 && (
            <p className="rounded-lg border border-dashed border-neutral-300 px-5 py-8 text-center text-sm text-neutral-400">
              Δεν υπάρχουν ενότητες ακόμα. Προσθέστε την πρώτη παρακάτω.
            </p>
          )}
          {page.blocks.map((block, i) => (
            <div
              key={block.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900">{BLOCK_LABELS[block.type as keyof typeof BLOCK_LABELS] ?? block.type}</p>
                <p className="truncate text-xs text-neutral-500">{blockPreview(block.type, block.data)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <form action={moveBlockAction.bind(null, page.id, block.id, "up")}>
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    aria-label="Μετακίνηση πάνω"
                  >
                    <ChevronUp size={16} />
                  </button>
                </form>
                <form action={moveBlockAction.bind(null, page.id, block.id, "down")}>
                  <button
                    type="submit"
                    disabled={i === page.blocks.length - 1}
                    className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    aria-label="Μετακίνηση κάτω"
                  >
                    <ChevronDown size={16} />
                  </button>
                </form>
                <Link
                  href={`/admin/pages/${page.id}/blocks/${block.id}`}
                  className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                  aria-label="Επεξεργασία"
                >
                  <Pencil size={16} />
                </Link>
                <form action={deleteBlockAction.bind(null, page.id, block.id)}>
                  <button
                    type="submit"
                    className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    aria-label="Διαγραφή"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Προσθήκη νέας ενότητας</h3>
        <form action={addBlock} className="flex flex-wrap gap-3">
          <select name="type" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" required>
            {BLOCK_TYPES.map((t) => (
              <option key={t} value={t}>
                {BLOCK_LABELS[t]}
              </option>
            ))}
          </select>
          <SubmitButton>Προσθήκη</SubmitButton>
        </form>
      </div>

      {!page.isHome && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <h3 className="mb-1 text-sm font-medium text-red-800">Διαγραφή σελίδας</h3>
          <p className="mb-3 text-sm text-red-700">Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.</p>
          <form action={deletePage}>
            <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              Διαγραφή «{page.title}»
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
