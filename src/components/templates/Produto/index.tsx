// app/components/templates/Produto/index.tsx
import ProductDetail from "@/components/layouts/EcommerceLayout/Product/ProductDetail";
import { BannerProduct } from "@/types/home";
import { Product } from "@/types/product";

interface ProductTemplateProps {
  produto: Product;
  data?: BannerProduct; // opcional
  fallbackImage?: string;
}

export default function ProductTemplate({
  produto,
  data,
  fallbackImage = "/images/placeholder.png",
}: ProductTemplateProps) {
  return (
    <ProductDetail
      produto={produto}
      data={data}
      fallbackImage={fallbackImage}
    />
  );
}
