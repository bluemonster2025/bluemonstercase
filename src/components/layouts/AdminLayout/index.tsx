"use client";

import { ReactNode } from "react";
import Footer from "./ui/Footer";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="relative overflow-x-hidden">
      {/* <Header logo={logo} /> */}
      {children}
      <Footer />
    </div>
  );
}
