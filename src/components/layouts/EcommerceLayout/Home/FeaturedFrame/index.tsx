"use client";

import Image from "next/image";
import { Section } from "@/components/elements/Section";
import { FeaturedFrameData } from "@/types/home";
import { Title } from "@/components/elements/Texts";

interface Props {
  data: FeaturedFrameData;
  fallbackImage?: string;
}

export default function FeaturedFrame({
  data,
  fallbackImage = "/fallback.jpg",
}: Props) {
  const imgUrl = data.image?.url || fallbackImage;

  return (
    <Section>
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Imagem */}
        <div className="flex-1 relative w-full max-w-[385px] aspect-[16/9] md:aspect-[0.88/1]">
          <Image
            src={imgUrl}
            alt={data.title || "Featured"}
            fill
            sizes="(max-width: 768px) 100vw, 385px"
            className="rounded-lg object-contain"
          />
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          {data.title && (
            <Title as="h3" className="text-3xl font-bold mb-4">
              {data.title}
            </Title>
          )}
          {data.text && <p className="text-gray-700 mb-6">{data.text}</p>}
          {data.link_button && (
            <a
              href={data.link_button}
              className="px-6 py-2 border border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white transition"
            >
              Saiba mais
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
