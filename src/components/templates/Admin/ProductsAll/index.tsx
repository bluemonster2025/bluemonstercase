"use client";

import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import ProductFilter from "@/components/layouts/AdminLayout/ProductFilter";
import ProductsEditAll from "@/components/layouts/AdminLayout/ProductsEditAll";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsAllEditorTemplate() {
  const { setFilters } = useProducts();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const handleApplyFilter = (filters: {
    search: string;
    categoryId?: string;
  }) => {
    setSearch(filters.search);
    setCategoryId(filters.categoryId);

    setFilters({
      search: filters.search,
      categoryId: filters.categoryId,
    });
  };

  return (
    <Section className="py-8">
      <Title className="text-grayscale-550 text-2xl font-semibold mb-12">
        Meus produtos
      </Title>

      <ProductFilter
        search={search}
        setSearch={setSearch}
        onApplyFilter={handleApplyFilter}
      />

      <ProductsEditAll search={search} categoryId={categoryId} />
    </Section>
  );
}
