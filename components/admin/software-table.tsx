'use client';

import type { Software } from '@/types/database';
import { toggleSoftwareFeatured, toggleSoftwareVisibility } from '@/actions/software-actions';

export function SoftwareTable({ items }: { items: Software[] }) {
  return (
    <div className="overflow-auto rounded-xl border border-border">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-400">
          <tr>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">OS</th>
            <th className="px-3 py-2">Downloads</th>
            <th className="px-3 py-2">Featured</th>
            <th className="px-3 py-2">Hidden</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-border">
              <td className="px-3 py-2">{item.title}</td>
              <td className="px-3 py-2">{item.os_type}</td>
              <td className="px-3 py-2">{item.download_count}</td>
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  defaultChecked={item.is_featured}
                  onChange={(event) => toggleSoftwareFeatured(item.id, event.target.checked)}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  defaultChecked={item.is_hidden}
                  onChange={(event) => toggleSoftwareVisibility(item.id, event.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
