"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/layouts/EcommerceLayout/Categories/ProductCard";
import CategoriaFilters from "@/components/layouts/EcommerceLayout/Categories/ProductFilters";

type FilteredProductsProps = {
  produtos: Product[];
};

export default function FilteredProducts({ produtos }: FilteredProductsProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(produtos);

  return (
    <div>
      {/* Filtro */}
      <CategoriaFilters produtos={produtos} onFilter={setFilteredProducts} />

      {/* Produtos */}
      {filteredProducts.length === 0 ? (
        <p>Nenhum produto encontrado para esta categoria.</p>
      ) : (
        <div className="pb-12 grid gap-y-12 gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-stretch">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
