import ProductTemplate from "@/components/templates/Produto";
import { getPageACFBySlug } from "@/lib/wp/wpData";

async function getProductBySlug(slug: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/wc/products?slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const arr = await res.json();
  return arr?.[0] ?? null;
}

// ✅ Tipagem correta
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params; // precisa dar await
  const [pageData, produto] = await Promise.all([
    getPageACFBySlug("produto"),
    getProductBySlug(slug),
  ]);

  if (!produto) {
    return <div className="p-6">Produto não encontrado</div>;
  }

  return <ProductTemplate produto={produto} data={pageData?.productBanner} />;
}
