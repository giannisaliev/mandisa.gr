import { Mail, MailOpen, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteMessageAction, markMessageReadAction } from "@/lib/actions/messages";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Μηνύματα</h1>
        <p className="mt-1 text-neutral-500">Μηνύματα που στάλθηκαν μέσω της φόρμας επικοινωνίας.</p>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-5 py-8 text-center text-sm text-neutral-400">
          Δεν υπάρχουν μηνύματα ακόμα.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border bg-white p-5 ${m.read ? "border-neutral-200" : "border-amber-300"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900">
                    {m.name} <span className="font-normal text-neutral-400">·</span>{" "}
                    <a href={`mailto:${m.email}`} className="text-neutral-500 hover:underline">
                      {m.email}
                    </a>
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {m.createdAt.toLocaleString("el-GR")}
                    {m.eventType && ` · ${m.eventType}`}
                    {m.subject && ` · ${m.subject}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <form action={markMessageReadAction.bind(null, m.id, !m.read)}>
                    <button
                      type="submit"
                      className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                      aria-label={m.read ? "Σήμανση ως μη αναγνωσμένο" : "Σήμανση ως αναγνωσμένο"}
                    >
                      {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                    </button>
                  </form>
                  <form action={deleteMessageAction.bind(null, m.id)}>
                    <button type="submit" className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Διαγραφή">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
              {m.message && <p className="mt-3 text-sm whitespace-pre-wrap text-neutral-700">{m.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
