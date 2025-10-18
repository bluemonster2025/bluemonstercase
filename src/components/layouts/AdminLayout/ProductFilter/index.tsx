"use client";

import { useState } from "react";
import SearchBar from "@/components/layouts/EcommerceLayout/Search/SearchBar";
import { useCategories } from "@/hooks/useCategories";
import { ButtonPrimary } from "@/components/elements/Button";

type ProductFilterProps = {
  search: string;
  setSearch: (value: string) => void;
  onApplyFilter?: (filters: { search: string; categoryId?: string }) => void;
};

export default function ProductFilter({
  search,
  setSearch,
  onApplyFilter,
}: ProductFilterProps) {
  const { categories, loading: loadingCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleApply = () => {
    if (onApplyFilter) {
      onApplyFilter({
        search,
        categoryId: selectedCategory || undefined, // ⚠️ string
      });
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-4">
      <SearchBar
        placeholder="Buscar..."
        search={search}
        setSearch={setSearch}
      />

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap">
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

        <ButtonPrimary onClick={handleApply}>Aplicar filtro</ButtonPrimary>
      </div>
    </div>
  );
}
