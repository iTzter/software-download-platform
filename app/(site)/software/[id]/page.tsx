import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

export default async function SoftwarePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: software } = await supabase
    .from("software")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single();

  if (!software || software.is_hidden) return notFound();

  return (
    <main className="container-page py-10">
      <article className="rounded-2xl border border-slate-800 bg-card p-8">
        <h1 className="text-3xl font-semibold">{software.title}</h1>
        <p className="mt-3 text-slate-300">{software.description}</p>
        <div className="mt-6 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
          <p>Version: {software.version ?? "Latest"}</p>
          <p>Size: {software.size ?? "N/A"}</p>
          <p>OS: {software.os_type}</p>
          <p>Category: {software.categories?.name ?? "Uncategorized"}</p>
        </div>
        <div className="mt-8 flex gap-3">
          <Link href={software.download_url} target="_blank">
            <Button>Download</Button>
          </Link>
          {software.categories?.slug ? (
            <Link href={`/category/${software.categories.slug}`}>
              <Button className="bg-slate-700">More in Category</Button>
            </Link>
          ) : null}
        </div>
      </article>
    </main>
  );
}
