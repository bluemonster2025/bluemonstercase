import { ReactNode } from "react";
import EcommerceLayoutWrapper from "@/components/layouts/EcommerceLayout/EcommerceLayoutWrapper";

type RootTemplateProps = {
  children: ReactNode;
};

export default function RootTemplate({ children }: RootTemplateProps) {
  return <EcommerceLayoutWrapper>{children}</EcommerceLayoutWrapper>;
}
