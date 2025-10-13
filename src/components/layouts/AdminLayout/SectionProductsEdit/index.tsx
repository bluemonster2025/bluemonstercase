"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { Section } from "@/components/elements/Section";
import { ButtonPrimary } from "@/components/elements/Button";
import { useProducts } from "@/hooks/useProducts";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "./Dialog";
import { RelatedProductNode } from "@/types/product";
import { parsePrice } from "@/utils/parsePrice";

type SectionProductsEditProps = {
  products: RelatedProductNode[];
  title: string;
  onUpdate: (index: number, newProduct: RelatedProductNode) => void;
  onTagChange: (index: number, checked: boolean) => void;
  onTitleChange?: (newTitle: string) => void;
};

export default function SectionProductsEdit({
  products,
  title,
  onUpdate,
  onTagChange,
  onTitleChange,
}: SectionProductsEditProps) {
  const { products: allProducts, loading } = useProducts();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [localTitle, setLocalTitle] = useState(title);

  const skeletonCount = 4;
  const displayedProducts = products.slice(0, 4);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allProducts;
    return allProducts.filter((prod) =>
      prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, searchQuery]);

  return (
    <Section>
      {/* Título editável */}
      <input
        type="text"
        value={localTitle}
        onChange={(e) => {
          setLocalTitle(e.target.value);
          onTitleChange?.(e.target.value);
        }}
        className="text-lg md:text-[22px] font-semibold mb-6 w-full border-b border-grayscale-300 focus:outline-none p-1"
        placeholder="Título da sessão"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {displayedProducts.length === 0
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
          : displayedProducts.map((item, index) => {
              const productImage =
                item?.image?.sourceUrl || "/images/placeholder.png";
              const tags = item.tags || []; // ✅ garante array
              const hasTag = tags.length > 0;

              return (
                <div
                  key={item?.id || index}
                  data-idx={index}
                  className="flex flex-col h-full border border-grayscale-200 rounded-lg overflow-hidden"
                >
                  <div className="relative w-full aspect-[2/1]">
                    <Image
                      src={productImage}
                      alt={item?.image?.altText || item?.name || "Produto"}
                      fill
                      className="object-contain bg-white"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <Title
                      as="h2"
                      className="font-semibold text-sm text-grayscale-400 line-clamp-2"
                    >
                      {item?.name || "Produto sem nome"}
                    </Title>

                    <Text className="text-grayscale-400 mt-2 flex items-baseline gap-1">
                      {item?.price ? (
                        <>
                          <span className="text-xs font-medium">R$</span>
                          <span className="text-[24px] font-bold">
                            {new Intl.NumberFormat("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(parsePrice(item.price))}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </Text>

                    {/* Checkbox para exibir tag */}
                    {hasTag && (
                      <label className="mt-2 flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={tags.length > 0}
                          onChange={(e) => onTagChange(index, e.target.checked)}
                        />
                        {tags[0]}
                      </label>
                    )}

                    <ButtonPrimary
                      className="mt-auto text-sm h-10"
                      onClick={() => setSelectedIndex(index)}
                    >
                      Editar produto
                    </ButtonPrimary>

                    {/* Dialog para trocar produto */}
                    <Dialog
                      open={selectedIndex === index}
                      onClose={() => setSelectedIndex(null)}
                    >
                      <DialogHeader className="flex justify-between items-center">
                        <DialogTitle>Escolher novo produto</DialogTitle>
                        <button
                          onClick={() => setSelectedIndex(null)}
                          className="text-grayscale-400 hover:text-grayscale-600 transition text-2xl font-bold cursor-pointer"
                          aria-label="Fechar"
                        >
                          ×
                        </button>
                      </DialogHeader>

                      <DialogContent>
                        <input
                          type="text"
                          placeholder="Buscar produtos..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full p-2 border rounded mb-4 focus:outline-none"
                        />

                        {loading ? (
                          <p>Carregando produtos...</p>
                        ) : filteredProducts.length === 0 ? (
                          <p>Nenhum produto encontrado.</p>
                        ) : (
                          <ul className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                            {filteredProducts.map((prod) => (
                              <li key={prod.id}>
                                <button
                                  className="w-full text-left p-2 hover:bg-gray-50 transition cursor-pointer"
                                  onClick={() => {
                                    if (selectedIndex !== null) {
                                      onUpdate(selectedIndex, prod);
                                      setSelectedIndex(null);
                                      setSearchQuery("");
                                    }
                                  }}
                                >
                                  {prod.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
      </div>
    </Section>
  );
}
