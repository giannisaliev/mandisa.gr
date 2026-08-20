import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminOverview() {
  const [pageCount, mediaCount, unreadMessages, totalMessages] = await Promise.all([
    prisma.page.count(),
    prisma.mediaAsset.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.contactSubmission.count(),
  ]);

  const recentMessages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const cards = [
    { label: "Σελίδες", value: pageCount, href: "/admin/pages" },
    { label: "Αρχεία πολυμέσων", value: mediaCount, href: "/admin/media" },
    { label: "Μη αναγνωσμένα μηνύματα", value: unreadMessages, href: "/admin/messages" },
    { label: "Σύνολο μηνυμάτων", value: totalMessages, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Επισκόπηση</h1>
        <p className="mt-1 text-neutral-500">Καλωσήρθατε στον πίνακα ελέγχου του ιστότοπού σας.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <p className="text-3xl font-semibold">{c.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-medium">Πρόσφατα μηνύματα</h2>
          <Link href="/admin/messages" className="text-sm text-neutral-500 hover:text-neutral-900">
            Όλα τα μηνύματα →
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-neutral-400">Δεν υπάρχουν μηνύματα ακόμα.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div className="flex items-center gap-2">
                  {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                  <span className="font-medium">{m.name}</span>
                  <span className="text-neutral-400">{m.email}</span>
                </div>
                <span className="text-neutral-400">{m.createdAt.toLocaleDateString("el-GR")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
