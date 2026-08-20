import Link from "next/link";
import { LayoutDashboard, FileText, Menu as MenuIcon, Image as ImageIcon, Mail, Settings, LogOut, ExternalLink } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { prisma } from "@/lib/db";

const NAV = [
  { href: "/admin", label: "Επισκόπηση", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Σελίδες", icon: FileText },
  { href: "/admin/menu", label: "Μενού", icon: MenuIcon },
  { href: "/admin/media", label: "Πολυμέσα", icon: ImageIcon },
  { href: "/admin/messages", label: "Μηνύματα", icon: Mail },
  { href: "/admin/settings", label: "Ρυθμίσεις", icon: Settings },
];

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const unreadCount = await prisma.contactSubmission.count({ where: { read: false } });

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-neutral-950 text-white">
        <div className="px-6 py-6">
          <p className="font-display text-lg">Eva Mandisa</p>
          <p className="text-xs tracking-wide text-white/50 uppercase">Πίνακας Ελέγχου</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <Icon size={17} />
                {label}
              </span>
              {href === "/admin/messages" && unreadCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[11px] font-semibold text-black">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={17} />
            Προβολή ιστότοπου
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={17} />
              Αποσύνδεση
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
