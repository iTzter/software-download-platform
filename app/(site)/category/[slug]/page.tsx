import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single();
  if (!category) return notFound();

  const { data: software = [] } = await supabase
    .from("software")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  return (
    <main className="container-page py-10">
      <h1 className="mb-6 text-3xl font-semibold">{category.name}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {software.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-800 bg-card p-4">
            <h2 className="font-medium">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
