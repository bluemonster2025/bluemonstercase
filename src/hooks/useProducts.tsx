import { Product } from "@/types/product";
import { useState, useEffect, useRef, useCallback } from "react";

type Filters = {
  search: string;
  minPrice: number;
  maxPrice: number;
  sort: "asc" | "desc" | "";
  per_page: number;
  categoryId?: string;
  status?: string;
};

const defaultFilters: Filters = {
  search: "",
  minPrice: 0,
  maxPrice: 0,
  sort: "",
  per_page: 20,
  status: "publish",
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [error, setError] = useState<string | null>(null);

  const abortController = useRef<AbortController | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const firstRender = useRef(true);

  /** Atualiza filtros parcialmente */
  const setFilters = (newFilters: Partial<Filters>) => {
    console.log("🧭 Atualizando filtros:", newFilters);
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  /** Busca principal */
  const fetchProducts = useCallback(async () => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("per_page", filters.per_page.toString());
      params.set("page", "1");

      if (filters.search) params.set("search", filters.search);
      if (filters.minPrice > 0)
        params.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice > 0)
        params.set("maxPrice", filters.maxPrice.toString());
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.categoryId) params.set("categoryId", filters.categoryId);
      if (filters.status) params.set("status", filters.status);

      const finalUrl = `/api/products?${params.toString()}`;
      console.log("🌐 Fetch:", finalUrl);

      const res = await fetch(finalUrl, {
        cache: "no-store",
        signal: abortController.current.signal,
      });

      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      const data: Product[] = await res.json();

      console.log(`✅ ${data.length} produtos recebidos`, {
        sample: data.slice(0, 2).map((p) => ({
          id: p.id,
          status: p.status,
        })),
      });

      setProducts(data);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("💥 Erro ao buscar produtos:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /** 🕐 Debounce apenas para `search` */
  useEffect(() => {
    if (!filters.search.trim()) return; // ignora vazio
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      console.log("⌛ Debounce concluído:", filters.search);
      fetchProducts();
    }, 400);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filters.search, fetchProducts]);

  /** ⚙️ Refetch controlado — ignora primeira renderização */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // só dispara se não for busca digitada
    if (!filters.search.trim()) {
      console.log("🧩 Filtros alterados → fetchProducts:", filters);
      fetchProducts();
    }
  }, [filters, fetchProducts]);

  return { products, loading, filters, setFilters, fetchProducts, error };
};
