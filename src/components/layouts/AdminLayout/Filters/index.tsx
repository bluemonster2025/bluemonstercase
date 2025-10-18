"use client";

import { useCategories } from "@/hooks/useCategories";
import { ButtonPrimary } from "@/components/elements/Button";

type FiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  onApply: () => void;
};

export default function Filters({
  selectedCategory,
  setSelectedCategory,
  onApply,
}: FiltersProps) {
  const { categories, loading: loadingCategories } = useCategories();

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border border-grayscale-200 rounded-lg px-4 py-2 text-sm"
        disabled={loadingCategories}
      >
        <option value="">Todas as categorias</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <ButtonPrimary onClick={onApply}>Aplicar filtro</ButtonPrimary>
    </div>
  );
}
