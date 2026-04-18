import Image from "next/image";
import { Software } from "@/types/database";

export function FeaturedSlider({ items }: { items: Software[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Featured Software</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-800 bg-card p-4">
            {item.thumbnail_url ? (
              <Image
                src={item.thumbnail_url}
                alt={item.title}
                width={600}
                height={300}
                className="mb-3 h-40 w-full rounded-lg object-cover"
              />
            ) : null}
            <h3 className="text-lg font-medium">{item.title}</h3>
            <p className="line-clamp-2 text-sm text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
