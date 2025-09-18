// Tipo para a imagem do Hero
export interface Background {
  id: number;
  url: string;
}

// Tipo do Hero
export interface Hero {
  hero_image: Background; // Desktop
  hero_image_mobile: Background; // Mobile
}

// Tipo do Featured Frame
export interface FeaturedFrameData {
  image?: {
    id?: number;
    url?: string;
  };
  title?: string;
  text?: string;
  link_button?: string;
}

// Tipo da Sessão 5
export interface Sessao6Background {
  image_sessao6: Background;
  image_sessao6_mobile: Background;
}

export interface Logo {
  id: number;
  url: string;
}

export interface BannerProduct {
  id: number;
  url: string;
}

// Tipo da página com ACF
export interface PageACF {
  id: number;
  hero: Hero; // contém desktop + mobile
  acf: FeaturedFrameData;
  sessao6: Sessao6Background;
  logo: Logo;
  productBanner: BannerProduct;
}

// Tipagem do retorno da API WooCommerce
export type WooProductAPI = {
  id: number;
  name: string;
  price?: string;
  permalink: string;
  images?: { src: string; alt?: string }[];
};

// -----------------------------
// Novo tipo para as imagens do WooCommerce
export interface WooProductImage {
  id: number;
  src: string;
  alt?: string;
}

// Tipo para a imagem do Hero ou banners
export interface ImageField {
  id: number;
  url: string;
}
