import { getSiteSettings } from "@/lib/data";
import { ThemeEditor } from "@/components/admin/ThemeEditor";

export default async function AdminAppearancePage() {
  const settings = await getSiteSettings();
  return <ThemeEditor initialSettings={settings} />;
}
