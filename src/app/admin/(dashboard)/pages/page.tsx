import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminPagesList() {
  const pages = await prisma.page.findMany({
    orderBy: [{ isHome: "desc" }, { title: "asc" }],
    include: { _count: { select: { blocks: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Σελίδες</h1>
          <p className="mt-1 text-neutral-500">Διαχειριστείτε το περιεχόμενο του ιστότοπού σας.</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          <Plus size={16} />
          Νέα σελίδα
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Τίτλος</th>
              <th className="px-5 py-3 font-medium">Διεύθυνση</th>
              <th className="px-5 py-3 font-medium">Ενότητες</th>
              <th className="px-5 py-3 font-medium">Κατάσταση</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-neutral-50">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/pages/${page.id}`} className="font-medium text-neutral-900 hover:underline">
                    {page.title}
                  </Link>
                  {page.isHome && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">Αρχική</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-neutral-500">/{page.isHome ? "" : page.slug}</td>
                <td className="px-5 py-3.5 text-neutral-500">{page._count.blocks}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      page.published ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {page.published ? "Δημοσιευμένη" : "Πρόχειρο"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
