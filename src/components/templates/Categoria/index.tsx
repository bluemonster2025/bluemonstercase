import { Product } from "@/types/product";
import { WooCategoryWithCovers } from "@/types/category";
import Image from "next/image";
import { Section } from "@/components/elements/Section";
import FilteredProducts from "@/components/layouts/EcommerceLayout/Categories/FilteredProducts";

interface CategoriaTemplateProps {
  params: { slug: string };
}

// --- Buscar categoria pelo slug usando sua API interna ---
async function getCategoryBySlug(
  slug: string
): Promise<WooCategoryWithCovers | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wc/categories`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return undefined;

    const data = await res.json();
    const categories: WooCategoryWithCovers[] = Array.isArray(data)
      ? data
      : data.categories;
    const category = categories.find((c) => c.slug === slug);
    if (!category) return undefined;

    // --- Resolver cover_desktop e cover_mobile a partir do objeto ACF ---
    const categoryWithCovers: WooCategoryWithCovers = {
      ...category,
      cover_desktop: category.acf?.category_cover_desktop?.url || "",
      cover_mobile: category.acf?.category_cover_mobile?.url || "",
      cover_video: category.acf?.category_cover_video?.url || "",
    };

    console.log("Categoria com covers:", categoryWithCovers);

    return categoryWithCovers;
  } catch (err) {
    console.error("Erro ao buscar categoria:", err);
    return undefined;
  }
}

// --- Buscar produtos pela categoria ---
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

// --- Componente ---
export default async function CategoriaTemplate({
  params,
}: CategoriaTemplateProps) {
  const { slug } = params;

  const category = await getCategoryBySlug(slug);
  if (!category) return <div className="p-6">Categoria não encontrada</div>;

  const produtos = await getProductsByCategoryId(category.id);

  return (
    <>
      {(category.cover_video ||
        category.cover_desktop ||
        category.cover_mobile) && (
        <div className="mb-15 relative w-full overflow-hidden aspect-[0.83/1] md:aspect-[3/1]">
          {/* --- Se houver vídeo no ACF, prioriza ele --- */}
          {category.cover_video ? (
            <video
              src={category.cover_video}
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover object-center"
            />
          ) : (
            <>
              {/* Mobile */}
              {category.cover_mobile && (
                <div className="block md:hidden w-full h-full">
                  <Image
                    src={category.cover_mobile}
                    alt={`Capa da categoria ${category.name}`}
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>
              )}
              {/* Desktop */}
              {category.cover_desktop && (
                <div className="hidden md:block w-full h-full">
                  <Image
                    src={category.cover_desktop}
                    alt={`Capa da categoria ${category.name}`}
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Section>
        <FilteredProducts produtos={produtos} />
      </Section>
    </>
  );
}
