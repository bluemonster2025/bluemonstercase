import { NextRequest, NextResponse } from "next/server";

const WP = process.env.WOO_SITE_URL;
const CK = process.env.WOO_CONSUMER_KEY;
const CS = process.env.WOO_CONSUMER_SECRET;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");
  if (!product_id) return NextResponse.json([], { status: 400 });

  const url = `${WP}/wp-json/wc/v3/products/${product_id}/variations?consumer_key=${CK}&consumer_secret=${CS}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}
