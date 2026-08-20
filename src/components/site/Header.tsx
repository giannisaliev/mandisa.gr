import Link from "next/link";
import Image from "next/image";
import { getMenuTree, getSettings, menuItemHref } from "@/lib/content";
import { Nav, type NavItem } from "@/components/site/Nav";

export async function Header() {
  const [settings, menu] = await Promise.all([getSettings(), getMenuTree()]);

  const items: NavItem[] = menu
    .filter((item) => !item.page || item.page.published)
    .map((item) => ({
      id: item.id,
      label: item.label,
      href: menuItemHref(item),
      openNewTab: item.openNewTab,
      children: item.children
        .filter((c) => !c.page || c.page.published)
        .map((c) => ({
          id: c.id,
          label: c.label,
          href: menuItemHref(c),
          openNewTab: c.openNewTab,
        })),
    }));

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.siteName}
              width={170}
              height={41}
              priority
              className="h-9 w-auto"
            />
          ) : (
            <span className="font-display text-xl text-white">{settings.siteName}</span>
          )}
        </Link>
        <Nav items={items} />
      </div>
    </header>
  );
}
