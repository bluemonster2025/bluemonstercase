export type Banner = {
  desktop?: { databaseId?: number; src: string; alt: string };
  mobile?: { databaseId?: number; src: string; alt: string };
};

export type SessaoProduct = {
  id: string;
  title: string;
  uri?: string;
  price?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string | null;
    } | null;
  };
  productTags?: { nodes: { name: string }[] };
};

export type ProductSession = {
  title?: string;
  featuredProducts?: SessaoProduct[];
};

export type Sessao4 = {
  image?: { src: string; alt?: string; databaseId?: number };
  title?: string;
  text?: string;
  linkButton?: string;
};

export type RawHome = {
  databaseId: number;
  slug: string;
  title: string;
  homeHero?: {
    heroImage?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
    heroImageMobile?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
  } | null;
  homeSessao2?: {
    titleSessao2?: string | null;
    featuredProducts2?: { nodes: SessaoProduct[] } | null;
  } | null;
  homeSessao3?: {
    titleSessao3?: string | null;
    featuredProducts3?: { nodes: SessaoProduct[] } | null;
  } | null;
  homeSessao4?: {
    imageSessao4?: {
      node: { sourceUrl: string; altText: string | null };
    } | null;
    titleSessao4?: string | null;
    textSessao4?: string | null;
    linkButtonSessao4?: string | null;
  } | null;
  homeSessao5?: {
    featuredProducts5?: { nodes: SessaoProduct[] } | null;
  } | null;
  homeBanner?: {
    homeBannerDesktop?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
    homeBannerMobile?: {
      node: { id: number; sourceUrl: string; altText: string | null };
    } | null;
  } | null;
  homeSessao7?: {
    titleSessao7?: string | null;
    featuredProducts7?: { nodes: SessaoProduct[] } | null;
  } | null;
};

export type PageHome = {
  databaseId: number;
  slug: string;
  title: string;
  hero?: Banner;
  sessao2?: ProductSession;
  sessao3?: ProductSession;
  sessao4?: Sessao4;
  sessao5?: ProductSession;
  banner?: Banner;
  sessao7?: ProductSession;
};
