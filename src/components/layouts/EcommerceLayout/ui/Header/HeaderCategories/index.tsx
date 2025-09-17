"use client";

import Link from "next/link";
import { useCategories } from "@/components/context/EcommerceContext/context";
import { Skeleton } from "@/components/elements/Skeleton";
import { Section } from "@/components/elements/Section";
import { Text } from "@/components/elements/Texts";

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
    <Section className="bg-grayscale-150 py-4">
      <div className="flex gap-24 items-center justify-center">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="hover:text-sky-600 transition"
          >
            <Text className="text-grayscale-350 font-semibold">{cat.name}</Text>
          </Link>
        ))}
      </div>
    </Section>
  );
}
