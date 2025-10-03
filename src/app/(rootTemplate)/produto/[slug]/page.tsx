// app/(ecommerce)/product/[slug]/page.tsx
import ProductTemplate from "@/components/templates/Product";
import { getProductBySlug, getPageProduto } from "@/lib/products";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  const page = await getPageProduto();

  if (!product) return notFound();
  if (!page) throw new Error("Página do produto não encontrada");

  return <ProductTemplate product={product} page={page} />;
}
