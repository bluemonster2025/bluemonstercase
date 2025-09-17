import { NextRequest, NextResponse } from "next/server";
import { getProductById, getProductBySlug, getProducts } from "@/lib/products";
import { Product } from "@/types/product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  if (id) {
    const data = (await getProductById(id)) as Product;
    const productWithTags: Product = {
      ...data,
      tags: data.tags || [],
    };
    return NextResponse.json([productWithTags]);
  }

  if (slug) {
    const data = (await getProductBySlug(slug)) as Product[]; // ✅ array
    const product = data?.[0];
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }
    const productWithTags: Product = {
      ...product,
      tags: product.tags || [],
    };
    return NextResponse.json(productWithTags);
  }

  const params = Object.fromEntries(searchParams.entries());
  const data = (await getProducts(params)) as Product[];

  const productsWithTags: Product[] = (data || []).map((p) => ({
    ...p,
    tags: p.tags || [],
    price: Number(p.price),
  }));

  return NextResponse.json(productsWithTags);
}
