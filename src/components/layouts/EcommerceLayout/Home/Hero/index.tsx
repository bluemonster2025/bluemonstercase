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
  const bgUrl = data.hero_image?.url || fallbackImage;

  return (
    <Section className="pt-8 pb-12">
      <div
        className="relative w-full aspect-[16/9] md:aspect-[3.51/1] bg-cover bg-no-repeat bg-center rounded-3xl"
        style={{ backgroundImage: `url(${bgUrl})` }}
      ></div>
    </Section>
  );
}
