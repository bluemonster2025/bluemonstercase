"use client";

import { Section } from "@/components/elements/Section";

interface HeroProps {
  imgUrlMobile?: string;
  imgUrlDesktop?: string;
}

export default function HeroComponent({
  imgUrlMobile,
  imgUrlDesktop,
}: HeroProps) {
  if (!imgUrlMobile && !imgUrlDesktop) return <p>Nenhum banner cadastrado</p>;
  return (
    <>
      <Section className="hidden md:block pb-12 md:pb-2 lg:pt-8 ">
        <div
          className="relative w-full md:aspect-[3.51/1] bg-cover bg-no-repeat bg-center md:rounded-3xl"
          style={{ backgroundImage: `url(${imgUrlDesktop})` }}
        ></div>
      </Section>
      <div className="pb-8">
        <div
          className="block md:hidden relative w-full aspect-square bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${imgUrlMobile})` }}
        ></div>
      </div>
    </>
  );
}
