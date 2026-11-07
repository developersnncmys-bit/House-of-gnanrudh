import Hero from '@/components/home/Hero';
import Tiers from '@/components/home/Tiers';
import BestSellers from '@/components/home/BestSellers';
import Featured from '@/components/home/Featured';
import PromoBanner from '@/components/home/PromoBanner';
import ShopByPrice from '@/components/home/ShopByPrice';
import WeaveRail from '@/components/home/WeaveRail';
import CraftStory from '@/components/home/CraftStory';
import Testimonials from '@/components/home/Testimonials';
import PressStrip from '@/components/home/PressStrip';
import InstagramFeed from '@/components/home/InstagramFeed';
import Worldwide from '@/components/home/Worldwide';
import BrandSeoBlock from '@/components/home/BrandSeoBlock';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Tiers />
      <BestSellers />
      <Featured />
      <PromoBanner />
      <ShopByPrice />
      <WeaveRail />
      <CraftStory />
      <Testimonials />
      <PressStrip />
      <InstagramFeed />
      <Worldwide />
      <BrandSeoBlock />
    </>
  );
}
