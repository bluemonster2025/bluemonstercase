"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/elements/Skeleton";
import BuyButton from "@/components/elements/BuyButton";
import { Title, Text } from "@/components/elements/Texts";

type SearchResultsProps = {
  products: Product[];
  loadingProducts: boolean;
  search: string;
};

export default function SearchResults({
  products,
  loadingProducts,
  search,
}: SearchResultsProps) {
  const skeletonCount = 4;

  return (
    <div>
      <Title as="h3" className="text-[16px] font-semibold mb-8">
        Resultados da busca por &quot;{search}&quot;
      </Title>

      {loadingProducts ? (
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8">
          {[...Array(skeletonCount)].map((_, i) => (
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
      ) : products.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8 items-stretch">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col">
              <Link href={product.slug ? `/produto/${product.slug}` : "#"}>
                <div className="relative w-full aspect-2/1 rounded-lg overflow-hidden">
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="absolute top-0 right-0 flex gap-1 z-10">
                      <span
                        key={product.tags[0].id}
                        className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10"
                      >
                        {product.tags[0].name}
                      </span>
                    </div>
                  )}

                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <Title
                    as="h2"
                    className="font-semibold text-sm text-grayscale-400"
                  >
                    {product.name}
                  </Title>

                  <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                    {product.price
                      ? (() => {
                          const formatted = new Intl.NumberFormat("pt-BR", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(product.price));

                          const [reais, centavos] = formatted.split(",");
                          return (
                            <>
                              <span className="text-xs font-medium">R$</span>
                              <span className="text-[32px] font-bold">
                                {reais}
                              </span>
                              <span className="text-xs font-medium">
                                ,{centavos}
                              </span>
                            </>
                          );
                        })()
                      : "-"}
                  </Text>
                </div>
              </Link>
              <div className="mt-auto flex gap-2 pt-3 text-center">
                <BuyButton produto={product} title="Comprar" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
