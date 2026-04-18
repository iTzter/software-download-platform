import { SoftwareForm } from "@/components/admin/software-form";
import { StatsCards } from "@/components/admin/stats-cards";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSoftwarePage() {
  const supabase = await createClient();
  const [{ data: categories = [] }, { data: software = [] }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("software").select("*").order("created_at", { ascending: false })
  ]);

  const totalDownloads = software.reduce((sum, item) => sum + item.download_count, 0);

  return (
    <main className="container-page space-y-6 py-10">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <StatsCards totalDownloads={totalDownloads} totalSoftware={software.length} />
      <SoftwareForm categories={categories} />

      <section className="rounded-xl border border-slate-800 bg-card p-5">
        <h2 className="mb-4 text-xl font-semibold">Manage Visibility</h2>
        <div className="space-y-3">
          {software.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">{item.download_count} downloads</p>
              </div>
              <VisibilityToggle softwareId={item.id} initialHidden={item.is_hidden} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
