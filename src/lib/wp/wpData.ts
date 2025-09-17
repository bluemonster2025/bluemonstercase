// lib/wpData.ts
import { HeroBackground, PageACF, FeaturedFrameData } from "@/types/home";
import { Product, ProductImage } from "@/types/product";
import { createWpApi } from "./wordpress";

const EMPTY_IMAGE: HeroBackground = { id: 0, url: "" };

type ImageField = number | { id?: number; url?: string } | undefined | null;

// Tipos WooCommerce
type WooProductImage = { id: number; src: string; alt?: string };
type WooProductTag = { id: number; name: string; slug?: string };
type WooProductCategory = { id: number; name: string; slug: string };
type WooProductAttribute = { name: string; options: string[] };

type WooProduct = {
  id: number;
  name: string;
  price?: string;
  regular_price?: string;
  images?: WooProductImage[];
  tags?: WooProductTag[];
  categories?: WooProductCategory[];
  attributes?: WooProductAttribute[];
  type?: string;
  description?: string;
  short_description?: string;
  purchase_note?: string;
  upsell_ids?: number[];
  cross_sell_ids?: number[];
  default_attributes?: { name: string; option: string }[];
};

// --- Funções JWT ---
const getTokenSafe = async (): Promise<string | undefined> => {
  try {
    // Aqui você poderia chamar uma função que pega o JWT do cookie ou gera novo
    const token = process.env.WP_JWT_SECRET; // ou outro método de pegar token
    return token;
  } catch {
    return undefined;
  }
};

/**
 * Resolve uma imagem do WordPress usando token JWT se houver
 */
const resolveImage = async (
  img: ImageField,
  token?: string
): Promise<HeroBackground> => {
  if (!img) return EMPTY_IMAGE;

  if (typeof img !== "number" && "url" in img) {
    return { id: img.id || 0, url: img.url || "" };
  }

  if (typeof img === "number") {
    try {
      const wpApi = createWpApi(token);
      const { data } = await wpApi.get(`/wp/v2/media/${img}`);
      return { id: data.id, url: data.source_url };
    } catch {
      return EMPTY_IMAGE;
    }
  }

  return EMPTY_IMAGE;
};

/**
 * Wrapper para buscar imagem se existir, agora aceita token JWT
 */
const getImageIfExists = async (field: ImageField, token?: string) => {
  return field ? await resolveImage(field, token) : EMPTY_IMAGE;
};

const acfMapping = {
  hero: "hero_image",
  acf: {
    image: "image_sessao4",
    title: "title_sessao4",
    text: "text_sessao4",
    link_button: "link_button_sessao4",
  },
  sessao6: "image_sessao6",
  logo: "image_logo",
  productBanner: "product_banner_image",
};

/**
 * Busca página pelo slug e retorna dados ACF
 */
export const getPageACFBySlug = async (slug: string): Promise<PageACF> => {
  const token = await getTokenSafe();
  const wpApi = createWpApi(token);

  const { data: pages } = await wpApi.get(`/wp/v2/pages?slug=${slug}`);
  if (!pages?.length)
    throw new Error(`Página com slug "${slug}" não encontrada`);

  const page = pages[0];
  const { data: acfData } = await wpApi.get(`/acf/v3/pages/${page.id}`);
  const acf = acfData.acf || {};

  const hero_image = await getImageIfExists(acf[acfMapping.hero], token);
  const sessao6 = await getImageIfExists(acf[acfMapping.sessao6], token);
  const imageLogo = await getImageIfExists(acf[acfMapping.logo], token);
  const productBannerImage = await getImageIfExists(
    acf[acfMapping.productBanner],
    token
  );

  const featuredFrame: FeaturedFrameData = {
    image: acf[acfMapping.acf.image]
      ? await resolveImage(acf[acfMapping.acf.image], token)
      : undefined,
    title: acf[acfMapping.acf.title],
    text: acf[acfMapping.acf.text],
    link_button: acf[acfMapping.acf.link_button],
  };

  return {
    id: page.id,
    hero: { hero_image },
    acf: featuredFrame,
    sessao6,
    logo: imageLogo,
    productBanner: productBannerImage,
  };
};

// --- WooCommerce mapping não foi alterado ---
const mapWooProductToProduct = async (p: {
  ID: number;
  post_title: string;
  post_name: string;
}): Promise<Product> => {
  try {
    const { data: wcProduct } = await import("axios").then((axios) =>
      axios.default.get<WooProduct>(
        `${process.env.WOO_SITE_URL}/wp-json/wc/v3/products/${p.ID}`,
        {
          auth: {
            username: process.env.WOO_CONSUMER_KEY!,
            password: process.env.WOO_CONSUMER_SECRET!,
          },
        }
      )
    );

    const images: ProductImage[] = (wcProduct.images || []).map(
      (img: WooProductImage) => ({
        id: img.id,
        src: img.src,
        alt: img.alt || wcProduct.name || p.post_title,
      })
    );

    const tags = (wcProduct.tags || []).map((t: WooProductTag) => ({
      id: t.id,
      name: t.name,
      slug: t.slug || "",
    }));

    const categories = (wcProduct.categories || []).map(
      (c: WooProductCategory) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })
    );

    const attributes = (wcProduct.attributes || []).map(
      (a: WooProductAttribute) => ({
        name: a.name,
        options: a.options,
      })
    );

    return {
      id: p.ID,
      name: wcProduct.name || p.post_title,
      price: Number(wcProduct.price) || Number(wcProduct.regular_price) || 0,
      link: `/produto/${p.post_name}`,
      images,
      tags,
      categories,
      attributes,
      type: wcProduct.type,
      description: wcProduct.description,
      short_description: wcProduct.short_description,
      purchase_note: wcProduct.purchase_note,
      upsell_ids: wcProduct.upsell_ids,
      cross_sell_ids: wcProduct.cross_sell_ids,
      default_attributes: wcProduct.default_attributes,
      slug: p.post_name,
    };
  } catch (err) {
    console.error(`Erro ao buscar produto WooCommerce ID ${p.ID}:`, err);
    return {
      id: p.ID,
      name: p.post_title,
      price: 0,
      link: `/produto/${p.post_name}`,
      images: [],
      tags: [],
      categories: [],
      attributes: [],
      slug: p.post_name,
    };
  }
};

/**
 * Busca produtos em destaque da home por sessão
 */
export const getHomeFeaturedProductsBySession = async (
  pageId: number,
  sessionNumber: number
): Promise<{ title: string; products: Product[] }> => {
  try {
    const token = await getTokenSafe();
    const wpApi = createWpApi(token);

    const { data: acfRes } = await wpApi.get(`/acf/v3/pages/${pageId}`);
    const acf = acfRes.acf || {};
    const title = acf[`title_sessao${sessionNumber}`] || "";
    const featuredProducts = acf[`featured_products_${sessionNumber}`] as
      | { ID: number; post_title: string; post_name: string }[]
      | undefined;

    if (!featuredProducts?.length) return { title, products: [] };

    const products: Product[] = await Promise.all(
      featuredProducts.map(mapWooProductToProduct)
    );
    return { title, products };
  } catch (err) {
    console.error(`Erro ao buscar produtos da sessão ${sessionNumber}:`, err);
    return { title: "", products: [] };
  }
};
