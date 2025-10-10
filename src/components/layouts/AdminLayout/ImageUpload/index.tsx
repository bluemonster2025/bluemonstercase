"use client";

import { useState } from "react";
import { ButtonSecondary } from "@/components/elements/Button";
import MediaModal from "../MediaModal";

interface ImageUploadProps {
  label: string;
  initialImage?: string;
  onChange?: (url: string, id: number) => void;
  containerClass?: string;
  aspectClass?: string;
  rounded?: string;
}

export default function ImageUpload({
  label,
  initialImage,
  onChange,
  containerClass = "",
  aspectClass = "aspect-1",
  rounded = "rounded-lg",
}: ImageUploadProps) {
  const [image, setImage] = useState(initialImage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (url: string, alt: string, id: number) => {
    setImage(url);
    onChange?.(url, id); // ✅ envia o ID corretamente
    setIsModalOpen(false);
  };

  return (
    <div className={`mb-4 ${containerClass}`}>
      <div
        className={`relative w-full bg-no-repeat ${aspectClass} bg-gray-100 ${rounded} overflow-hidden mb-2`}
        style={{ backgroundImage: image ? `url(${image})` : undefined }}
      >
        {!image && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      <ButtonSecondary onClick={() => setIsModalOpen(true)}>
        {label}
      </ButtonSecondary>

      {isModalOpen && (
        <MediaModal
          onSelect={handleSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
