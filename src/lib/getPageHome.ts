import { PageHome } from "@/types/home";

export async function getPageHome(): Promise<PageHome> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHome`, {
    cache: "no-store", // força sempre pegar o dado atualizado
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar dados da Home");
  }

  return res.json();
}
