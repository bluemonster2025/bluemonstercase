import { wcUrl, fetchWc } from "./wc";

export async function getProductById(id: string) {
  return fetchWc(wcUrl(`/products/${id}`));
}

export async function getProductBySlug(slug: string) {
  return fetchWc(wcUrl(`/products`, { slug }));
}

export async function getProducts(params: Record<string, string>) {
  return fetchWc(wcUrl(`/products`, params));
}
