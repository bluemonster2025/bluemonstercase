// app/utils/fetchPageData.ts

import { getPageACFBySlug } from "@/lib/wp/wpData";
import { PageACF } from "@/types/home";

export async function fetchPageData(slug: string): Promise<PageACF> {
  try {
    return await getPageACFBySlug(slug);
  } catch (error) {
    console.error(`Erro ao buscar página "${slug}":`, error);
    return getFallbackData();
  }
}

export async function fetchGlobalData(): Promise<PageACF> {
  try {
    return await getPageACFBySlug("home"); // sempre a Home
  } catch (error) {
    console.error("Erro ao buscar dados globais (Home):", error);
    return getFallbackData();
  }
}

function getFallbackData(): PageACF {
  return {
    id: 0,
    hero: { hero_image: { id: 0, url: "/fallback.jpg" } },
    acf: {},
    sessao6: { id: 0, url: "/fallback.jpg" },
    logo: { id: 0, url: "/fallback.jpg" },
    productBanner: { id: 0, url: "/fallback.jpg" },
  } as PageACF;
}
