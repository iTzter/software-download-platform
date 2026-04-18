'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';

const softwareSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(15),
  version: z.string().min(1),
  size: z.string().min(1),
  osType: z.string().min(1),
  categoryId: z.string().uuid(),
  isFeatured: z.boolean().default(false),
  isHidden: z.boolean().default(false)
});

export async function uploadToStorage(file: File, bucket: 'files' | 'images') {
  const supabase = createServiceClient();
  const ext = file.name.split('.').pop() ?? 'bin';
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicData.publicUrl;
}

export async function createSoftwareAction(formData: FormData) {
  const parsed = softwareSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    version: formData.get('version'),
    size: formData.get('size'),
    osType: formData.get('osType'),
    categoryId: formData.get('categoryId'),
    isFeatured: formData.get('isFeatured') === 'on',
    isHidden: formData.get('isHidden') === 'on'
  });

  const softwareFile = formData.get('softwareFile') as File;
  const imageFile = formData.get('thumbnail') as File;

  const [downloadUrl, thumbnailUrl] = await Promise.all([
    uploadToStorage(softwareFile, 'files'),
    uploadToStorage(imageFile, 'images')
  ]);

  const supabase = createServiceClient();
  const { error } = await supabase.from('software').insert({
    title: parsed.title,
    description: parsed.description,
    version: parsed.version,
    size: parsed.size,
    os_type: parsed.osType,
    category_id: parsed.categoryId,
    download_url: downloadUrl,
    thumbnail_url: thumbnailUrl,
    is_featured: parsed.isFeatured,
    is_hidden: parsed.isHidden
  });

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function toggleSoftwareVisibility(id: string, isHidden: boolean) {
  const supabase = createServiceClient();

  await supabase.from('software').update({ is_hidden: isHidden }).eq('id', id);

  revalidatePath('/');
  revalidatePath('/admin/software');
}

export async function toggleSoftwareFeatured(id: string, isFeatured: boolean) {
  const supabase = createServiceClient();

  await supabase.from('software').update({ is_featured: isFeatured }).eq('id', id);

  revalidatePath('/');
  revalidatePath('/admin/software');
}
