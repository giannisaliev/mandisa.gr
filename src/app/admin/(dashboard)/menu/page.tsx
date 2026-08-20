import { ChevronUp, ChevronDown, Trash2, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteMenuItemAction, moveMenuItemAction } from "@/lib/actions/menu";
import { NewMenuItemForm } from "./NewMenuItemForm";

export default async function AdminMenuPage() {
  const [items, pages] = await Promise.all([
    prisma.menuItem.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
      include: {
        page: { select: { slug: true, title: true } },
        children: {
          orderBy: { order: "asc" },
          include: { page: { select: { slug: true, title: true } } },
        },
      },
    }),
    prisma.page.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, slug: true } }),
  ]);

  const allParents = items.map((i) => ({ id: i.id, label: i.label }));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Μενού</h1>
        <p className="mt-1 text-neutral-500">Διαχειριστείτε τα στοιχεία πλοήγησης του ιστότοπού σας.</p>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-neutral-300 px-5 py-8 text-center text-sm text-neutral-400">
            Δεν υπάρχουν στοιχεία μενού ακόμα.
          </p>
        )}
        {items.map((item, i) => (
          <div key={item.id} className="rounded-lg border border-neutral-200 bg-white">
            <MenuRow item={item} isFirst={i === 0} isLast={i === items.length - 1} />
            {item.children.length > 0 && (
              <div className="space-y-2 border-t border-neutral-100 bg-neutral-50 px-4 py-3 pl-8">
                {item.children.map((child, ci) => (
                  <MenuRow key={child.id} item={child} isFirst={ci === 0} isLast={ci === item.children.length - 1} nested />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Προσθήκη στοιχείου μενού</h3>
        <NewMenuItemForm pages={pages} parents={allParents} />
      </div>
    </div>
  );
}

function MenuRow({
  item,
  isFirst,
  isLast,
  nested = false,
}: {
  item: {
    id: string;
    label: string;
    externalUrl: string | null;
    openNewTab: boolean;
    page: { slug: string; title: string } | null;
  };
  isFirst: boolean;
  isLast: boolean;
  nested?: boolean;
}) {
  const target = item.page ? `/${item.page.slug === "home" ? "" : item.page.slug}` : item.externalUrl;

  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 ${nested ? "" : ""}`}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-900">{item.label}</p>
        <p className="flex items-center gap-1 truncate text-xs text-neutral-500">
          {target}
          {item.externalUrl && <ExternalLink size={11} />}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <form action={moveMenuItemAction.bind(null, item.id, "up")}>
          <button type="submit" disabled={isFirst} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30">
            <ChevronUp size={16} />
          </button>
        </form>
        <form action={moveMenuItemAction.bind(null, item.id, "down")}>
          <button type="submit" disabled={isLast} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30">
            <ChevronDown size={16} />
          </button>
        </form>
        <form action={deleteMenuItemAction.bind(null, item.id)}>
          <button type="submit" className="rounded p-1.5 text-red-500 hover:bg-red-50">
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
