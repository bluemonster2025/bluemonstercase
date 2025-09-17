"use client";

import Image from "next/image";
import { Product, ProductVariation, ProductImage } from "@/types/product";

interface Props {
  product: Product;
  mainImage: string;
  setMainImage: (src: string) => void;
  selectedVar: ProductVariation | null;
  setSelectedVar: (v: ProductVariation) => void;
  variacoes: ProductVariation[];
}

type Thumbnail = ProductVariation | ProductImage;

export default function ProductImages({
  product,
  mainImage,
  setMainImage,
  selectedVar,
  setSelectedVar,
  variacoes,
}: Props) {
  const imagesToShow: Thumbnail[] =
    product.type === "variable" ? variacoes : product.images || [];

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-7">
        {imagesToShow.length === 0
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded animate-pulse"
                />
              ))
          : imagesToShow.map((imgOrVar, i) => {
              const src =
                "src" in imgOrVar
                  ? imgOrVar.src
                  : imgOrVar.image?.src || "/images/placeholder.png";

              const isSelected =
                product.type === "variable"
                  ? selectedVar?.id === (imgOrVar as ProductVariation).id
                  : mainImage === src;

              return (
                <button
                  key={i}
                  onClick={() => {
                    setMainImage(src);
                    if (product.type === "variable") {
                      setSelectedVar(imgOrVar as ProductVariation);
                    }
                  }}
                  className={`overflow-hidden cursor-pointer ${
                    isSelected ? "border-gray-700" : "border-transparent"
                  }`}
                >
                  <div className="w-20 h-20 relative">
                    <Image
                      src={src}
                      alt={
                        product.type === "variable"
                          ? `Variação ${(imgOrVar as ProductVariation).id}`
                          : `${product.name} ${i}`
                      }
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>
                </button>
              );
            })}
      </div>

      {/* Imagem principal */}
      <div className="flex-1">
        <div className="w-full h-[420px] relative overflow-hidden">
          <Image
            src={mainImage || "/images/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
