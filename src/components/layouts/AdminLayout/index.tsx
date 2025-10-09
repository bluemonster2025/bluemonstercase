import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";
import { SiteSettings } from "@/types/siteSettings";
import { getSiteSettings } from "@/lib/siteSettings";
import EcommerceAdminLayoutClient from "./ui/EcommerceAdminLayoutClient";

interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const settings: SiteSettings | null = await getSiteSettings();

  return (
    <AuthProvider>
      <EcommerceAdminLayoutClient logo={settings?.logo}>
        {children}
      </EcommerceAdminLayoutClient>
    </AuthProvider>
  );
}
