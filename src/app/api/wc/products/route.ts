import { NextRequest, NextResponse } from "next/server";
import { getProductById, getProductBySlug, getProducts } from "@/lib/products";
import { Product } from "@/types/product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  if (id) {
    const data = (await getProductById(id)) as Product; // assertion
    const productWithTags: Product = {
      ...data,
      tags: data.tags || [],
    };
    return NextResponse.json([productWithTags]);
  }

  if (slug) {
    const data = (await getProductBySlug(slug)) as Product; // assertion
    const productWithTags: Product = {
      ...data,
      tags: data.tags || [],
    };
    return NextResponse.json(productWithTags);
  }

  const params = Object.fromEntries(searchParams.entries());
  const data = (await getProducts(params)) as Product[]; // assertion

  const productsWithTags: Product[] = (data || []).map((p) => ({
    ...p,
    tags: p.tags || [],
    price: Number(p.price),
  }));

  return NextResponse.json(productsWithTags);
}

export async function PUT(req: NextRequest) {
  const WP = process.env.WOO_SITE_URL!;
  const CK = process.env.WOO_CONSUMER_KEY!;
  const CS = process.env.WOO_CONSUMER_SECRET!;

  const jwt = req.cookies.get("wp_jwt")?.value;
  if (!jwt)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body: Partial<Product> & { id?: number } = await req.json();
  if (!body?.id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await fetch(
    `${WP}/wp-json/wc/v3/products/${body.id}?consumer_key=${CK}&consumer_secret=${CS}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
