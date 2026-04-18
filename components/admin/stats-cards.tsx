export function StatsCards({ totalDownloads, totalSoftware }: { totalDownloads: number; totalSoftware: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-card p-5">
        <p className="text-sm text-slate-400">Total Downloads</p>
        <p className="mt-2 text-3xl font-semibold">{totalDownloads.toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-card p-5">
        <p className="text-sm text-slate-400">Software Entries</p>
        <p className="mt-2 text-3xl font-semibold">{totalSoftware}</p>
      </div>
    </div>
  );
}
