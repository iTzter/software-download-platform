import Link from 'next/link';
import { getAdminStats } from '@/lib/data';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-muted p-4">
          <p className="text-zinc-400">Total Software</p>
          <p className="text-3xl font-bold">{stats.totalSoftware}</p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-muted p-4">
        <h2 className="mb-3 text-xl font-semibold">Top Downloads</h2>
        <ul className="space-y-2 text-sm">
          {stats.topSoftware.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.title}</span>
              <span className="text-zinc-400">{item.download_count}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex gap-4">
        <Link href="/admin/software" className="rounded-lg bg-white px-4 py-2 text-black">
          Manage Software
        </Link>
        <Link href="/admin/categories" className="rounded-lg border border-border px-4 py-2">
          Manage Categories
        </Link>
      </div>
    </main>
  );
}
