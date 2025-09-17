"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Icon } from "@/components/elements/Icon"; // ajuste o caminho se precisar

type CategoriaFiltersProps = {
  produtos: Product[];
  onFilter: (filtered: Product[]) => void;
};

export default function CategoriaFilters({
  produtos,
  onFilter,
}: CategoriaFiltersProps) {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sort, setSort] = useState<string>("");

  const [openDropdown, setOpenDropdown] = useState(false);

  // Mantemos uma versão convertida dos produtos com price como número
  const [numericProducts, setNumericProducts] = useState<Product[]>([]);

  useEffect(() => {
    const converted = produtos.map((p) => ({
      ...p,
      price: Number(p.price), // força price como número
    }));
    setNumericProducts(converted);
  }, [produtos]);

  const handleApply = () => {
    let filtered = [...numericProducts];

    // Filtro por preço
    if (minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // Ordenação
    if (sort === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    }
    if (sort === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    onFilter(filtered);
  };

  const sortOptions = [
    { value: "", label: "Ordenar por:" },
    { value: "asc", label: "Preço: menor para maior" },
    { value: "desc", label: "Preço: maior para menor" },
  ];

  const selectedLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || "Ordenar por:";

  return (
    <div className="flex items-center gap-4 mb-15 justify-between">
      {/* Filtros de preço */}
      <div className="flex gap-6 items-center">
        <input
          type="number"
          value={minPrice || ""}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="de: R$ 00"
          className="border border-grayscale-100 rounded px-4 py-3 w-50 outline-none text-grayscale-450 text-base"
        />

        <input
          type="number"
          value={maxPrice || ""}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          placeholder="até: R$ 00"
          className="border border-grayscale-100 rounded px-4 py-3 w-50 outline-none text-grayscale-450 text-base"
        />
      </div>

      <div className="flex gap-4 items-center">
        {/* Dropdown customizado para ordenação */}
        <div className="relative border border-grayscale-100 rounded cursor-pointer w-[220px]">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 cursor-pointer"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <span className="text-grayscale-450 text-sm">{selectedLabel}</span>
            <Icon name="IoIosArrowDown" color="#272934" size={16} />
          </button>

          {openDropdown && (
            <div className="absolute z-10 w-full bg-white border border-grayscale-100 rounded mt-1 max-h-60 overflow-auto cursor-pointer">
              {sortOptions
                .filter((opt) => opt.value !== sort) // esconde o já selecionado
                .map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setOpenDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-grayscale-450"
                  >
                    {opt.label}
                  </button>
                ))}
            </div>
          )}
        </div>
        {/* Botão aplicar */}
        <div>
          {" "}
          <button
            onClick={handleApply}
            className="bg-black text-white px-6 py-3 text-sm font-semibold cursor-pointer"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
