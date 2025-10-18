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
    <div className="mb-8 flex justify-between">
      <SearchBar
        placeholder="Buscar..."
        search={search}
        setSearch={setSearch}
        inputClassName="p-[0.8rem] text-base pr-8"
        sizeIcon={16}
      />

      <Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onApply={handleApply}
      />
    </div>
  );
}
