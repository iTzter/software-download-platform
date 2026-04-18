import { Input } from "@/components/ui/input";

export function HeroSection() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-card p-8">
      <p className="mb-2 text-sm uppercase text-slate-400">Trusted software hub</p>
      <h1 className="mb-3 text-4xl font-semibold">Download verified software in seconds</h1>
      <p className="mb-6 max-w-2xl text-slate-300">
        Search for safe desktop and mobile tools. Every listing is categorized, versioned, and maintained.
      </p>
      <Input placeholder="Search software, OS, or category..." />
    </section>
  );
}
