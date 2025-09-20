import { ReactNode } from "react";
import { fetchPageData, fetchGlobalData } from "@/app/utils/fetchPageData";
import { PageACF } from "@/types/home";
import AdminLayout from "..";

interface WrapperProps {
  children: ReactNode;
  pageSlug?: string;
}

export default async function EcommerceLayoutWrapper({
  children,
  pageSlug = "home",
}: WrapperProps) {
  const [globalData, pageData]: [PageACF, PageACF] = await Promise.all([
    fetchGlobalData(),
    fetchPageData(pageSlug),
  ]);

  return (
    <AdminLayout globalData={globalData} pageData={pageData}>
      {children}
    </AdminLayout>
  );
}
