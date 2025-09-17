"use client";
import { Title } from "@/components/elements/Texts";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  return (
    <div>
      <Title as="h3" className="font-semibold mb-14 text-[22px]/[24px]">
        Detalhes do produto
      </Title>
      <div
        className="mb-12 text-grayscale-350 text-sm"
        dangerouslySetInnerHTML={{ __html: product.description || "" }}
      />
    </div>
  );
}
