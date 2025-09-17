import CategoriaTemplate from "@/components/templates/Categoria";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params; // 👈 aguarda o Promise
  return <CategoriaTemplate params={resolvedParams} />;
}
