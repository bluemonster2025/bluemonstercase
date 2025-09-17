"use client";

import { ProductCardProps } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import BuyButton from "@/components/elements/BuyButton";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { useCategories } from "@/components/context/EcommerceContext/context";

export default function ProductCard({ produto }: ProductCardProps) {
  const { loading } = useCategories();

  if (loading) {
    // Skeleton de carregamento
    return (
      <div className="flex flex-col h-full">
        <Skeleton className="w-full h-48 rounded-lg" />
        <div className="p-4 flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-8 w-1/2 rounded" />
          <Skeleton className="h-10 w-full rounded mt-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg overflow-hidden">
      <Link href={`/produto/${produto.slug}`}>
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          {" "}
          {/* Tags */}
          {produto.tags && produto.tags.length > 0 && (
            <div className="absolute top-0 right-0 flex gap-1 z-10">
              <span
                key={produto.tags[0].id}
                className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10"
              >
                {produto.tags[0].name}
              </span>
            </div>
          )}
          {/* Imagem */}
          {produto.images?.[0] ? (
            <div className="w-full aspect-2/1 relative bg-white">
              <Image
                src={produto.images[0].src}
                alt={produto.images[0].alt || produto.name}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 flex items-center justify-center rounded-lg">
              Sem imagem
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex flex-col flex-1">
          <Title as="h3" className="font-semibold text-sm text-grayscale-400">
            {produto.name}
          </Title>

          <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
            {produto.price
              ? (() => {
                  const formatted = new Intl.NumberFormat("pt-BR", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(produto.price));

                  const [reais, centavos] = formatted.split(",");
                  return (
                    <>
                      <span className="text-xs font-medium">R$</span>
                      <span className="text-[32px] font-bold">{reais}</span>
                      <span className="text-xs font-medium">,{centavos}</span>
                    </>
                  );
                })()
              : "-"}
          </Text>
        </div>
      </Link>

      <div className="mt-auto flex gap-2 pt-3">
        <BuyButton produto={produto} title="Comprar" />
      </div>
    </div>
  );
}
