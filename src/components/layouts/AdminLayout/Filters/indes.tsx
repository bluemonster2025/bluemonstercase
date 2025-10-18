"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
};

interface CategoryFilterProps {
  categories: Category[];
  currentSlug?: string;
}

export default function Filters({
  categories,
  currentSlug,
}: CategoryFilterProps) {
  const [selected, setSelected] = useState(currentSlug || "");
  const router = useRouter();

  const handleApply = () => {
    if (selected) router.push(`/categoria/${selected}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-auto"
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleApply}
        disabled={!selected}
        className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition disabled:bg-gray-300"
      >
        Aplicar filtro
      </button>
    </div>
  );
}
