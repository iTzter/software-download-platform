import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/server';
import type { Software } from '@/types/database';

export const getFeaturedSoftware = cache(async (): Promise<Software[]> => {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('software')
    .select('*')
    .eq('is_featured', true)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(8);

  return data ?? [];
});

export const getLatestSoftware = cache(async (): Promise<Software[]> => {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('software')
    .select('*')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(12);

  return data ?? [];
});

export const getSoftwareByCategory = cache(async (slug: string) => {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('software')
    .select('*, category:categories(*)')
    .eq('categories.slug', slug)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  return (data ?? []) as Software[];
});

export const getSoftwareById = cache(async (id: string) => {
  const supabase = createServiceClient();
  const { data } = await supabase.from('software').select('*').eq('id', id).single();
  return data as Software | null;
});

export async function getAdminStats() {
  const supabase = createServiceClient();

  const [{ count }, { data: topSoftware }] = await Promise.all([
    supabase.from('software').select('*', { count: 'exact', head: true }),
    supabase
      .from('software')
      .select('id, title, download_count')
      .order('download_count', { ascending: false })
      .limit(5)
  ]);

  return {
    totalSoftware: count ?? 0,
    topSoftware: topSoftware ?? []
  };
}
