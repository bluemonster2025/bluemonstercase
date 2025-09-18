"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Category } from "@/types/category";

type EcommerceContextProps = {
  categories: Category[];
  loading: boolean;
};

const EcommerceContext = createContext<EcommerceContextProps>({
  categories: [],
  loading: true,
});

export function EcommerceProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Define baseUrl com fallback
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        // Remove possível barra no final e monta a URL corretamente
        const url = baseUrl
          ? `${baseUrl.replace(/\/$/, "")}/api/wc/categories`
          : "/api/wc/categories";

        console.log("URL que será usada para fetch:", url);

        const res = await fetch(url);

        if (!res.ok) throw new Error("Erro ao carregar categorias");

        const data = await res.json();

        const filtered = (data.categories || [])
          .filter(
            (cat: Category) =>
              cat.name.toLowerCase() !== "sem categoria" &&
              cat.display === "default"
          )
          .slice(0, 5);

        setCategories(filtered);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <EcommerceContext.Provider value={{ categories, loading }}>
      {children}
    </EcommerceContext.Provider>
  );
}

export function useCategories() {
  return useContext(EcommerceContext);
}
