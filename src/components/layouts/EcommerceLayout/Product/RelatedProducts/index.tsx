"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BuyButton from "@/components/elements/BuyButton";
import { Product } from "@/types/product";
import { Title, Text } from "@/components/elements/Texts";

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

  if (related.length === 0) return null;

  return (
    <div className={`${pBottom}`}>
      <Title as="h3" className="text-[22px]/[24px] font-semibold mb-4">
        {title}
      </Title>

      {/* Grid que estica todos os itens igualmente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
        {related.map((item) => (
          <div key={item.id} className="p-4 flex flex-col cursor-pointer">
            <Link
              href={`/produto/${item.slug || item.id}`}
              className="flex-1 flex flex-col"
            >
              {/* Conteúdo do card */}
              <div className="relative flex-1 flex flex-col">
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="absolute top-0 right-0 flex gap-1 z-10">
                    <span
                      key={item.tags[0].id}
                      className="bg-redscale-100 text-white text-xs px-2 py-1 rounded-full font-bold w-10"
                    >
                      {item.tags[0].name}
                    </span>
                  </div>
                )}

                {/* Imagem */}
                <div className="w-full h-40 relative mb-3">
                  <Image
                    src={item.images?.[0]?.src || "/images/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-contain"
                  />
                </div>

                {/* Nome */}
                <Title
                  as="h3"
                  className="font-semibold text-sm line-clamp-2 text-grayscale-400 mb-2"
                >
                  {item.name}
                </Title>

                {/* Preço */}
                <Text className="text-grayscale-400 flex items-baseline gap-1">
                  {item.price
                    ? (() => {
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(item.price));

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

                {/* Purchase note (ou espaço vazio que se adapta automaticamente) */}
                <div className="text-grayscale-400 text-xs/[16px]">
                  {item.purchase_note && (
                    <div
                      dangerouslySetInnerHTML={{ __html: item.purchase_note }}
                    />
                  )}
                </div>
              </div>
            </Link>

            {/* Botão sempre no final */}
            <div className="mt-4">
              <BuyButton
                produto={item}
                title="Comprar"
                fontWeight="font-semibold"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
