"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshTokenKeeper() {
  const router = useRouter();

  useEffect(() => {
    // 🔁 Atualiza token a cada 25 minutos (antes do expirar de 30min)
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/refresh", { method: "POST" });

        if (res.status === 401) {
          console.warn("🔒 Refresh token expirou — deslogando...");
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          router.push("/admin/login");
        } else if (res.ok) {
          console.log("🔄 Token atualizado com sucesso");
        }
      } catch (err) {
        console.error("Erro ao tentar atualizar token:", err);
      }
    }, 25 * 60 * 1000); // 25 minutos

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
