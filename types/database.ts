export type Category = {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
};

export type Software = {
  id: string;
  title: string;
  description: string;
  version: string;
  size: string;
  os_type: string;
  download_url: string;
  thumbnail_url: string;
  category_id: string;
  is_featured: boolean;
  is_hidden: boolean;
  download_count: number;
  created_at: string;
  category?: Category;
};
