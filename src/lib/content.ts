import { prisma } from "@/lib/db";

export async function getSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (settings) return settings;
  return prisma.settings.create({ data: { id: 1 } });
}

export async function getMenuTree() {
  const items = await prisma.menuItem.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    include: {
      page: { select: { slug: true, published: true } },
      children: {
        orderBy: { order: "asc" },
        include: { page: { select: { slug: true, published: true } } },
      },
    },
  });
  return items;
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
}

export async function getHomePage() {
  return prisma.page.findFirst({
    where: { isHome: true },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
}

export function menuItemHref(item: { externalUrl: string | null; page: { slug: string } | null }): string {
  if (item.page) return item.page.slug === "home" ? "/" : `/${item.page.slug}`;
  return item.externalUrl ?? "#";
}
