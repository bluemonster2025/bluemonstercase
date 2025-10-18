"use client";

import { useState } from "react";
import SearchBar from "@/components/layouts/EcommerceLayout/Search/SearchBar";
import Filters from "@/components/layouts/AdminLayout/Filters";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleApply = () => {
    if (onApplyFilter) {
      onApplyFilter({
        search,
        categoryId: selectedCategory || undefined,
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

      <Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onApply={handleApply}
      />
    </div>
  );
}
