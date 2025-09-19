import { WooCategory, WooCategoryWithCovers } from "@/types/category";
import { NextResponse } from "next/server";

const WP = process.env.WOO_SITE_URL;
const CK = process.env.WOO_CONSUMER_KEY;
const CS = process.env.WOO_CONSUMER_SECRET;

// Função para criar URL do WooCommerce
const wcUrl = (endpoint: string) =>
  `${WP}/wp-json/wc/v3/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}&per_page=100&hide_empty=false`;

export async function GET() {
  try {
    // 1️⃣ Buscar categorias do WooCommerce
    const res = await fetch(wcUrl("products/categories"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Erro ao buscar categorias WooCommerce");

    const categories = await res.json();

    // 2️⃣ Para cada categoria, buscar ACF correspondente
    const categoriesWithCovers: WooCategoryWithCovers[] = await Promise.all(
      categories.map(async (cat: WooCategory) => {
        try {
          const acfRes = await fetch(
            `${WP}/wp-json/acf/v3/product_cat/${cat.id}`,
            {
              next: { revalidate: 60 },
            }
          );
          if (!acfRes.ok) return cat;

          const acfData = await acfRes.json();
          const acf = acfData.acf || {};

          return {
            ...cat,
            cover_desktop: acf.category_cover_desktop || "",
            cover_mobile: acf.category_cover_mobile || "",
            cover_video: acf.category_cover_video?.url || "", // 👈 novo campo de vídeo
          };
        } catch (err) {
          console.error(`Erro ao buscar ACF da categoria ${cat.id}:`, err);
          return cat;
        }
      })
    );

    return NextResponse.json({ categories: categoriesWithCovers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
