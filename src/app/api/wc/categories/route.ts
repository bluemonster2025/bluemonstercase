import { NextResponse } from "next/server";

const WP = process.env.WOO_SITE_URL;
const CK = process.env.WOO_CONSUMER_KEY;
const CS = process.env.WOO_CONSUMER_SECRET;

export async function GET() {
  try {
    const url = `${WP}/wp-json/wc/v3/products/categories?consumer_key=${CK}&consumer_secret=${CS}&per_page=100&hide_empty=false`;
    const res = await fetch(url, { next: { revalidate: 60 } }); // cache 60s
    if (!res.ok) throw new Error("Erro ao buscar categorias WooCommerce");

    const categories = await res.json();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
