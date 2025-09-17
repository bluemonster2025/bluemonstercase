const WP = process.env.WOO_SITE_URL!;
const CK = process.env.WOO_CONSUMER_KEY!;
const CS = process.env.WOO_CONSUMER_SECRET!;

/**
 * Monta a URL da API do WooCommerce com credenciais.
 */
export function wcUrl(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${WP}/wp-json/wc/v3${path}`);
  url.searchParams.set("consumer_key", CK);
  url.searchParams.set("consumer_secret", CS);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

/**
 * Fetch genérico para WooCommerce.
 */
export async function fetchWc<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
