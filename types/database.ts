export type Category = {
  id: string;
  name: string;
  slug: string;
  icon_name: string | null;
};

export type Software = {
  id: string;
  title: string;
  description: string;
  version: string | null;
  size: string | null;
  os_type: "windows" | "mac" | "linux" | "android" | "ios";
  download_url: string;
  thumbnail_url: string | null;
  category_id: string;
  is_featured: boolean;
  is_hidden: boolean;
  download_count: number;
  created_at: string;
  category?: Category;
};
