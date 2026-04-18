import { getSoftwareByCategory } from '@/lib/data';
import Link from 'next/link';

export const revalidate = 120;

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const items = await getSoftwareByCategory(slug);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold capitalize">Category: {slug}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            href={`/software/${item.id}`}
            key={item.id}
            className="rounded-xl border border-border bg-muted p-4 transition hover:border-zinc-500"
          >
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
