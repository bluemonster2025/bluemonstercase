"use client";

import { useCategories } from "@/hooks/useCategories";
import { ButtonPrimary } from "@/components/elements/Button";
import InputField from "@/components/elements/InputField";
import { Text } from "@/components/elements/Texts";

type FiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  onApply: () => void;
};

export default function Filters({
  selectedCategory,
  setSelectedCategory,
  onApply,
}: FiltersProps) {
  const { categories, loading: loadingCategories } = useCategories();

  return (
    <div className="flex items-center gap-4">
      <Text className="text-grayscale-550">Filtros</Text>
      <div className="flex-1 min-w-[200px]">
        <InputField
          select
          className="p-[0.8rem] text-sm text-grayscale-550"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          disabled={loadingCategories}
          options={[
            { value: "", label: "Todas as categorias" },
            ...(categories?.map((cat) => ({
              value: String(cat.id),
              label: cat.name,
            })) ?? []),
          ]}
        />
      </div>
      <div className="w-fit">
        <ButtonPrimary className="h-12 rounded font-semibold" onClick={onApply}>
          Aplicar filtro
        </ButtonPrimary>
      </div>
    </div>
  );
}
