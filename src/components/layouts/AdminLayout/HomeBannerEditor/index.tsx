"use client";

import { Section } from "@/components/elements/Section";
import { Text } from "@/components/elements/Texts";
import ImageUpload from "../ImageUpload";

interface HomeBannerProps {
  desktop?: { src: string; alt: string; databaseId?: number };
  mobile?: { src: string; alt: string; databaseId?: number };
  onChange?: (images: {
    desktop?: { src: string; alt: string; databaseId?: number };
    mobile?: { src: string; alt: string; databaseId?: number };
  }) => void;
}

export default function HomeBannerEditor({
  desktop,
  mobile,
  onChange,
}: HomeBannerProps) {
  return (
    <Section>
      {/* Home Banner Desktop */}
      <Text className="mb-1 font-medium">Home Banner Desktop</Text>
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

      {/* Home Banner Mobile */}
      <Text className="font-semibold mb-2">Home Banner Mobile</Text>
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
