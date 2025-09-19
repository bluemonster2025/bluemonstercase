"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BuyButton from "@/components/elements/BuyButton";
import { Product } from "@/types/product";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { useCategories } from "@/components/context/EcommerceContext/context";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Section } from "@/components/elements/Section";

type RelatedProductsProps = {
  ids: number[];
  title: string;
  pBottom?: string;
};

export default function RelatedProducts({
  ids,
  title,
  pBottom,
}: RelatedProductsProps) {
  const [related, setRelated] = useState<Product[]>([]);
  const { loading } = useCategories(); // usa loading do contexto
  const skeletonCount = 4;

  useEffect(() => {
    if (ids && ids.length > 0) {
      Promise.all(
        ids
          .slice(0, 4)
          .map((id) => fetch(`/api/wc/products?id=${id}`).then((r) => r.json()))
      ).then((res) => {
        setRelated(res.flat());
      });
    }
  }, [ids]);

  // Configuração do Keen Slider
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1.5, spacing: 16 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.5, spacing: 16 },
      },
    },
  });

  return (
    <div className={`${pBottom}`}>
      <Section>
        <Title
          as="h3"
          className="text-lg md:text-[22px] font-semibold mb-10 lg:mb-4"
        >
          {title}
        </Title>

        {/* Desktop → Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6 items-stretch">
          {loading
            ? [...Array(skeletonCount)].map((_, i) => (
                <div key={i} className="flex flex-col h-full">
                  <Skeleton className="w-full h-48 rounded-lg" />
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-8 w-1/2 rounded" />
                    <Skeleton className="h-10 w-full rounded mt-auto" />
                  </div>
                </div>
              ))
            : related.map((item) => {
                const productImage =
                  item.images?.[0]?.src || "/images/placeholder.png";
                return (
                  <div key={item.id} className="flex flex-col h-full">
                    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                      {item.tags && item.tags.length > 0 && (
                        <div className="absolute top-0 right-0 flex gap-1 z-10">
                          <span className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10">
                            {item.tags[0].name}
                          </span>
                        </div>
                      )}

                      <Image
                        src={productImage}
                        alt={item.images?.[0]?.alt || item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain"
                      />

                      <Link
                        href={`/produto/${item.slug || item.id}`}
                        className="absolute inset-0 z-0"
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <Title
                        as="h2"
                        className="font-semibold text-sm text-grayscale-400 line-clamp-2"
                      >
                        {item.name}
                      </Title>

                      <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                        {item.price !== undefined ? (
                          <>
                            <span className="text-xs font-medium">R$</span>
                            <span className="text-[32px] font-bold">
                              {Math.floor(item.price)}
                            </span>
                            <span className="text-xs font-medium">
                              ,
                              {((item.price % 1) * 100)
                                .toFixed(0)
                                .padStart(2, "0")}
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </Text>
                    </div>

                    <div className="mt-auto flex gap-2 pt-3 text-center">
                      <BuyButton produto={item} title="Comprar" />
                    </div>
                  </div>
                );
              })}
        </div>
      </Section>
      {/* Mobile & Tablet → Keen Slider */}
      {loading ? (
        <>
          {/* Mobile skeleton */}
          <div className="block md:hidden px-5 pb-16">
            <Skeleton className="w-full h-48 rounded-lg" />
            <div className="p-4 flex-1 flex flex-col gap-2">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-8 w-1/2 rounded" />
              <Skeleton className="h-10 w-full rounded mt-auto" />
            </div>
          </div>

          {/* Tablet skeleton */}
          <div className="hidden md:grid lg:hidden grid-cols-3 gap-6 px-5 pb-16 items-stretch">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col h-full">
                <Skeleton className="w-full h-48 rounded-lg" />
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-8 w-1/2 rounded" />
                  <Skeleton className="h-10 w-full rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="block lg:hidden pb-16 items-stretch">
          <div ref={sliderRef} className="keen-slider">
            {related.map((item) => {
              const productImage =
                item.images?.[0]?.src || "/images/placeholder.png";
              return (
                <div
                  key={item.id}
                  className="keen-slider__slide flex flex-col h-full pl-1"
                >
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                    {item.tags && item.tags.length > 0 && (
                      <div className="absolute top-0 right-0 flex gap-1 z-10">
                        <span className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10">
                          {item.tags[0].name}
                        </span>
                      </div>
                    )}

                    <Image
                      src={productImage}
                      alt={item.images?.[0]?.alt || item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain"
                    />

                    <Link
                      href={`/produto/${item.slug || item.id}`}
                      className="absolute inset-0 z-0"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <Title
                      as="h2"
                      className="font-semibold text-sm text-grayscale-400 line-clamp-2"
                    >
                      {item.name}
                    </Title>

                    <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                      {item.price !== undefined ? (
                        <>
                          <span className="text-xs font-medium">R$</span>
                          <span className="text-[32px] font-bold">
                            {Math.floor(item.price)}
                          </span>
                          <span className="text-xs font-medium">
                            ,
                            {((item.price % 1) * 100)
                              .toFixed(0)
                              .padStart(2, "0")}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </Text>
                  </div>

                  <div className="mt-auto flex gap-2 pt-3 text-center">
                    <BuyButton produto={item} title="Comprar" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
