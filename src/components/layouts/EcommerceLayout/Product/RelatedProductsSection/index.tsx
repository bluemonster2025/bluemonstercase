import RelatedProducts from "@/components/layouts/EcommerceLayout/Product/RelatedProducts";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function RelatedProductsSection({ product }: Props) {
  return (
    <>
      {(product.cross_sell_ids || []).length > 0 && (
        <RelatedProducts
          ids={product.cross_sell_ids || []}
          title="Compre também"
          pBottom="pb-16"
        />
      )}
      {(product.upsell_ids || []).length > 0 && (
        <RelatedProducts
          ids={product.upsell_ids || []}
          title="Itens Relacionados"
        />
      )}
    </>
  );
}
