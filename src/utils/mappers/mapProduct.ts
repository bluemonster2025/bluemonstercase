import {
  Product,
  ImageNode,
  VariationNode,
  RelatedProductNode,
  RawTag,
} from "@/types/product";

// Tipos intermediários do GraphQL
interface RawImage {
  sourceUrl: string;
  altText?: string;
}

interface RawCategory {
  id: string;
  name: string;
  slug: string;
  parent?: { node: { id: string; name: string; slug: string } };
}

interface RawVariationAttribute {
  attributeId: string;
  name: string;
  value: string;
}

interface RawVariation {
  id: string;
  name: string;
  price?: string;
  purchaseNote?: string;
  image?: RawImage;
  attributes?: { nodes: RawVariationAttribute[] };
}

interface RawRelatedProduct {
  id: string;
  name: string;
  price?: string;
  image?: RawImage;
  type: "simple" | "variable" | "external" | "group";
  slug: string;
  productTags?: { nodes: RawTag[] }; // ✅ adicionado aqui
}

interface RawProduct {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  purchaseNote?: string;
  slug?: string;
  price?: string;
  image?: RawImage;
  galleryImages?: { nodes: RawImage[] };
  variations?: { nodes: RawVariation[] };
  productCategories?: { nodes: RawCategory[] };
  productTags?: { nodes: RawTag[] };
  crossSell?: { nodes: RawRelatedProduct[] };
  upsell?: { nodes: RawRelatedProduct[] };
  related?: { nodes: RawRelatedProduct[] };
}

// Função que mapeia o produto do GraphQL para nosso tipo Product
export function mapProduct(raw: RawProduct): Product {
  const image: ImageNode | undefined = raw.image
    ? { sourceUrl: raw.image.sourceUrl, altText: raw.image.altText || raw.name }
    : undefined;

  const galleryImages = raw.galleryImages?.nodes?.map((img) => ({
    sourceUrl: img.sourceUrl,
    altText: img.altText || raw.name,
  }));

  const productCategories = raw.productCategories?.nodes?.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent
      ? {
          node: {
            id: cat.parent.node.id,
            name: cat.parent.node.name,
            slug: cat.parent.node.slug,
          },
        }
      : undefined,
  }));

  const variations: VariationNode[] | undefined = raw.variations?.nodes?.map(
    (v) => ({
      id: v.id,
      name: v.name,
      price: v.price ?? "0",
      purchaseNote: v.purchaseNote ?? "",
      image: v.image
        ? { sourceUrl: v.image.sourceUrl, altText: v.image.altText || v.name }
        : undefined,
      attributes: v.attributes
        ? {
            nodes: v.attributes.nodes.map((attr) => ({
              attributeId: attr.attributeId,
              name: attr.name,
              value: attr.value,
            })),
          }
        : undefined,
    })
  );

  const mapRelated = (nodes?: RawRelatedProduct[]): RelatedProductNode[] =>
    nodes?.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price ?? "0",
      slug: p.slug,
      image: p.image
        ? { sourceUrl: p.image.sourceUrl, altText: p.image.altText || p.name }
        : undefined,
      type: p.type,
      tags: p.productTags?.nodes.map((t) => t.name) || [], // tags existentes
      customTag: "", // inicializa tag editável
      visible: true, // inicializa visibilidade como true
    })) || [];

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    shortDescription: raw.shortDescription ?? "",
    price: raw.price ?? "0",
    purchaseNote: raw.purchaseNote ?? "",
    slug: raw.slug || raw.id,
    image,
    galleryImages: galleryImages ? { nodes: galleryImages } : undefined,
    productCategories: productCategories
      ? { nodes: productCategories }
      : undefined,
    variations: variations ? { nodes: variations } : undefined,
    crossSell: raw.crossSell
      ? { nodes: mapRelated(raw.crossSell.nodes) }
      : undefined,
    upsell: raw.upsell ? { nodes: mapRelated(raw.upsell.nodes) } : undefined,
    tag: raw.productTags?.nodes?.[0]?.name || "",
  };
}
