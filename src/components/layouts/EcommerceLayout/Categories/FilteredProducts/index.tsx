"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/layouts/EcommerceLayout/Categories/ProductCard";
import CategoriaFilters from "@/components/layouts/EcommerceLayout/Categories/ProductFilters";
import { ButtonSecondary } from "@/components/elements/Button";

type FilteredProductsProps = {
  produtos: Product[];
};

export default function FilteredProducts({ produtos }: FilteredProductsProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(produtos);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isMobile, setIsMobile] = useState(true);

  // Detecta se é mobile ou desktop
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // breakpoint md
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  // No desktop, mostra todos os produtos; no mobile, mostra apenas os visíveis
  const visibleProducts = isMobile
    ? filteredProducts.slice(0, visibleCount)
    : filteredProducts;

  const allLoaded = visibleCount >= filteredProducts.length;

  return (
    <div>
      {/* Filtro */}
      <CategoriaFilters produtos={produtos} onFilter={setFilteredProducts} />

      {/* Produtos */}
      {filteredProducts.length === 0 ? (
        <p>Nenhum produto encontrado para esta categoria.</p>
      ) : (
        <>
          <div className="pb-12 grid gap-y-12 gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-stretch">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>

          {/* Botão "Carregar mais" apenas no mobile */}
          {isMobile && (
            <div className="w-[146px] mx-auto mb-12 text-sm font-semibold">
              <ButtonSecondary onClick={handleLoadMore} disabled={allLoaded}>
                {allLoaded ? "Todos carregados" : "Carregar mais"}
              </ButtonSecondary>
            </div>
          )}
        </>
      )}
    </div>
  );
}
