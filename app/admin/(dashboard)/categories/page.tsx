import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories = [] } = await supabase.from("categories").select("*").order("name");

  return (
    <main className="container-page py-10">
      <h1 className="mb-6 text-3xl font-semibold">Categories</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="rounded-xl border border-slate-800 bg-card p-4">
            <h2 className="font-medium">{category.name}</h2>
            <p className="mt-1 text-sm text-slate-500">/{category.slug}</p>
            <p className="mt-2 text-sm text-slate-400">Icon: {category.icon_name ?? "N/A"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
