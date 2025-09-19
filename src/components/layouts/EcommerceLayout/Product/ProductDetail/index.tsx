"use client";

import { Section } from "@/components/elements/Section";
import { useProductVariations } from "@/components/hooks/useProductVariations";
import RelatedProducts from "@/components/layouts/EcommerceLayout/Product/RelatedProducts";
import { Product } from "@/types/product";
import ProductImages from "../ProductImages";
import ProductInfo from "../ProductInfo";
import ProductDetails from "../ProductDetails";
import { BannerProduct } from "@/types/home";
import ProductBannerSession from "../ProductBannerSession";

interface Props {
  produto?: Product;
  fallbackImage?: string;
  data?: BannerProduct;
}

export default function ProductDetail({ produto, fallbackImage, data }: Props) {
  const product = produto;
  const { variacoes, selectedVar, setSelectedVar, mainImage, setMainImage } =
    useProductVariations(product);

  const imgUrl = data?.url || fallbackImage;

  if (!product) return <Section>Produto não encontrado.</Section>;

  return (
    <>
      <Section className="md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <ProductImages
            product={product}
            mainImage={mainImage}
            setMainImage={setMainImage}
            selectedVar={selectedVar}
            setSelectedVar={setSelectedVar}
            variacoes={variacoes}
          />

          <ProductInfo
            product={product}
            mainImage={mainImage}
            setMainImage={setMainImage}
            selectedVar={selectedVar}
            setSelectedVar={setSelectedVar}
            variacoes={variacoes}
          />
        </div>
      </Section>

      {(product.cross_sell_ids || []).length > 0 && (
        <RelatedProducts
          ids={product.cross_sell_ids || []}
          title="Compre também"
          pBottom="lg:pb-16"
        />
      )}

      <Section className="md:pb-10">
        <ProductDetails product={product} />

        {/* Banner */}
        <ProductBannerSession imgUrl={imgUrl} />
      </Section>

      {(product.upsell_ids || []).length > 0 && (
        <RelatedProducts
          ids={product.upsell_ids || []}
          title="Itens Relacionados"
        />
      )}
    </>
  );
}
