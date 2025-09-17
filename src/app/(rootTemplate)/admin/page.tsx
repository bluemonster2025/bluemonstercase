import Link from "next/link";

export default async function AdminDashboard() {
  // nota: página pública; em produção valide cookie server-side e redirecione
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Dashboard</h1>
      <nav className="flex gap-4 mb-6">
        <Link href="/admin/home" className="text-blue-600">
          Editar Home
        </Link>
        <Link href="/admin/produtos" className="text-blue-600">
          Todos os Produtos
        </Link>
        <Link href="/admin/categorias" className="text-blue-600">
          Categorias
        </Link>
      </nav>
      <p>Escolha um item para editar conteúdo.</p>
    </div>
  );
}
