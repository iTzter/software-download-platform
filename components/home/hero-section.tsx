import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function HeroSection() {
  return (
    <section className="rounded-2xl border border-border bg-gradient-to-b from-zinc-900 to-zinc-950 p-8">
      <p className="mb-2 text-sm uppercase tracking-widest text-zinc-400">
        Software Download Portal
      </p>
      <h1 className="mb-4 text-4xl font-bold">Discover trusted apps for every platform.</h1>
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
        <Input placeholder="Search software..." className="pl-10" />
      </div>
    </section>
  );
}
