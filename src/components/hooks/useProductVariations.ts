"use client";

import { useEffect, useState } from "react";
import { Product, ProductVariation } from "@/types/product";

export function useProductVariations(product: Product | undefined) {
  const [variacoes, setVariacoes] = useState<ProductVariation[]>([]);
  const [selectedVar, setSelectedVar] = useState<ProductVariation | null>(null);
  const [mainImage, setMainImage] = useState<string>(
    product?.images?.[0]?.src || ""
  );

  useEffect(() => {
    if (!product) return;

    setMainImage(product.images?.[0]?.src || "");

    if (product.type === "variable") {
      fetch(`/api/wc/variations?product_id=${product.id}`)
        .then((res) => res.json())
        .then((variacoes: ProductVariation[]) => {
          setVariacoes(variacoes);

          // Seleciona variação padrão
          const defaultAttr = product.default_attributes?.[0];
          let defaultVar: ProductVariation | undefined;

          if (defaultAttr) {
            defaultVar = variacoes.find((v) =>
              v.attributes.some((a) => a.option === defaultAttr.option)
            );
          }

          if (!defaultVar && variacoes.length > 0) {
            defaultVar = variacoes[0];
          }

          if (defaultVar) {
            setSelectedVar(defaultVar);
            setMainImage(
              defaultVar.image?.src || product.images?.[0]?.src || ""
            );
          }
        })
        .catch((err) => console.error("Erro ao buscar variações:", err));
    }
  }, [product]);

  return { variacoes, selectedVar, setSelectedVar, mainImage, setMainImage };
}
