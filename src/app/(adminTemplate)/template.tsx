import EcommerceLayoutWrapperAdmin from "@/components/layouts/AdminLayout/EcommerceLayoutWrapperAdmin";
import { ReactNode } from "react";

type AdminTemplateProps = {
  children: ReactNode;
};

export default function AdminTemplate({ children }: AdminTemplateProps) {
  return <EcommerceLayoutWrapperAdmin>{children}</EcommerceLayoutWrapperAdmin>;
}
