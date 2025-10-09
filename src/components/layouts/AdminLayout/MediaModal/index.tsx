"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface MediaItem {
  databaseId: number;
  sourceUrl: string;
  altText: string | null;
  title: { rendered: string } | string;
}

interface MediaModalProps {
  onSelect: (url: string, alt: string, id: number) => void;
  onClose: () => void;
}

export default function MediaModal({ onSelect, onClose }: MediaModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/wpMedia", { credentials: "include" });
        const data = await res.json();

        if (res.status !== 200) {
          setError(data.error || "Erro desconhecido");
          setMedia([]);
          return;
        }

        setMedia(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar mídia:", err);
        setError("Erro ao buscar mídia");
        setMedia([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-4xl w-full h-[80vh] overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Selecionar Imagem</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : media.length === 0 ? (
          <p>Nenhuma imagem encontrada.</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.databaseId}
                className="cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500"
                onClick={() =>
                  onSelect(
                    item.sourceUrl,
                    item.altText ||
                      (typeof item.title === "string"
                        ? item.title
                        : item.title.rendered),
                    item.databaseId // use databaseId diretamente
                  )
                }
              >
                <Image
                  src={item.sourceUrl}
                  alt={
                    item.altText ||
                    (typeof item.title === "string"
                      ? item.title
                      : item.title.rendered) ||
                    ""
                  }
                  width={150}
                  height={150}
                  className="object-cover w-full h-24"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
