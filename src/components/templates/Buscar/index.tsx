"use client";

import { useEffect, useState, useCallback } from "react";
import { useCategories } from "@/context/EcommerceContext/context";
import { Product } from "@/types/product";
import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import SearchBar from "@/components/layouts/EcommerceLayout/Search/SearchBar/indes";
import Filters from "@/components/layouts/EcommerceLayout/Search/Filters";
import CategoriesList from "@/components/layouts/EcommerceLayout/Search/CategoriesList";
import SearchResults from "@/components/layouts/EcommerceLayout/Search/SearchResults";

export default function BuscarTemplate() {
  const { categories, loading } = useCategories();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sort, setSort] = useState<string>("");

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (minPrice > 0) params.set("min_price", minPrice.toString());
      if (maxPrice > 0) params.set("max_price", maxPrice.toString());
      if (sort) {
        params.set("orderby", "price");
        params.set("order", sort);
      }

      const res = await fetch(`/api/wc/products?${params.toString()}`);
      const data = await res.json();

      setProducts(
        (data || []).map((p: Product) => ({ ...p, price: Number(p.price) }))
      );
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, [search, minPrice, maxPrice, sort]);

  useEffect(() => {
    if (search) fetchProducts();
    else setProducts([]);
  }, [search, fetchProducts]);

  return (
    <Section className="py-8">
      {/* Sempre visível */}
      <Title className="uppercase text-2xl font-semibold mb-8">Buscar</Title>
      <SearchBar search={search} setSearch={setSearch} />

      {/* Filtros */}
      {search && (
        <Filters
          minPrice={minPrice}
          maxPrice={maxPrice}
          sort={sort}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setSort={setSort}
          fetchProducts={fetchProducts}
        />
      )}

      {/* Categorias ou skeletons */}
      {!search && <CategoriesList categories={categories} loading={loading} />}

      {/* Resultados da busca */}
      {search && (
        <SearchResults
          products={products}
          loadingProducts={loadingProducts}
          search={search}
        />
      )}
    </Section>
  );
}
