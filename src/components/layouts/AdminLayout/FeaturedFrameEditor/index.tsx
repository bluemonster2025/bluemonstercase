"use client";

import { Section } from "@/components/elements/Section";
import { Text, Title } from "@/components/elements/Texts";
import ImageUpload from "../ImageUpload";

interface FeaturedFrameData {
  image?: { src: string; alt?: string; databaseId?: number };
  title?: string;
  text?: string;
  linkButton?: string;
}

interface FeaturedFrameEditorProps extends FeaturedFrameData {
  onChange?: (data: FeaturedFrameData) => void;
}

export default function FeaturedFrameEditor({
  image,
  title,
  text,
  linkButton,
  onChange,
}: FeaturedFrameEditorProps) {
  return (
    <Section>
      <Title as="h3" className="text-2xl font-bold mb-6">
        Sessão 4 - Destaque
      </Title>

      {/* Upload da imagem */}
      <Text className="mb-1 font-medium">Imagem</Text>
      <ImageUpload
        label="Selecionar imagem"
        initialImage={image?.src || ""}
        aspectClass="aspect-[0.78/1]"
        containerClass="max-w-[385px] mb-8"
        rounded="rounded-lg"
        onChange={(url, id) => {
          onChange?.({
            image: { src: url, alt: image?.alt || "", databaseId: id },
            title,
            text,
            linkButton,
          });
        }}
      />

      {/* Título */}
      <Text className="font-medium mb-1">Título</Text>
      <input
        placeholder="Digite o título..."
        value={title || ""}
        onChange={(e) =>
          onChange?.({ image, title: e.target.value, text, linkButton })
        }
        className="mb-6"
      />

      {/* Texto */}
      <Text className="font-medium mb-1">Texto</Text>
      <textarea
        placeholder="Digite o texto (aceita HTML opcional)..."
        value={text || ""}
        onChange={(e) =>
          onChange?.({ image, title, text: e.target.value, linkButton })
        }
        className="mb-6 min-h-[120px]"
      />

      {/* Link do botão */}
      <Text className="font-medium mb-1">Link do botão</Text>
      <input
        placeholder="Digite o link do botão..."
        value={linkButton || ""}
        onChange={(e) =>
          onChange?.({ image, title, text, linkButton: e.target.value })
        }
        className="mb-6"
      />
    </Section>
  );
}
