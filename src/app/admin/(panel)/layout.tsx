import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSiteSettings } from "@/lib/data";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen pb-24">
      <AdminNav storeName={settings.store_name} />
      <main className="mx-auto w-full max-w-5xl px-4 pt-5">{children}</main>
    </div>
  );
}
