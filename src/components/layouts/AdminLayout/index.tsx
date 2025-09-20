"use client";

import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { PageACF } from "@/types/home";

interface AdminLayoutProps {
  children: ReactNode;
  globalData: PageACF;
  pageData: PageACF;
}

export default function AdminLayout({
  children,
  globalData,
}: AdminLayoutProps) {
  return (
    <div className="relative overflow-x-hidden">
      <Header data={globalData.logo} />
      {children}
      <Footer />
    </div>
  );
}
