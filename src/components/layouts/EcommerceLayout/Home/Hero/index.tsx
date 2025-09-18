"use client";

import { Section } from "@/components/elements/Section";
import { Hero } from "@/types/home";

interface HeroProps {
  data: Hero;
  fallbackImage?: string;
}

export default function HeroComponent({
  data,
  fallbackImage = "/fallback.jpg",
}: HeroProps) {
  const bgUrlDesktop = data.hero_image?.url || fallbackImage;

  const bgUrlMobile = data.hero_image_mobile?.url || fallbackImage;

  return (
    <>
      <Section className="hidden md:block lg:pt-8 pb-12">
        <div
          className="relative w-full md:aspect-[3.51/1] bg-cover bg-no-repeat bg-center md:rounded-3xl"
          style={{ backgroundImage: `url(${bgUrlDesktop})` }}
        ></div>
      </Section>
      <div
        className="block md:hidden relative w-full aspect-square bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${bgUrlMobile})` }}
      ></div>
    </>
  );
}
