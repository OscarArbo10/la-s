import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <LoginForm supabaseReady={supabaseReady} />
    </main>
  );
}
