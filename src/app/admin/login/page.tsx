import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <div className="w-full max-w-sm">
        <p className="font-display mb-8 text-center text-2xl text-white">Eva Mandisa — Admin</p>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
