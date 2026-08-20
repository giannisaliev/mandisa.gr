"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsFormState } from "@/lib/actions/settings";
import { Field, inputClass } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: SettingsFormState = {};

type Settings = {
  siteName: string;
  tagline: string | null;
  logoUrl: string | null;
  footerText: string | null;
  contactNote: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <Field label="Όνομα ιστότοπου">
        <input name="siteName" defaultValue={settings.siteName} required className={inputClass} />
      </Field>
      <Field label="Σύνθημα (tagline)">
        <input name="tagline" defaultValue={settings.tagline ?? ""} className={inputClass} />
      </Field>
      <Field label="Λογότυπο (URL)" hint="Από τη Βιβλιοθήκη Πολυμέσων.">
        <input name="logoUrl" defaultValue={settings.logoUrl ?? ""} className={inputClass} />
      </Field>
      <Field label="Κείμενο footer" hint="Προαιρετικό κείμενο κάτω από το λογότυπο στο footer.">
        <input name="footerText" defaultValue={settings.footerText ?? ""} className={inputClass} />
      </Field>
      <Field label="Σημείωση επικοινωνίας" hint='π.χ. "SMS | VIBER | WHATSAPP"'>
        <input name="contactNote" defaultValue={settings.contactNote ?? ""} className={inputClass} />
      </Field>

      <div className="grid gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-2">
        <Field label="Instagram URL">
          <input name="instagramUrl" defaultValue={settings.instagramUrl ?? ""} className={inputClass} />
        </Field>
        <Field label="Facebook URL">
          <input name="facebookUrl" defaultValue={settings.facebookUrl ?? ""} className={inputClass} />
        </Field>
        <Field label="TikTok URL">
          <input name="tiktokUrl" defaultValue={settings.tiktokUrl ?? ""} className={inputClass} />
        </Field>
        <Field label="YouTube URL">
          <input name="youtubeUrl" defaultValue={settings.youtubeUrl ?? ""} className={inputClass} />
        </Field>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Οι ρυθμίσεις αποθηκεύτηκαν.</p>}
      <SubmitButton>Αποθήκευση</SubmitButton>
    </form>
  );
}
