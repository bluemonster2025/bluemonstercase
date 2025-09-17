"use client";

import Image from "next/image";
import Link from "next/link";
import { Text, Title } from "@/components/elements/Texts";
import BuyButton from "@/components/elements/BuyButton";
import Icon from "@/components/elements/Icon";
import { Skeleton } from "@/components/elements/Skeleton";
import { Product, ProductVariation, ProductAttribute } from "@/types/product";
import { useState } from "react";

interface Props {
  product: Product;
  mainImage: string;
  setMainImage: (src: string) => void;
  selectedVar: ProductVariation | null;
  variacoes: ProductVariation[];
  setSelectedVar: (v: ProductVariation) => void;
}

export default function ProductInfo({
  product,
  mainImage,
  setMainImage,
  selectedVar,
  variacoes,
  setSelectedVar,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);

  // ⚡ Função para converter attributes da variação para o formato ProductAttribute[]
  const mapVariationAttributes = (
    attrs?: { name: string; option: string }[]
  ): ProductAttribute[] | undefined => {
    return attrs?.map((a) => ({
      name: a.name,
      options: [a.option],
    }));
  };

  // Produto que será usado no BuyButton, sempre tipado como Product
  const produtoParaComprar: Product = {
    ...product,
    price: selectedVar?.price || product.price,
    images: selectedVar?.image ? [selectedVar.image] : product.images,
    attributes: mapVariationAttributes(selectedVar?.attributes),
  };

  return (
    <div>
      {/* Categorias */}
      <div className="text-sm text-grayscale-350 font-semibold mb-5">
        {product.categories?.map((c, i) => (
          <span key={c.id}>
            {i > 0 && <span className="mx-2">{">"}</span>}
            {i === 0 ? (
              <Link href={`/categoria/${c.slug}`}>{c.name}</Link>
            ) : (
              <span>{c.name}</span>
            )}
          </span>
        ))}
      </div>

      {/* Nome e descrição curta */}
      <Title as="h3" className="text-2xl font-semibold mb-6">
        {product.name}
      </Title>
      <div
        className="mb-4 text-grayscale-350 text-sm/[24px]"
        dangerouslySetInnerHTML={{ __html: product.short_description || "" }}
      />

      {/* Produto variável */}
      {product.type === "variable" && (
        <div className="flex flex-col gap-2 py-4 relative">
          <Text className="mb-2 text-sm text-grayscale-350">
            Escolha a cor:
          </Text>
          <div className="border border-grayscale-100 rounded cursor-pointer w-full md:w-[300px]">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 cursor-pointer"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {selectedVar ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 relative rounded overflow-hidden">
                    <Image
                      src={selectedVar.image?.src || "/images/placeholder.png"}
                      alt={selectedVar.attributes
                        ?.map((a) => a.option)
                        .join(" / ")}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>

                  <Text className="text-grayscale-450 text-sm">
                    {selectedVar.attributes?.map((a) => a.option).join(" / ")}
                  </Text>
                </div>
              ) : (
                <Skeleton className="h-6 w-65 rounded" />
              )}
              <Icon name="IoIosArrowDown" color="#272934" size={16} />
            </button>

            {openDropdown && (
              <div className="absolute z-10 w-full md:w-[300px] bg-white border border-grayscale-100 rounded mt-1 max-h-60 overflow-auto cursor-pointer">
                {variacoes
                  .filter((v) => v.id !== selectedVar?.id)
                  .map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVar(v);
                        setMainImage(v.image?.src || mainImage);
                        setOpenDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="w-8 h-8 relative rounded overflow-hidden">
                        <Image
                          src={v.image?.src || "/images/placeholder.png"}
                          alt={v.attributes?.map((a) => a.option).join(" / ")}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>

                      <Text className="text-grayscale-450 text-sm">
                        {v.attributes?.map((a) => a.option).join(" / ")}
                      </Text>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preço */}
      <div className="mb-3 text-5xl font-semibold text-grayscale-400">
        R${" "}
        {produtoParaComprar.price
          ? new Intl.NumberFormat("pt-BR", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(produtoParaComprar.price))
          : "-"}
      </div>

      {/* Observação de compra */}
      <div
        className="mb-7 text-grayscale-400 text-xs/[16px]"
        dangerouslySetInnerHTML={{ __html: product.purchase_note || "" }}
      />

      {/* Botão de compra */}
      <div className="w-full md:w-[270px] mb-6">
        <BuyButton
          produto={produtoParaComprar} // ✅ sempre tipado como Product
          variant="secondary"
          title="Reserve o seu agora mesmo"
          icon="BsWhatsapp"
        />
      </div>

      {/* Formas de pagamento para produtos simples */}
      {product.type !== "variable" && (
        <div>
          <Title
            as="h3"
            className="text-grayscale-350 font-bold text-sm uppercase"
          >
            Formas de pagamento
          </Title>
          <div className="flex-1 relative w-full max-w-[185px] h-[38px] md:h-[38px]">
            <Image
              src="https://cms.bluemonstercase.com/wp-content/uploads/2025/09/pagamento.webp"
              alt="Formas de pagamento"
              fill
              sizes="(max-width: 768px) 100vw, 185px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
