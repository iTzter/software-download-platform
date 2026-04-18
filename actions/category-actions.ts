'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  iconName: z.string().min(1)
});

export async function createCategoryAction(formData: FormData) {
  const parsed = categorySchema.parse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    iconName: formData.get('iconName')
  });

  const supabase = createServiceClient();
  const { error } = await supabase.from('categories').insert({
    name: parsed.name,
    slug: parsed.slug,
    icon_name: parsed.iconName
  });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
}
