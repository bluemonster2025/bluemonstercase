import {
  PageHome,
  RawHome,
  Banner,
  Sessao4,
  SessaoProduct,
  ProductSession,
} from "@/types/home";

export function mapRawSession(rawSession?: {
  title?: string | null;
  featuredProducts?: { nodes: SessaoProduct[] } | null;
}): ProductSession | undefined {
  if (!rawSession) return undefined;
  return {
    title: rawSession.title || undefined,
    featuredProducts: rawSession.featuredProducts?.nodes || [],
  };
}

export function mapHome(raw: RawHome): PageHome {
  const heroDesktop = raw.homeHero?.heroImage?.node;
  const heroMobile = raw.homeHero?.heroImageMobile?.node;
  const bannerDesktop = raw.homeBanner?.homeBannerDesktop?.node;
  const bannerMobile = raw.homeBanner?.homeBannerMobile?.node;

  const mapNodeToBanner = (
    desktopNode?: {
      databaseId?: number;
      sourceUrl: string;
      altText: string | null;
    },
    mobileNode?: {
      databaseId?: number;
      sourceUrl: string;
      altText: string | null;
    }
  ): Banner => ({
    desktop: desktopNode
      ? {
          databaseId: desktopNode.databaseId,
          src: desktopNode.sourceUrl,
          alt: desktopNode.altText || "",
        }
      : { src: "", alt: "" }, // garante estrutura correta
    mobile: mobileNode
      ? {
          databaseId: mobileNode.databaseId,
          src: mobileNode.sourceUrl,
          alt: mobileNode.altText || "",
        }
      : { src: "", alt: "" },
  });

  const sessao2 = mapRawSession({
    title: raw.homeSessao2?.titleSessao2 || undefined,
    featuredProducts: raw.homeSessao2?.featuredProducts2 || undefined,
  });

  const sessao3 = mapRawSession({
    title: raw.homeSessao3?.titleSessao3 || undefined,
    featuredProducts: raw.homeSessao3?.featuredProducts3 || undefined,
  });

  const sessao4Node = raw.homeSessao4?.imageSessao4?.node;
  const sessao4: Sessao4 | undefined = sessao4Node
    ? {
        image: { src: sessao4Node.sourceUrl, alt: sessao4Node.altText || "" },
        title: raw.homeSessao4?.titleSessao4 || undefined,
        text: raw.homeSessao4?.textSessao4 || undefined,
        linkButton: raw.homeSessao4?.linkButtonSessao4 || undefined,
      }
    : undefined;

  const sessao5 = mapRawSession({
    featuredProducts: raw.homeSessao5?.featuredProducts5 || undefined,
  });

  const sessao7 = mapRawSession({
    title: raw.homeSessao7?.titleSessao7 || undefined,
    featuredProducts: raw.homeSessao7?.featuredProducts7 || undefined,
  });

  return {
    databaseId: raw.databaseId,
    slug: raw.slug || "home",
    title: raw.title || "home",
    hero: mapNodeToBanner(heroDesktop, heroMobile),
    sessao2,
    sessao3,
    sessao4,
    sessao5,
    banner: mapNodeToBanner(bannerDesktop, bannerMobile),
    sessao7,
  };
}
