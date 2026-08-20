import { getSettings } from "@/lib/content";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ρυθμίσεις</h1>
        <p className="mt-1 text-neutral-500">Γενικές ρυθμίσεις του ιστότοπου: λογότυπο, footer και κοινωνικά δίκτυα.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
