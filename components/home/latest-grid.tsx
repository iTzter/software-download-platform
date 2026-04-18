import Link from "next/link";
import { Software } from "@/types/database";

export function LatestGrid({ items }: { items: Software[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Latest Software</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/software/${item.id}`}
            className="rounded-xl border border-slate-800 bg-card p-4 transition hover:border-accent/60"
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{item.version ?? "Latest"} • {item.os_type}</p>
            <p className="mt-3 text-xs text-slate-500">{item.download_count} downloads</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
