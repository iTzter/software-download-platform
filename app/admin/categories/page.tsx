import { createCategoryAction } from '@/actions/category-actions';
import { createServiceClient } from '@/lib/supabase/server';

export default async function AdminCategoriesPage() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <h1 className="text-3xl font-bold">Manage Categories</h1>

      <form action={createCategoryAction} className="grid gap-3 rounded-xl border border-border bg-muted p-4 md:grid-cols-3">
        <input name="name" placeholder="Name" className="rounded bg-black p-2" required />
        <input name="slug" placeholder="Slug" className="rounded bg-black p-2" required />
        <input name="iconName" placeholder="Icon name" className="rounded bg-black p-2" required />
        <button type="submit" className="rounded bg-white px-3 py-2 text-black md:col-span-3">
          Add Category
        </button>
      </form>

      <ul className="space-y-2 rounded-xl border border-border bg-muted p-4 text-sm">
        {categories?.map((category) => (
          <li key={category.id} className="flex justify-between border-b border-border pb-2">
            <span>{category.name}</span>
            <span className="text-zinc-400">/{category.slug}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
