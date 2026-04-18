import { createSoftwareAction } from '@/actions/software-actions';
import { SoftwareTable } from '@/components/admin/software-table';
import { createServiceClient } from '@/lib/supabase/server';

export default async function AdminSoftwarePage() {
  const supabase = createServiceClient();

  const [{ data: software }, { data: categories }] = await Promise.all([
    supabase.from('software').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name')
  ]);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <h1 className="text-3xl font-bold">Manage Software</h1>

      <form action={createSoftwareAction} className="grid gap-3 rounded-xl border border-border bg-muted p-4 md:grid-cols-2">
        <input name="title" placeholder="Title" className="rounded bg-black p-2" required />
        <input name="version" placeholder="Version" className="rounded bg-black p-2" required />
        <input name="size" placeholder="Size (e.g. 85 MB)" className="rounded bg-black p-2" required />
        <input name="osType" placeholder="OS Type" className="rounded bg-black p-2" required />
        <textarea name="description" placeholder="Description" className="rounded bg-black p-2 md:col-span-2" required />

        <select name="categoryId" className="rounded bg-black p-2" required>
          <option value="">Select category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className="rounded border border-border p-2">
          Binary file
          <input name="softwareFile" type="file" required className="mt-2 block w-full" />
        </label>

        <label className="rounded border border-border p-2 md:col-span-2">
          Thumbnail image
          <input name="thumbnail" type="file" accept="image/*" required className="mt-2 block w-full" />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isHidden" />
          Hidden
        </label>

        <button type="submit" className="rounded bg-white px-3 py-2 font-medium text-black md:col-span-2">
          Create Software
        </button>
      </form>

      <SoftwareTable items={software ?? []} />
    </main>
  );
}
