"use client";

import { useEffect, useState } from "react";
import { AdminProduct } from "@/types/product";
import { Title } from "@/components/elements/Texts";

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/wc/products");
      const data: AdminProduct[] = await res.json();
      setProdutos(data || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProdutos([]);
    }
  }

  async function updateProduct(p: AdminProduct) {
    const name = prompt("Nome", p.name) || p.name;

    // transforma o price em string no prompt
    const priceInput = prompt("Preço", String(p.price));

    // se o usuário não digitar nada, usa o valor atual
    const price = priceInput !== null ? priceInput : String(p.price);

    const body = { id: p.id, name, regular_price: price };
    setLoading(true);

    try {
      const res = await fetch("/api/wc/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Produto atualizado com sucesso!");
        fetchProducts();
      } else {
        alert("Erro ao atualizar produto.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Title as="h3" className="text-2xl font-bold mb-4">
        Todos os Produtos
      </Title>
      <div className="grid grid-cols-1 gap-3">
        {produtos.map((p) => (
          <div
            key={p.id}
            className="border p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm">R$ {p.price}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-400 px-3 py-1 rounded"
                onClick={() => updateProduct(p)}
                disabled={loading}
              >
                {loading ? "Atualizando..." : "Editar Rápido"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
