"use client";
import { useEffect } from "react";

export default function RefreshTokenKeeper() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetch("/api/refresh", { method: "POST" });
    }, 25 * 60 * 1000); // a cada 25 minutos

    return () => clearInterval(interval);
  }, []);

  return null;
}
