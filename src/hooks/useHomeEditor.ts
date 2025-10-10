"use client";

import { useState } from "react";
import { PageHome } from "@/types/home";

interface MediaData {
  src: string;
  alt?: string;
  databaseId?: number;
}

interface HeroData {
  desktop?: MediaData;
  mobile?: MediaData;
}

// 🔹 Tipo compatível com HomeBannerEditor
interface EditorBannerData {
  desktop?: MediaData;
  mobile?: MediaData;
}

// 🔹 Tipo para Sessão 4
interface Sessao4Data {
  image?: MediaData;
  title?: string;
  text?: string;
  linkButton?: string;
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
    banner: {
      desktop: initialPage.banner?.desktop || {
        src: "",
        alt: "",
        databaseId: undefined,
      },
      mobile: initialPage.banner?.mobile || {
        src: "",
        alt: "",
        databaseId: undefined,
      },
    },
    sessao4: {
      image: initialPage.sessao4?.image || { src: "", alt: "" },
      title: initialPage.sessao4?.title || "",
      text: initialPage.sessao4?.text || "",
      linkButton: initialPage.sessao4?.linkButton || "",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🖼️ Atualiza o grupo Hero
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

  // 🖼️ Atualiza o grupo homeBanner
  const handleBannerChange = (banner: EditorBannerData) => {
    setPageState((prev) => ({
      ...prev,
      banner: {
        desktop: {
          src: banner.desktop?.src ?? prev.banner?.desktop?.src ?? "",
          alt: banner.desktop?.alt ?? prev.banner?.desktop?.alt ?? "",
          databaseId:
            banner.desktop?.databaseId ?? prev.banner?.desktop?.databaseId,
        },
        mobile: {
          src: banner.mobile?.src ?? prev.banner?.mobile?.src ?? "",
          alt: banner.mobile?.alt ?? prev.banner?.mobile?.alt ?? "",
          databaseId:
            banner.mobile?.databaseId ?? prev.banner?.mobile?.databaseId,
        },
      },
    }));
  };

  // 🧩 Atualiza o grupo homeSessao4
  const handleSessao4Change = (sessao4: Sessao4Data) => {
    setPageState((prev) => ({
      ...prev,
      sessao4: {
        image: {
          src: sessao4.image?.src ?? prev.sessao4?.image?.src ?? "",
          alt: sessao4.image?.alt ?? prev.sessao4?.image?.alt ?? "",
          databaseId:
            sessao4.image?.databaseId ?? prev.sessao4?.image?.databaseId,
        },
        title: sessao4.title ?? prev.sessao4?.title ?? "",
        text: sessao4.text ?? prev.sessao4?.text ?? "",
        linkButton: sessao4.linkButton ?? prev.sessao4?.linkButton ?? "",
      },
    }));
  };

  // 💾 Salvar alterações (homeHero, homeBanner e homeSessao4)
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
          // homeHero
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

          // homeBanner (ACF: image_sessao6 / image_sessao6_mobile)
          homeBanner: {
            image_sessao6: Number.isInteger(
              pageState.banner?.desktop?.databaseId
            )
              ? pageState.banner?.desktop?.databaseId
              : undefined,
            image_sessao6_mobile: Number.isInteger(
              pageState.banner?.mobile?.databaseId
            )
              ? pageState.banner?.mobile?.databaseId
              : undefined,
          },

          // homeSessao4
          homeSessao4: {
            image_sessao4: Number.isInteger(
              pageState.sessao4?.image?.databaseId
            )
              ? pageState.sessao4?.image?.databaseId
              : undefined,
            title_sessao4: pageState.sessao4?.title || "",
            text_sessao4: pageState.sessao4?.text || "",
            link_button_sessao4: pageState.sessao4?.linkButton || "",
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

  return {
    pageState,
    isSaving,
    saved,
    error,
    handleHeroChange,
    handleBannerChange,
    handleSessao4Change,
    handleSave,
  };
}
