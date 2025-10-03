import EcommerceLayout from "@/components/layouts/EcommerceLayout";
import { ReactNode } from "react";

type AdminTemplateProps = {
  children: ReactNode;
};

export default function AdminTemplate({ children }: AdminTemplateProps) {
  return <EcommerceLayout>{children}</EcommerceLayout>;
}
