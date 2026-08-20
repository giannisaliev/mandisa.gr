"use client";

import { useActionState, useRef } from "react";
import { uploadMediaAction, type MediaFormState } from "@/lib/actions/media";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: MediaFormState = {};

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function action(prevState: MediaFormState, formData: FormData) {
    const result = await uploadMediaAction(prevState, formData);
    if (!result.error) formRef.current?.reset();
    return result;
  }

  const [state, formAction] = useActionState(action, initialState);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-center gap-3">
      <input
        type="file"
        name="files"
        multiple
        accept="image/*,video/*"
        required
        className="text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-neutral-700"
      />
      <SubmitButton>Μεταφόρτωση</SubmitButton>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
