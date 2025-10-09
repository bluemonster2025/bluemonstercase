"use client";

import { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { RawImage } from "@/types/siteSettings";

interface Props {
  children: ReactNode;
  logo?: RawImage;
}

export default function EcommerceAdminLayoutClient({ children, logo }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header logo={logo ?? undefined} />

      <main>{children}</main>
      <Footer />
    </div>
  );
}
