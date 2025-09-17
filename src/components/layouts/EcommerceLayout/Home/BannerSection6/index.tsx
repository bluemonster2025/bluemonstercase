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
  const bgUrl = data?.url || fallbackImage;

  return (
    <Section className="pb-12">
      <div
        className="relative w-full aspect-[16/9] md:aspect-[3.51/1] bg-cover bg-no-repeat bg-center rounded-3xl"
        style={{ backgroundImage: `url(${bgUrl})` }}
      ></div>
    </Section>
  );
}
