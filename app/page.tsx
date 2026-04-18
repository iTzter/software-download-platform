import { FeaturedSlider } from '@/components/home/featured-slider';
import { HeroSection } from '@/components/home/hero-section';
import { LatestGrid } from '@/components/home/latest-grid';
import { getFeaturedSoftware, getLatestSoftware } from '@/lib/data';

export const revalidate = 120;

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedSoftware(),
    getLatestSoftware()
  ]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <HeroSection />
      <FeaturedSlider items={featured} />
      <LatestGrid items={latest} />
    </main>
  );
}
