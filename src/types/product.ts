export type ProductImage = {
  id?: number;
  src: string;
  alt?: string;
};

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export type ProductAttribute = {
  name: string;
  options: string[];
};

export type Product = {
  id: number;
  name: string;
  price: number;
  images?: ProductImage[];
  description?: string;
  short_description?: string;
  slug?: string;
  categories?: ProductCategory[];
  attributes?: ProductAttribute[];
  type?: string; // para produtos variáveis
  purchase_note?: string;
  upsell_ids?: number[];
  cross_sell_ids?: number[];
  default_attributes?: { name: string; option: string }[]; // adicionando aqui
  link?: string;
  tags?: {
    id: number;
    name: string;
    slug: string;
  }[];
};

// Props do ProductCard
export type ProductCardProps = {
  produto: Product;
};

export interface BannerProduct {
  id: number;
  url: string;
  title?: string;
}

// Props do BuyButton
export type BuyButtonProps = {
  produto: Product;
  title: string;
  icon?: string;
  variant?: "primary" | "secondary";
  fontWeight?: string;
};

// Props do ProductDetail
export type ProductDetailProps = {
  produto: Product;
};

// Tipagem para variações
export type ProductVariation = {
  id: number;
  price: number;
  image?: { src: string };
  attributes: { name: string; option: string }[];
};

export type AdminProduct = {
  id: number;
  name: string;
  price: number;
  regular_price?: string; // usado no envio para a API
};
