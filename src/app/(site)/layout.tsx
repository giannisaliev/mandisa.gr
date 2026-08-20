import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-cloth">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
