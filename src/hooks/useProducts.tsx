import { useState, useEffect, useRef, useCallback } from "react";
import type { Product } from "@/types/product";

type Filters = {
  search: string;
  minPrice: number;
  maxPrice: number;
  sort: "asc" | "desc" | "";
  per_page: number;
  categoryId?: string; // ⚠️ string para base64
};

const defaultFilters: Filters = {
  search: "",
  minPrice: 0,
  maxPrice: 0,
  sort: "",
  per_page: 20,
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [error, setError] = useState<string | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const setFilters = (newFilters: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const fetchProducts = useCallback(
    async (append = false) => {
      if (abortController.current) abortController.current.abort();
      abortController.current = new AbortController();

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("per_page", filters.per_page.toString());
        params.set(
          "page",
          append
            ? Math.floor(products.length / filters.per_page + 1).toString()
            : "1"
        );

        if (filters.search) params.set("search", filters.search);
        if (filters.minPrice > 0)
          params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice > 0)
          params.set("maxPrice", filters.maxPrice.toString());
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.categoryId) params.set("categoryId", filters.categoryId);

        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
          signal: abortController.current.signal,
        });

        if (!res.ok) throw new Error("Erro ao buscar produtos");

        const data: Product[] = await res.json();
        setProducts((prev) => (append ? [...prev, ...data] : data));
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [filters, products.length]
  );

  // 🔹 Debounce apenas para search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filters.search, fetchProducts]);

  // 🔹 Fetch sempre que outros filtros mudarem (categoria, preço, sort)
  useEffect(() => {
    fetchProducts();
  }, [
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    fetchProducts,
  ]);

  return { products, loading, filters, setFilters, fetchProducts, error };
};
