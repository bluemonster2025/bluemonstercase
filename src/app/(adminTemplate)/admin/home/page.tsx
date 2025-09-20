"use client";

import AdminHomeEditor from "@/components/layouts/AdminLayout/AdminHomeEditor";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  // Você pode buscar dados dentro do AdminHomeEditor via useEffect ou API route
  return <AdminHomeEditor />;
}
