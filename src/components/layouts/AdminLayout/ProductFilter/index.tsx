"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export default function ProductFilter() {
  const {
    filters,
    setFilters,
    fetchProducts,
    loading: loadingProducts,
  } = useProducts();
  const { categories, loading: loadingCategories } = useCategories();

  const [search, setSearch] = useState(filters.search);
  const [categoryId, setCategoryId] = useState<number | undefined>(
    filters.categoryId
  );

  const handleApplyFilters = () => {
    setFilters({
      search: search.trim(),
      categoryId,
    });
    fetchProducts(); // recarrega os produtos com os filtros aplicados
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
      {/* Input de busca */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar produto
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Digite o nome do produto..."
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Select de categoria */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        {loadingCategories ? (
          <p>Carregando categorias...</p>
        ) : (
          <select
            value={categoryId || ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Botão aplicar filtro */}
      <div>
        <button
          onClick={handleApplyFilters}
          disabled={loadingProducts || loadingCategories}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loadingProducts ? "Carregando..." : "Aplicar filtro"}
        </button>
      </div>
    </div>
  );
}
