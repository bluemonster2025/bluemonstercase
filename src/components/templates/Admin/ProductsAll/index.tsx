"use client";

import { Section } from "@/components/elements/Section";
import { Title } from "@/components/elements/Texts";
import ProductFilter from "@/components/layouts/AdminLayout/ProductFilter";
import ProductsEditAll from "@/components/layouts/AdminLayout/ProductsEditAll";

export default function ProductsAllEditorTemplate() {
  return (
    <Section className="py-8">
      <Title className="text-grayscale-550 text-2xl font-semibold mb-12">
        Meus produtos
      </Title>

      <ProductFilter />

      <ProductsEditAll />
    </Section>
  );
}
