import Image from 'next/image';
import Link from 'next/link';
import { getSoftwareById } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const software = await getSoftwareById(id);
  return {
    title: software ? `${software.title} Download` : 'Software Not Found',
    description: software?.description
  };
}

export default async function SoftwarePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const software = await getSoftwareById(id);

  if (!software) {
    return <main className="p-10">Software not found.</main>;
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">{software.title}</h1>
        <p className="text-zinc-300">{software.description}</p>
        <ul className="space-y-1 text-sm text-zinc-400">
          <li>Version: {software.version}</li>
          <li>Size: {software.size}</li>
          <li>OS: {software.os_type}</li>
          <li>Downloads: {software.download_count}</li>
        </ul>
        <Link
          href={`/api/download/${software.id}`}
          className="inline-flex rounded-lg bg-white px-5 py-2 font-medium text-black"
        >
          Download Now
        </Link>
      </section>
      <section className="relative min-h-72 overflow-hidden rounded-xl border border-border">
        <Image
          src={software.thumbnail_url}
          alt={software.title}
          fill
          className="object-cover"
        />
      </section>
    </main>
  );
}
