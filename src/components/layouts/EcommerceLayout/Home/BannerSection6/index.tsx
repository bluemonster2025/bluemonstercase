import { Section } from "@/components/elements/Section";
import { Sessao6Background } from "@/types/home";

interface BannerProps {
  data: Sessao6Background;
  fallbackImage?: string;
}

export default function BannerSection6({
  data,
  fallbackImage = "/fallback.jpg",
}: BannerProps) {
  const bgUrlDesktop = data?.image_sessao6.url || fallbackImage;

  const bgUrlDesktopMobile = data?.image_sessao6_mobile.url || fallbackImage;

  return (
    <>
      <Section className="hidden md:block pb-12 md:pb-2 lg:pt-8 ">
        <div
          className="relative w-full md:aspect-[3.51/1] bg-cover bg-no-repeat bg-center md:rounded-3xl"
          style={{ backgroundImage: `url(${bgUrlDesktop})` }}
        ></div>
      </Section>
      <div className="pb-8">
        <div
          className="block md:hidden relative w-full aspect-[1.44/1] bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${bgUrlDesktopMobile})` }}
        ></div>
      </div>
    </>
  );
}
