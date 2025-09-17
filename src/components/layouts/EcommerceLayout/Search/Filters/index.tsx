"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Icon from "@/components/elements/Icon";

type FiltersProps = {
  minPrice: number;
  maxPrice: number;
  sort: string;
  setMinPrice: Dispatch<SetStateAction<number>>;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  setSort: Dispatch<SetStateAction<string>>;
  fetchProducts: () => void;
};

export default function Filters({
  minPrice,
  maxPrice,
  sort,
  setMinPrice,
  setMaxPrice,
  setSort,
  fetchProducts,
}: FiltersProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const sortOptions = [
    { value: "", label: "Ordenar por:" },
    { value: "asc", label: "Preço: menor para maior" },
    { value: "desc", label: "Preço: maior para menor" },
  ];

  const selectedLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || "Ordenar por:";

  return (
    <div className="flex items-center gap-4 mb-6 justify-between flex-wrap">
      <div className="flex gap-6 items-center mb-2">
        <input
          type="number"
          value={minPrice || ""}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="de: R$ 00"
          className="border border-grayscale-100 rounded px-4 py-3 w-32 outline-none text-grayscale-450 text-sm"
        />
        <input
          type="number"
          value={maxPrice || ""}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          placeholder="até: R$ 00"
          className="border border-grayscale-100 rounded px-4 py-3 w-32 outline-none text-grayscale-450 text-sm"
        />
      </div>

      <div className="flex gap-4 items-center mb-2">
        <div className="relative border border-grayscale-100 rounded cursor-pointer w-52">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 cursor-pointer text-sm text-grayscale-450"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {selectedLabel}
            <Icon name="IoIosArrowDown" color="#272934" size={16} />
          </button>
          {openDropdown && (
            <div className="absolute z-10 w-full bg-white border border-grayscale-100 rounded mt-1 max-h-60 overflow-auto cursor-pointer">
              {sortOptions
                .filter((opt) => opt.value !== sort)
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

        <button
          onClick={fetchProducts}
          className="bg-black text-white px-6 py-3 text-sm font-semibold rounded"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
