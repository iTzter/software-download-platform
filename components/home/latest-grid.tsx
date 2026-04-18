import Link from 'next/link';
import type { Software } from '@/types/database';

type LatestGridProps = {
  items?: Software[] | null;
};

export function LatestGrid({ items }: LatestGridProps) {
  const safeItems = items ?? [];

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Latest Software</h2>
      {safeItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted p-6 text-sm text-zinc-400">
          No software has been published yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {safeItems.map((item) => (
            <Link
              key={item.id}
              href={`/software/${item.id}`}
              className="rounded-xl border border-border bg-muted p-4"
            >
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-zinc-400">v{item.version}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
