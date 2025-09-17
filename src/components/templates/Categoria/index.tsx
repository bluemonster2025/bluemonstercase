import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { categoryCovers } from "./content";
import Image from "next/image";
import { Section } from "@/components/elements/Section";
import FilteredProducts from "@/components/layouts/EcommerceLayout/Categories/FilteredProducts";

// Buscar categoria pelo slug literal
async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wc/categories`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return undefined;

    const data = await res.json();
    const categories: Category[] = Array.isArray(data) ? data : data.categories;
    return categories.find((c) => c.slug === slug);
  } catch (err) {
    console.error("Erro ao buscar categoria:", err);
    return undefined;
  }
}

// Buscar produtos pela categoria
async function getProductsByCategoryId(id: number): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wc/products?category=${id}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];

    const data: Product[] = await res.json();
    return data.filter(
      (p) => p.categories?.some((cat) => cat.id === id) ?? false
    );
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return [];
  }
}

// Pegar capa da categoria
function getCategoryCover(slug: string): string {
  return (categoryCovers as Record<string, string>)[slug] || "";
}

interface CategoriaTemplateProps {
  params: { slug: string };
}

export default async function CategoriaTemplate({
  params,
}: CategoriaTemplateProps) {
  const { slug } = params;

  const category = await getCategoryBySlug(slug);
  if (!category) return <div className="p-6">Categoria não encontrada</div>;

  const produtos = await getProductsByCategoryId(category.id);
  const coverUrl = getCategoryCover(category.slug);
  const isVideo = coverUrl.endsWith(".mp4");

  return (
    <>
      {coverUrl && (
        <div
          className="mb-15 relative w-full overflow-hidden rounded-lg"
          style={{ aspectRatio: "3/1" }}
        >
          {isVideo ? (
            <video
              src={coverUrl}
              autoPlay
              loop
              muted
              className="absolute top-0 left-0 w-full h-full object-cover object-center"
            />
          ) : (
            <Image
              src={coverUrl}
              alt={`Capa da categoria ${category.name}`}
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          )}
        </div>
      )}

      <Section>
        <FilteredProducts produtos={produtos} />
      </Section>
    </>
  );
}
