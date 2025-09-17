import { fetchPageData } from "@/app/utils/fetchPageData";
import BannerSection6 from "@/components/layouts/EcommerceLayout/Home/BannerSection6";
import FeaturedFrame from "@/components/layouts/EcommerceLayout/Home/FeaturedFrame";
import HeroComponent from "@/components/layouts/EcommerceLayout/Home/Hero";
import SectionProducts from "@/components/layouts/EcommerceLayout/Home/SectionProducts";
import { getHomeFeaturedProductsBySession } from "@/lib/wp/wpData";

export default async function Home() {
  const pageData = await fetchPageData("home");

  const session2 = await getHomeFeaturedProductsBySession(203, 2);
  const session3 = await getHomeFeaturedProductsBySession(203, 3);
  const session5 = await getHomeFeaturedProductsBySession(203, 5);
  const session7 = await getHomeFeaturedProductsBySession(203, 7);
  const session8 = await getHomeFeaturedProductsBySession(203, 8);

  return (
    <main className="min-h-screen">
      <HeroComponent data={pageData.hero} />

      <SectionProducts title={session2.title} products={session2.products} />

      <SectionProducts title={session3.title} products={session3.products} />

      <FeaturedFrame data={pageData.acf} />

      <SectionProducts title={session5.title} products={session5.products} />

      <BannerSection6 data={pageData.sessao6} />

      <SectionProducts title={session7.title} products={session7.products} />

      <SectionProducts title={session8.title} products={session8.products} />
    </main>
  );
}
