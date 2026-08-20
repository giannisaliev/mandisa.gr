import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl text-white">404</p>
      <p className="mt-4 text-white/70">Η σελίδα που ψάχνετε δεν βρέθηκε.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center border border-white px-7 py-3 text-sm tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black"
      >
        Αρχική
      </Link>
    </div>
  );
}
