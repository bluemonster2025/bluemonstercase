// Tipo para a imagem do Hero
export interface HeroBackground {
  id: number;
  url: string;
}

// Tipo do Hero
export interface Hero {
  hero_image: HeroBackground; // aqui usamos o mesmo nome do ACF
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
  id: number;
  url: string;
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
  hero: Hero;
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
