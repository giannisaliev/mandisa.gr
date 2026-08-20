"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  openNewTab: boolean;
  children: { id: string; label: string; href: string; openNewTab: boolean }[];
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden lg:flex lg:items-center lg:gap-1">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            <Link
              href={item.href}
              target={item.openNewTab ? "_blank" : undefined}
              className={`flex items-center gap-1 px-4 py-2 text-sm tracking-wide uppercase transition-colors hover:text-accent ${
                isActive(pathname, item.href) ? "text-accent" : "text-white"
              }`}
            >
              {item.label}
              {item.children.length > 0 && <ChevronDown size={13} strokeWidth={2.5} />}
            </Link>
            {item.children.length > 0 && (
              <div className="invisible absolute left-0 z-40 min-w-[240px] translate-y-1 border border-white/10 bg-panel opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href}
                    target={child.openNewTab ? "_blank" : undefined}
                    className="block px-5 py-3 text-sm tracking-wide text-white/90 transition hover:bg-panel-hover hover:text-accent"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-sm bg-panel p-2.5 text-white lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-black lg:hidden">
          <nav className="flex flex-col divide-y divide-white/10 px-6 py-4">
            {items.map((item) => (
              <div key={item.id} className="py-2">
                <Link
                  href={item.href}
                  target={item.openNewTab ? "_blank" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-lg tracking-wide uppercase ${
                    isActive(pathname, item.href) ? "text-accent" : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children.length > 0 && (
                  <div className="flex flex-col gap-1 border-l border-white/10 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        target={child.openNewTab ? "_blank" : undefined}
                        onClick={() => setOpen(false)}
                        className="py-1.5 text-sm text-white/80"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
