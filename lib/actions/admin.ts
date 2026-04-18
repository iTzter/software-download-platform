"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const softwareSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  version: z.string().optional(),
  size: z.string().optional(),
  os_type: z.enum(["windows", "mac", "linux", "android", "ios"]),
  category_id: z.string().uuid(),
  is_featured: z.coerce.boolean().default(false),
  is_hidden: z.coerce.boolean().default(false)
});

const sanitizeFilename = (fileName: string) => fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

export const uploadSoftwareAction = async (formData: FormData) => {
  const supabase = await createClient();

  const parsed = softwareSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    version: formData.get("version") || undefined,
    size: formData.get("size") || undefined,
    os_type: formData.get("os_type"),
    category_id: formData.get("category_id"),
    is_featured: formData.get("is_featured") === "on",
    is_hidden: formData.get("is_hidden") === "on"
  });

  const file = formData.get("file") as File | null;
  const thumbnail = formData.get("thumbnail") as File | null;

  if (!file || file.size === 0) {
    throw new Error("Software file is required");
  }

  const fileKey = `software/${Date.now()}-${sanitizeFilename(file.name)}`;
  const thumbnailKey = thumbnail?.size
    ? `thumbnails/${Date.now()}-${sanitizeFilename(thumbnail.name)}`
    : null;

  const { error: fileError } = await supabase.storage
    .from("files")
    .upload(fileKey, file, { cacheControl: "3600", upsert: false });

  if (fileError) throw new Error(fileError.message);

  let thumbnailPath: string | null = null;
  if (thumbnailKey && thumbnail) {
    const { error: thumbnailError } = await supabase.storage
      .from("images")
      .upload(thumbnailKey, thumbnail, { cacheControl: "3600", upsert: false });

    if (thumbnailError) throw new Error(thumbnailError.message);
    thumbnailPath = thumbnailKey;
  }

  const { data: publicFile } = supabase.storage.from("files").getPublicUrl(fileKey);
  const { data: publicThumb } = thumbnailPath
    ? supabase.storage.from("images").getPublicUrl(thumbnailPath)
    : { data: { publicUrl: null } };

  const { error: insertError } = await supabase.from("software").insert({
    title: parsed.title,
    description: parsed.description,
    version: parsed.version,
    size: parsed.size,
    os_type: parsed.os_type,
    download_url: publicFile.publicUrl,
    thumbnail_url: publicThumb.publicUrl,
    category_id: parsed.category_id,
    is_featured: parsed.is_featured,
    is_hidden: parsed.is_hidden
  });

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/");
  revalidatePath("/admin/software");
};

export const toggleSoftwareVisibilityAction = async (id: string, hidden: boolean) => {
  const supabase = await createClient();
  const { error } = await supabase.from("software").update({ is_hidden: hidden }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/software");
};
