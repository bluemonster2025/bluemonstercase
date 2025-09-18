"use client";

import Link from "next/link";
import { useCategories } from "@/components/context/EcommerceContext/context";
import { Skeleton } from "@/components/elements/Skeleton";
import { Section } from "@/components/elements/Section";
import BuyButton from "@/components/elements/BuyButton";

export default function HeaderCategories() {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <Section className="bg-grayscale-150 py-4">
        <div className="flex gap-24 items-center justify-center">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded" />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section className="bg-grayscale-150 py-0 lg:py-4">
      <div className="flex flex-col lg:flex-row gap-20 lg:gap-24 items-center justify-center">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categoria/${cat.slug}`}>
            <p className="text-grayscale-350 font-semibold text-lg lg:text-sm">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
      {/* Botão de compra */}
      <div className="block lg:hidden w-[200px] mx-auto pt-16 pb-8">
        <BuyButton variant="secondary" title="Compre agora" icon="BsWhatsapp" />
      </div>
    </Section>
  );
}
