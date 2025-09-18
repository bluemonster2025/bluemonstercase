"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import BuyButton from "@/components/elements/BuyButton";
import { Section } from "@/components/elements/Section";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { useCategories } from "@/components/context/EcommerceContext/context";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface SectionProductsProps {
  title: string;
  products?: Product[];
}

export default function SectionProducts({
  title,
  products = [],
}: SectionProductsProps) {
  const { loading } = useCategories();
  const skeletonCount = 4;

  // Configuração do Keen Slider para mobile e tablet
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1.5,
      spacing: 16,
    },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.5, spacing: 16 },
      },
    },
  });

  return (
    <>
      <Section>
        <div className="flex flex-col gap-10">
          <Title
            as="h2"
            className="text-lg md:text-[22px] font-semibold text-black mb-7 lg:mb-4"
          >
            {title}
          </Title>

          {/* Desktop → Grid normal a partir de 1024px */}
          <div className="hidden lg:grid gap-6 grid-cols-4 items-stretch pb-16">
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
              : products.map((product) => {
                  const productImage =
                    product.images?.[0]?.src || "/images/placeholder.png";
                  return (
                    <div key={product.id} className="flex flex-col h-full">
                      <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                        {product.tags && product.tags.length > 0 && (
                          <div className="absolute top-0 right-0 flex gap-1 z-10">
                            <span className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10">
                              {product.tags[0].name}
                            </span>
                          </div>
                        )}

                        <Image
                          src={productImage}
                          alt={product.images?.[0]?.alt || product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 600px"
                          className="object-contain"
                        />

                        <Link
                          href={product.link || "#"}
                          className="absolute inset-0 z-0"
                        />
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <Title
                          as="h2"
                          className="font-semibold text-sm text-grayscale-400"
                        >
                          {product.name}
                        </Title>

                        <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                          {product.price !== undefined ? (
                            <>
                              <span className="text-xs font-medium">R$</span>
                              <span className="text-[32px] font-bold">
                                {Math.floor(product.price)}
                              </span>
                              <span className="text-xs font-medium">
                                ,
                                {((product.price % 1) * 100)
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
                        <BuyButton produto={product} title="Comprar" />
                      </div>
                    </div>
                  );
                })}
          </div>
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

          {/* Tablet skeleton 3 colunas */}
          <div className="hidden md:grid lg:hidden grid-cols-3 gap-6 px-5 pb-16">
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
        <div className="block lg:hidden pb-16">
          {" "}
          <div ref={sliderRef} className="keen-slider">
            {products.map((product) => {
              const productImage =
                product.images?.[0]?.src || "/images/placeholder.png";
              return (
                <div
                  key={product.id}
                  className="keen-slider__slide flex flex-col h-full pl-1"
                >
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                    {product.tags && product.tags.length > 0 && (
                      <div className="absolute top-0 right-0 flex gap-1 z-10">
                        <span className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10">
                          {product.tags[0].name}
                        </span>
                      </div>
                    )}

                    <Image
                      src={productImage}
                      alt={product.images?.[0]?.alt || product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain"
                    />

                    <Link
                      href={product.link || "#"}
                      className="absolute inset-0 z-0"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <Title
                      as="h2"
                      className="font-semibold text-sm text-grayscale-400"
                    >
                      {product.name}
                    </Title>

                    <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                      {product.price !== undefined ? (
                        <>
                          <span className="text-xs font-medium">R$</span>
                          <span className="text-[32px] font-bold">
                            {Math.floor(product.price)}
                          </span>
                          <span className="text-xs font-medium">
                            ,
                            {((product.price % 1) * 100)
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
                    <BuyButton produto={product} title="Comprar" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
