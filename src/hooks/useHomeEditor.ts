"use client";

import { useState } from "react";
import { PageHome } from "@/types/home";

interface HeroData {
  desktop?: { src: string; alt: string; databaseId?: number };
  mobile?: { src: string; alt: string; databaseId?: number };
}

export function useHomeEditor(initialPage: PageHome) {
  const [pageState, setPageState] = useState<PageHome>({
    ...initialPage,
    hero: {
      desktop: initialPage.hero?.desktop || {
        src: "",
        alt: "",
        databaseId: undefined,
      },
      mobile: initialPage.hero?.mobile || {
        src: "",
        alt: "",
        databaseId: undefined,
      },
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /**
   * Atualiza apenas o Hero quando necessário
   */
  const handleHeroChange = (hero: HeroData) => {
    setPageState((prev) => ({
      ...prev,
      hero: {
        desktop: {
          src: hero.desktop?.src ?? prev.hero?.desktop?.src ?? "",
          alt: hero.desktop?.alt ?? prev.hero?.desktop?.alt ?? "",
          databaseId:
            hero.desktop?.databaseId ?? prev.hero?.desktop?.databaseId,
        },
        mobile: {
          src: hero.mobile?.src ?? prev.hero?.mobile?.src ?? "",
          alt: hero.mobile?.alt ?? prev.hero?.mobile?.alt ?? "",
          databaseId: hero.mobile?.databaseId ?? prev.hero?.mobile?.databaseId,
        },
      },
    }));
  };

  /**
   * Salva alterações parciais da página
   */
  const handleSave = async () => {
    if (!pageState.databaseId) {
      console.error("❌ databaseId não definido", pageState);
      return;
    }

    setIsSaving(true);

    try {
      const bodyData = {
        pageId: pageState.databaseId,
        acfFields: {
          homeHero: {
            // Só envia IDs válidos; undefined mantém o valor atual no WP
            hero_image: Number.isInteger(pageState.hero?.desktop?.databaseId)
              ? pageState.hero?.desktop?.databaseId
              : undefined,
            hero_image_mobile: Number.isInteger(
              pageState.hero?.mobile?.databaseId
            )
              ? pageState.hero?.mobile?.databaseId
              : undefined,
          },
          // Aqui você pode adicionar outros campos da página que queira salvar
        },
      };

      console.log("🟢 Salvando com bodyData:", bodyData);

      const res = await fetch("/api/pageHome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      const data = await res.json();
      console.log("🟣 Resposta do servidor:", data);

      if (!res.ok || data.error) {
        console.error("❌ Erro ao salvar:", data.error || data);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("🔥 Erro ao salvar:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return { pageState, isSaving, saved, handleHeroChange, handleSave };
}
