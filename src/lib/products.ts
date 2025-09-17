import { wcUrl, fetchWc } from "./wc";

export async function getProductById(id: string) {
  return fetchWc(wcUrl(`/products/${id}`));
}

export async function getProductBySlug(slug: string) {
  // ⚠️ WooCommerce retorna ARRAY mesmo que só exista 1 produto
  return fetchWc(wcUrl(`/products`, { slug }));
}

export async function getProducts(params: Record<string, string>) {
  return fetchWc(wcUrl(`/products`, params));
}
