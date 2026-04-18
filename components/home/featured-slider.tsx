import Image from 'next/image';
import Link from 'next/link';
import type { Software } from '@/types/database';

type FeaturedSliderProps = {
  items?: Software[] | null;
};

export function FeaturedSlider({ items }: FeaturedSliderProps) {
  const safeItems = items ?? [];

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Featured Software</h2>
      {safeItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted p-6 text-sm text-zinc-400">
          No featured software available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safeItems.map((item) => (
            <Link
              key={item.id}
              href={`/software/${item.id}`}
              className="overflow-hidden rounded-xl border border-border bg-muted"
            >
              <div className="relative h-36">
                <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
