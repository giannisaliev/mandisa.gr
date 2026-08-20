"use client";

import { useActionState } from "react";
import { updatePageMetaAction, type PageFormState } from "@/lib/actions/pages";
import { Field, inputClass } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: PageFormState = {};

export function PageMetaForm({
  pageId,
  title,
  slug,
  metaDescription,
  published,
  isHome,
}: {
  pageId: string;
  title: string;
  slug: string;
  metaDescription: string;
  published: boolean;
  isHome: boolean;
}) {
  const action = updatePageMetaAction.bind(null, pageId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Τίτλος">
          <input name="title" defaultValue={title} required className={inputClass} />
        </Field>
        <Field label="Διεύθυνση (slug)" hint={isHome ? "Η αρχική σελίδα εξυπηρετείται πάντα στο /" : undefined}>
          <input name="slug" defaultValue={slug} required className={inputClass} />
        </Field>
      </div>
      <Field label="Περιγραφή SEO" hint="Εμφανίζεται στα αποτελέσματα αναζήτησης.">
        <textarea name="metaDescription" defaultValue={metaDescription} rows={2} className={inputClass} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="published" defaultChecked={published} className="h-4 w-4" />
        Δημοσιευμένη (ορατή στον ιστότοπο)
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Αποθήκευση</SubmitButton>
    </form>
  );
}
