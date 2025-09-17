import { ReactNode } from "react";
import { fetchPageData, fetchGlobalData } from "@/app/utils/fetchPageData";
import { PageACF } from "@/types/home";
import EcommerceLayout from "..";

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
    <EcommerceLayout globalData={globalData} pageData={pageData}>
      {children}
    </EcommerceLayout>
  );
}
