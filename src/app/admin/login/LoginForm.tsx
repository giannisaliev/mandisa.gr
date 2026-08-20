"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-white/10 bg-neutral-900 p-8">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-white/70">
          Κωδικός πρόσβασης
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
        />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-amber-500 px-4 py-2.5 font-medium text-black transition hover:bg-amber-400 disabled:opacity-60"
      >
        {pending ? "Σύνδεση..." : "Σύνδεση"}
      </button>
    </form>
  );
}
