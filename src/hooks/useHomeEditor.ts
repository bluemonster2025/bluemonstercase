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
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!pageState.databaseId) {
      console.error("❌ databaseId não definido", pageState);
      setError("Database ID não definido!");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const bodyData = {
        pageId: pageState.databaseId,
        acfFields: {
          homeHero: {
            hero_image: Number.isInteger(pageState.hero?.desktop?.databaseId)
              ? pageState.hero?.desktop?.databaseId
              : undefined,
            hero_image_mobile: Number.isInteger(
              pageState.hero?.mobile?.databaseId
            )
              ? pageState.hero?.mobile?.databaseId
              : undefined,
          },
        },
      };

      const res = await fetch("/api/pageHome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error("❌ Erro ao salvar:", data.error || data);
        setError(data.error || "Erro desconhecido ao salvar.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("🔥 Erro ao salvar:", err);
      setError("Erro ao salvar. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  return { pageState, isSaving, saved, error, handleHeroChange, handleSave };
}
