export type Banner = {
  desktop?: { src: string; alt: string };
  mobile?: { src: string; alt: string };
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
  image?: { src: string; alt: string };
  title?: string;
  text?: string;
  linkButton?: string;
};

export type RawHome = {
  id: string;
  slug: string;
  title: string;
  homeHero?: {
    heroImage?: { node: { sourceUrl: string; altText: string | null } } | null;
    heroImageMobile?: {
      node: { sourceUrl: string; altText: string | null };
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
    titleSessao5?: string | null;
    featuredProducts5?: { nodes: SessaoProduct[] } | null;
  } | null;

  homeBanner?: {
    homeBannerDesktop?: {
      node: { sourceUrl: string; altText: string | null };
    } | null;
    homeBannerMobile?: {
      node: { sourceUrl: string; altText: string | null };
    } | null;
  } | null;

  homeSessao7?: {
    titleSessao7?: string | null;
    featuredProducts7?: { nodes: SessaoProduct[] } | null;
  } | null;
};

export type PageHome = {
  id: string;
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
