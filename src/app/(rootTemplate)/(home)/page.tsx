import HomeTemplate from "@/components/templates/Site/Home";
import { getPageHome } from "@/lib/getPageHome";

export default async function HomePage() {
  // 1️⃣ Busca os dados da página e das configurações globais
  const [page] = await Promise.all([getPageHome()]);

  // 3️⃣ Renderiza o template, passando os dois dados
  return <HomeTemplate page={page} />;
}
