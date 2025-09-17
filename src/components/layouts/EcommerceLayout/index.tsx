"use client";

import { ReactNode } from "react";
import { PageACF } from "@/types/home";
import { usePathname } from "next/navigation";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import NewsletterSection from "./ui/NewsletterSection";

interface EcommerceLayoutProps {
  children: ReactNode;
  globalData: PageACF;
  pageData: PageACF;
}

export default function EcommerceLayout({
  children,
  globalData,
}: EcommerceLayoutProps) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/buscar");

  return (
    <div className="relative overflow-x-hidden">
      {!hideHeader && <Header logo={globalData.logo} />}
      {children}
      <NewsletterSection />
      <Footer data={globalData.logo} />
    </div>
  );
}
