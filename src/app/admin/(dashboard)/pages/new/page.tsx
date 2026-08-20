"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createPageAction, type PageFormState } from "@/lib/actions/pages";
import { Field, inputClass } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: PageFormState = {};

export default function NewPagePage() {
  const [state, formAction] = useActionState(createPageAction, initialState);

  return (
    <div className="max-w-lg space-y-6">
      <Link href="/admin/pages" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={15} />
        Πίσω στις σελίδες
      </Link>
      <h1 className="text-2xl font-semibold">Νέα σελίδα</h1>

      <form action={formAction} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
        <Field label="Τίτλος">
          <input name="title" required className={inputClass} placeholder="π.χ. Σεμινάρια" />
        </Field>
        <Field label="Διεύθυνση (slug)" hint="Προαιρετικό — αν το αφήσετε κενό θα δημιουργηθεί από τον τίτλο.">
          <input name="slug" className={inputClass} placeholder="p.x. seminaria" />
        </Field>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton>Δημιουργία</SubmitButton>
      </form>
    </div>
  );
}
