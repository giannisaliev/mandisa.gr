"use client";

import { useActionState, useState } from "react";
import { createMenuItemAction, type MenuFormState } from "@/lib/actions/menu";
import { Field, inputClass } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: MenuFormState = {};

export function NewMenuItemForm({
  pages,
  parents,
}: {
  pages: { id: string; title: string; slug: string }[];
  parents: { id: string; label: string }[];
}) {
  const [state, formAction] = useActionState(createMenuItemAction, initialState);
  const [targetType, setTargetType] = useState<"page" | "external">("page");

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Τίτλος">
        <input name="label" required className={inputClass} placeholder="π.χ. Σεμινάρια" />
      </Field>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1.5">
          <input type="radio" checked={targetType === "page"} onChange={() => setTargetType("page")} />
          Σελίδα του ιστότοπου
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" checked={targetType === "external"} onChange={() => setTargetType("external")} />
          Εξωτερικό link
        </label>
      </div>

      {targetType === "page" ? (
        <Field label="Σελίδα">
          <select name="pageId" className={inputClass}>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="Διεύθυνση URL">
          <input name="externalUrl" className={inputClass} placeholder="https://..." />
        </Field>
      )}

      <Field label="Γονικό στοιχείο" hint="Προαιρετικό — για υπο-μενού.">
        <select name="parentId" defaultValue="" className={inputClass}>
          <option value="">Κανένα (κύριο μενού)</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="openNewTab" className="h-4 w-4" />
        Άνοιγμα σε νέα καρτέλα
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Προσθήκη</SubmitButton>
    </form>
  );
}
