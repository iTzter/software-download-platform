import { FeaturedSlider } from "@/components/home/featured-slider";
import { HeroSection } from "@/components/home/hero-section";
import { LatestGrid } from "@/components/home/latest-grid";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featured = [] }, { data: latest = [] }] = await Promise.all([
    supabase.from("software").select("*").eq("is_featured", true).eq("is_hidden", false).limit(6),
    supabase.from("software").select("*").eq("is_hidden", false).order("created_at", { ascending: false }).limit(9)
  ]);

  return (
    <main className="container-page space-y-10 py-10">
      <HeroSection />
      <FeaturedSlider items={featured} />
      <LatestGrid items={latest} />
    </main>
  );
}
