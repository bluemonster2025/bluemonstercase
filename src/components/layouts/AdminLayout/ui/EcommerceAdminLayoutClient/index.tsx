"use client";

import { ReactNode, useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { RawImage } from "@/types/siteSettings";
import { useRouter } from "next/navigation";

function isTokenExpired(token: string | undefined) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  } catch {
    return true;
  }
}

interface Props {
  children: ReactNode;
  logo?: RawImage;
}

export default function EcommerceAdminLayoutClient({ children, logo }: Props) {
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (isTokenExpired(token)) {
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";
        router.replace("/admin/login");
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 30 * 1000);
    return () => clearInterval(interval);
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header logo={logo ?? undefined} />

      <main className="bg-grayscale-150">{children}</main>
      <Footer />
    </div>
  );
}
