import {
  PageHome,
  RawHome,
  Banner,
  Sessao4,
  SessaoProduct,
  ProductSession,
} from "@/types/home";

// Função básica para mapear sessão sem tags/visible
export function mapRawSession(rawSession?: {
  title?: string | null;
  featuredProducts?: { nodes: SessaoProduct[] } | null;
}): ProductSession | undefined {
  if (!rawSession) return undefined;

  const featuredProducts: SessaoProduct[] =
    rawSession.featuredProducts?.nodes.map((p) => ({
      ...p,
      customTag: p.customTag || "",
      visible: p.visible ?? true,
    })) || [];

  return {
    title: rawSession.title || undefined,
    featuredProducts,
  };
}

// 🔹 Função genérica para mapear sessão com tags e visible
function mapRawSessionWithTagsAndVisible(
  rawSession?: {
    title?: string | null;
    featuredProducts?: { nodes: SessaoProduct[] } | null;
  },
  tags?: Record<string, string>,
  visibleTags?: Record<string, boolean>
): ProductSession | undefined {
  if (!rawSession) return undefined;

  const featuredProducts: SessaoProduct[] =
    rawSession.featuredProducts?.nodes.map((p) => ({
      ...p,
      customTag: (tags && tags[p.id]) || "",
      visible:
        (visibleTags && typeof visibleTags[p.id] !== "undefined"
          ? visibleTags[p.id]
          : true) ?? true,
    })) || [];

  return {
    title: rawSession.title || undefined,
    featuredProducts,
  };
}

// 🔹 Função genérica para parsear tags JSON
function parseFeaturedTags(tagsJson?: string | null): Record<string, string> {
  if (!tagsJson) return {};
  try {
    return JSON.parse(tagsJson);
  } catch {
    return {};
  }
}

// 🔹 Função genérica para parsear visible JSON
function parseVisibleTags(
  visibleJson?: string | null
): Record<string, boolean> {
  if (!visibleJson) return {};
  try {
    const parsed = JSON.parse(visibleJson);
    // garante boolean
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, v === true || v === "true"])
    );
  } catch {
    return {};
  }
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
      : { src: "", alt: "" },
    mobile: mobileNode
      ? {
          databaseId: mobileNode.databaseId,
          src: mobileNode.sourceUrl,
          alt: mobileNode.altText || "",
        }
      : { src: "", alt: "" },
  });

  // 🔹 Parse tags e visible de todas as sessões
  const sessao2Tags = parseFeaturedTags(raw.homeSessao2?.featuredTags2);
  const sessao3Tags = parseFeaturedTags(raw.homeSessao3?.featuredTags3);
  const sessao5Tags = parseFeaturedTags(raw.homeSessao5?.featuredTags5);
  const sessao7Tags = parseFeaturedTags(raw.homeSessao7?.featuredTags7);

  const sessao2Visible = parseVisibleTags(raw.homeSessao2?.visibleTag);
  const sessao3Visible = parseVisibleTags(raw.homeSessao3?.visibleTag);
  const sessao5Visible = parseVisibleTags(raw.homeSessao5?.visibleTag);
  const sessao7Visible = parseVisibleTags(raw.homeSessao7?.visibleTag);

  const sessao2 = mapRawSessionWithTagsAndVisible(
    {
      title: raw.homeSessao2?.titleSessao2,
      featuredProducts: raw.homeSessao2?.featuredProducts2,
    },
    sessao2Tags,
    sessao2Visible
  );

  const sessao3 = mapRawSessionWithTagsAndVisible(
    {
      title: raw.homeSessao3?.titleSessao3,
      featuredProducts: raw.homeSessao3?.featuredProducts3,
    },
    sessao3Tags,
    sessao3Visible
  );

  const sessao4Node = raw.homeSessao4?.imageSessao4?.node;
  const sessao4: Sessao4 | undefined = sessao4Node
    ? {
        image: { src: sessao4Node.sourceUrl, alt: sessao4Node.altText || "" },
        title: raw.homeSessao4?.titleSessao4 || undefined,
        text: raw.homeSessao4?.textSessao4 || undefined,
        linkButton: raw.homeSessao4?.linkButtonSessao4 || undefined,
      }
    : undefined;

  const sessao5 = mapRawSessionWithTagsAndVisible(
    { featuredProducts: raw.homeSessao5?.featuredProducts5 },
    sessao5Tags,
    sessao5Visible
  );

  const sessao7 = mapRawSessionWithTagsAndVisible(
    {
      title: raw.homeSessao7?.titleSessao7,
      featuredProducts: raw.homeSessao7?.featuredProducts7,
    },
    sessao7Tags,
    sessao7Visible
  );

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
