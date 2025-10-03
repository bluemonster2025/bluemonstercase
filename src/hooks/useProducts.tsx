import { useState, useEffect, useRef, useCallback } from "react";
import type { Product } from "@/types/product";

type Filters = {
  search: string;
  minPrice: number;
  maxPrice: number;
  sort: "asc" | "desc" | "";
  per_page: number;
  categoryId?: number;
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
          append ? Math.floor(products.length / filters.per_page) + 1 + "" : "1"
        );

        if (filters.search) params.set("search", filters.search);
        if (filters.minPrice > 0)
          params.set("min_price", filters.minPrice.toString());
        if (filters.maxPrice > 0)
          params.set("max_price", filters.maxPrice.toString());
        if (filters.sort) {
          params.set("orderby", "price");
          params.set("order", filters.sort);
        }
        if (filters.categoryId)
          params.set("category", filters.categoryId.toString());

        const res = await fetch(
          `/api/products?search=${filters.search}&categoryId=${filters.categoryId}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&sort=${filters.sort}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Erro ao buscar produtos");

        const data: Product[] = await res.json();

        const productsWithPrice = (data || []).map((p) => ({
          ...p,
          price: p.price,
        }));

        setProducts((prev) =>
          append ? [...prev, ...productsWithPrice] : productsWithPrice
        );
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") setError(err.message);
        } else {
          setError("Erro desconhecido ao buscar produtos");
        }
      } finally {
        setLoading(false);
      }
    },
    [filters, products.length]
  );

  // efeito para search com debounce
  useEffect(() => {
    if (!filters.search) return;

    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    if (filters.search.length === 1) {
      fetchProducts();
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filters, fetchProducts]);

  // busca inicial
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, filters, setFilters, fetchProducts, error };
};
