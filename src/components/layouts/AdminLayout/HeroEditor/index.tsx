"use client";

import { Section } from "@/components/elements/Section";
import { Text } from "@/components/elements/Texts";
import ImageUpload from "../ImageUpload";

interface HeroProps {
  desktop?: { src: string; alt: string; databaseId?: number };
  mobile?: { src: string; alt: string; databaseId?: number };
  onChange?: (images: {
    desktop?: { src: string; alt: string; databaseId?: number };
    mobile?: { src: string; alt: string; databaseId?: number };
  }) => void;
}

export default function HeroEditor({ desktop, mobile, onChange }: HeroProps) {
  return (
    <Section>
      {/* Hero Desktop */}
      <Text className="mb-1 font-medium">Hero Banner Desktop</Text>
      <ImageUpload
        label="Selecionar banner desktop"
        initialImage={desktop?.src || ""}
        aspectClass="aspect-[3.51/1]"
        rounded="md:rounded-3xl"
        onChange={(url, id) => {
          onChange?.({
            desktop: { src: url, alt: desktop?.alt || "", databaseId: id },
            mobile,
          });
        }}
      />

      {/* Hero Mobile */}
      <Text className="font-semibold mb-2">Hero Banner Mobile</Text>
      <ImageUpload
        label="Selecionar banner mobile"
        initialImage={mobile?.src || ""}
        aspectClass="aspect-square"
        containerClass="mb-12 max-w-[342px]"
        rounded="rounded-0"
        onChange={(url, id) => {
          onChange?.({
            desktop,
            mobile: { src: url, alt: mobile?.alt || "", databaseId: id },
          });
        }}
      />
    </Section>
  );
}
