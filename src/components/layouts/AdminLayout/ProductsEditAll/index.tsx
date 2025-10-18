"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { Section } from "@/components/elements/Section";
import { Skeleton } from "@/components/elements/Skeleton";
import { Title, Text } from "@/components/elements/Texts";
import { parsePrice } from "@/utils/parsePrice";
import { ButtonPrimary } from "@/components/elements/Button";

type ProductsEditAllProps = {
  search: string;
  categoryId?: string; // ⚠️ agora é string
};

export default function ProductsEditAll({
  search,
  categoryId,
}: ProductsEditAllProps) {
  const { products, loading } = useProducts();
  const skeletonCount = 4;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.tag?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = !categoryId
        ? true
        : p.productCategories?.nodes?.some((cat) => cat.id === categoryId) ??
          false;

      console.log(
        "Produto:",
        p.name,
        "Categorias:",
        p.productCategories?.nodes,
        "Matches:",
        matchesCategory
      );

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryId]);

  return (
    <Section>
      <Title as="h3" className="text-sm text-grayscale-550 mb-8">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "Produto encontrado"
          : "Produtos encontrados"}
      </Title>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="flex flex-col h-full">
              <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                {p.tag && (
                  <div className="absolute top-0 right-0 flex gap-1 z-10">
                    <span className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10">
                      {p.tag}
                    </span>
                  </div>
                )}

                <Image
                  src={
                    p.image?.sourceUrl ||
                    "https://cms.bluemonstercase.com/wp-content/uploads/2025/09/imagem-indisponivel.webp"
                  }
                  alt={p.image?.altText || "Produto"}
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col gap-2">
                <Title
                  as="h2"
                  className="font-semibold text-sm text-grayscale-400"
                >
                  {p.name}
                </Title>

                <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                  {p.price !== undefined ? (
                    <>
                      <span className="text-xs font-medium">R$</span>
                      <span className="text-[32px] font-bold">
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(parsePrice(p.price))}
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </Text>
              </div>

              <ButtonPrimary
                target="_blank"
                href={p.slug ? `/editar-produto/${p.slug}` : "#"}
                className="mt-auto text-sm h-10 text-grayscale-550"
              >
                Editar produto
              </ButtonPrimary>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
