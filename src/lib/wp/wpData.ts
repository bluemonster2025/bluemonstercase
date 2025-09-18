// lib/wpData.ts
import { Background, PageACF, FeaturedFrameData } from "@/types/home";
import {
  Product,
  ProductImage,
  ProductCategory,
  ProductAttribute,
} from "@/types/product";
import { createWpApi } from "./wordpress";

const EMPTY_IMAGE: Background = { id: 0, url: "" };

type ImageField = number | { id?: number; url?: string } | undefined | null;

// --- Funções JWT ---
const getTokenSafe = async (): Promise<string | undefined> => {
  try {
    return process.env.WP_JWT_SECRET;
  } catch {
    return undefined;
  }
};

// --- Helpers de imagem ---
const resolveImage = async (
  img: ImageField,
  token?: string
): Promise<Background> => {
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

const getImageIfExists = async (field: ImageField, token?: string) => {
  return field ? await resolveImage(field, token) : EMPTY_IMAGE;
};

// --- Mapping ACF ---
const acfMapping = {
  hero: "hero_image",
  heroMobile: "hero_image_mobile",
  ImageSection6: "image_sessao6_mobile",
  acf: {
    image: "image_sessao4",
    title: "title_sessao4",
    text: "text_sessao4",
    link_button: "link_button_sessao4",
  },
  bannerSession6Desktop: "image_sessao6",
  bannerSession6Mobile: "image_sessao6_mobile",
  logo: "image_logo",
  productBanner: "product_banner_image",
};

// --- Páginas ---
export const getPageACFBySlug = async (slug: string): Promise<PageACF> => {
  const token = await getTokenSafe();
  const wpApi = createWpApi(token);

  const { data: pages } = await wpApi.get(`/wp/v2/pages?slug=${slug}`);
  if (!pages?.length)
    throw new Error(`Página com slug "${slug}" não encontrada`);

  const page = pages[0];
  const { data: acfData } = await wpApi.get(`/acf/v3/pages/${page.id}`);
  const acf = acfData.acf || {};

  // pegando as imagens do hero
  const hero_image = await getImageIfExists(acf[acfMapping.hero], token);
  const hero_image_mobile = await getImageIfExists(
    acf[acfMapping.heroMobile],
    token
  );
  const imageSession6Desktop = await getImageIfExists(
    acf[acfMapping.bannerSession6Desktop],
    token
  );
  const imageSession6Mobile = await getImageIfExists(
    acf[acfMapping.bannerSession6Mobile],
    token
  );
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
    hero: { hero_image, hero_image_mobile },
    acf: featuredFrame,
    sessao6: {
      image_sessao6: imageSession6Desktop,
      image_sessao6_mobile: imageSession6Mobile,
    },

    logo: imageLogo,
    productBanner: productBannerImage,
  };
};

// --- WooCommerce Mapper ---
const mapWooProductToProduct = async (p: {
  ID: number;
  post_title: string;
  post_name: string;
}): Promise<Product> => {
  try {
    type WooResponse = {
      id: number;
      name: string;
      price?: string;
      regular_price?: string;
      images?: { id: number; src: string; alt?: string }[];
      tags?: { id: number; name: string; slug?: string }[];
      categories?: { id: number; name: string; slug: string }[];
      attributes?: { name: string; options: string[] }[];
      type?: string;
      description?: string;
      short_description?: string;
      purchase_note?: string;
      upsell_ids?: number[];
      cross_sell_ids?: number[];
      default_attributes?: { name: string; option: string }[];
    };

    const { data: wcProduct } = await import("axios").then((axios) =>
      axios.default.get<WooResponse>(
        `${process.env.WOO_SITE_URL}/wp-json/wc/v3/products/${p.ID}`,
        {
          auth: {
            username: process.env.WOO_CONSUMER_KEY!,
            password: process.env.WOO_CONSUMER_SECRET!,
          },
        }
      )
    );

    const images: ProductImage[] = (wcProduct.images || []).map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt || wcProduct.name || p.post_title,
    }));

    const categories: ProductCategory[] = (wcProduct.categories || []).map(
      (c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })
    );

    const attributes: ProductAttribute[] = (wcProduct.attributes || []).map(
      (a) => ({
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
      tags: (wcProduct.tags || []).map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug || "",
      })),
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

// --- Produtos em destaque ---
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
