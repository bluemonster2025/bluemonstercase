import { UIProduct } from "@/types/uIProduct";
import { SessaoProduct } from "@/types/home";

export function mapSessionProductToUIProduct(p: SessaoProduct): UIProduct {
  return {
    id: p.id,
    name: p.title,
    uri: p.uri,
    image: {
      sourceUrl: p.featuredImage?.node?.sourceUrl || "/images/placeholder.png",
      altText: p.featuredImage?.node?.altText || p.title,
    },
    price: p.price ?? "0,00",
    tag: p.productTags?.nodes?.[0]?.name,
  };
}
