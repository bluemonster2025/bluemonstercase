import { siteConfig } from "@/types/siteConfig";
import { mapSiteConfig } from "@/utils/mappers/mapSiteConfig";

export async function getSiteConfigClient(): Promise<siteConfig | null> {
  try {
    const res = await fetch("/api/siteConfig", { cache: "no-store" });
    if (!res.ok) return null;

    const raw = await res.json();
    return mapSiteConfig(raw);
  } catch (err) {
    console.error("Erro ao buscar siteConfig no client:", err);
    return null;
  }
}
