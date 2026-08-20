"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";
import type { ContactFormData } from "@/lib/blocks";

const EVENT_TYPES = [
  "Γάμος - Βάπτιση",
  "Γενέθλια - Έκπληξη",
  "Φεστιβάλ - Διαγωνισμός",
  "Βιντεοκλίπ",
  "Κέντρα Εκδηλώσεων",
  "Μαθήματα Χορού",
  "Άλλο",
];

const initialState: ContactFormState = { status: "idle" };

const fieldClass =
  "w-full border border-white/20 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-accent focus:outline-none";

export function ContactForm({ data }: { data: ContactFormData }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="font-display text-2xl text-white">Ευχαριστώ για το μήνυμά σας!</p>
        <p className="mt-3 text-white/70">Θα επικοινωνήσω μαζί σας το συντομότερο δυνατό.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      {data.heading && <h2 className="font-display mb-2 text-center text-3xl text-white">{data.heading}</h2>}
      {data.note && <p className="mb-8 text-center text-white/70">{data.note}</p>}

      <form action={formAction} className="space-y-4">
        {/* Honeypot field — hidden from real users via CSS, visible to bots */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <input name="name" type="text" required placeholder="Όνομα *" className={fieldClass} />
        <input name="email" type="email" required placeholder="Email *" className={fieldClass} />
        <input name="subject" type="text" placeholder="Θέμα" className={fieldClass} />
        <select name="eventType" defaultValue="" className={fieldClass}>
          <option value="">Είδος Εκδήλωσης</option>
          {EVENT_TYPES.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <textarea name="message" rows={5} placeholder="Μήνυμα" className={fieldClass} />

        {state.status === "error" && <p className="text-sm text-red-400">{state.message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full border border-white bg-white px-7 py-3 text-sm tracking-widest text-black uppercase transition-colors hover:bg-black hover:text-white disabled:opacity-60"
        >
          {pending ? "Αποστολή..." : "Αποστολή!"}
        </button>
      </form>
    </div>
  );
}
