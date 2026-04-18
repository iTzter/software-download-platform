import { uploadSoftwareAction } from "@/lib/actions/admin";
import { Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SoftwareForm({ categories }: { categories: Category[] }) {
  return (
    <form action={uploadSoftwareAction} className="space-y-4 rounded-xl border border-slate-800 bg-card p-5">
      <h3 className="text-lg font-semibold">Add New Software</h3>
      <Input name="title" placeholder="Title" required />
      <Input name="description" placeholder="Description" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="version" placeholder="Version" />
        <Input name="size" placeholder="Size (e.g. 120 MB)" />
      </div>
      <select
        name="os_type"
        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
        defaultValue="windows"
      >
        <option value="windows">Windows</option>
        <option value="mac">macOS</option>
        <option value="linux">Linux</option>
        <option value="android">Android</option>
        <option value="ios">iOS</option>
      </select>
      <select name="category_id" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2" required>
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Software file</span>
          <Input name="file" type="file" required />
        </label>
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Thumbnail image</span>
          <Input name="thumbnail" type="file" accept="image/*" />
        </label>
      </div>
      <div className="flex gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="is_featured" className="accent-accent" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="is_hidden" className="accent-accent" />
          Hidden
        </label>
      </div>
      <Button type="submit">Upload Software</Button>
    </form>
  );
}
