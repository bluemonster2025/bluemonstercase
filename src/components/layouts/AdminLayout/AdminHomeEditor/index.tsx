"use client";

import { useEffect, useState } from "react";
import { PageACF } from "@/types/home";
import Image from "next/image";
import { Section } from "@/components/elements/Section";
import { Text, Title } from "@/components/elements/Texts";

interface AdminHomeEditorProps {
  initialPage?: PageACF;
}

export default function AdminHomeEditor({ initialPage }: AdminHomeEditorProps) {
  const [page, setPage] = useState<PageACF | null>(initialPage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [acfState, setAcfState] = useState({
    hero: {
      hero_image: { id: 0, url: "" },
      hero_image_mobile: { id: 0, url: "" },
    },
    sessao6: {
      image_sessao6: { id: 0, url: "" },
      image_sessao6_mobile: { id: 0, url: "" },
    },
    logo: { id: 0, url: "" },
    productBanner: {
      product_banner_image: { id: 0, url: "" },
      product_banner_image_mobile: { id: 0, url: "" },
    },
    acf: {
      title: "",
      text: "",
      link_button: "",
      image: { id: 0, url: "" },
    },
  });

  useEffect(() => {
    if (!initialPage) {
      (async () => {
        try {
          const res = await fetch("/api/wp/home");
          if (!res.ok) throw new Error(`Erro API: ${res.status}`);
          const data: PageACF = await res.json();

          setPage(data || null);
          setAcfState({
            hero: data.hero,
            sessao6: data.sessao6,
            logo: data.logo,
            productBanner: data.productBanner,
            acf: {
              title: data.acf?.title || "",
              text: data.acf?.text || "",
              link_button: data.acf?.link_button || "",
              image: {
                id: data.acf?.image?.id || 0,
                url: data.acf?.image?.url || "",
              },
            },
          });
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : "Erro desconhecido");
        }
      })();
    } else {
      setPage(initialPage);
      setAcfState({
        hero: initialPage.hero,
        sessao6: initialPage.sessao6,
        logo: initialPage.logo,
        productBanner: initialPage.productBanner,
        acf: {
          title: initialPage.acf?.title || "",
          text: initialPage.acf?.text || "",
          link_button: initialPage.acf?.link_button || "",
          image: {
            id: initialPage.acf?.image?.id || 0,
            url: initialPage.acf?.image?.url || "",
          },
        },
      });
    }
  }, [initialPage]);

  async function save() {
    if (!page) return;
    setLoading(true);
    try {
      const payload = {
        id: page.id,
        fields: {
          hero_image: acfState.hero.hero_image.id,
          hero_image_mobile: acfState.hero.hero_image_mobile.id,
          image_sessao6: acfState.sessao6.image_sessao6.id,
          image_sessao6_mobile: acfState.sessao6.image_sessao6_mobile.id,
          image_logo: acfState.logo.id,
          product_banner_image: acfState.productBanner.product_banner_image.id,
          product_banner_image_mobile:
            acfState.productBanner.product_banner_image_mobile.id,
          title_sessao4: acfState.acf.title,
          text_sessao4: acfState.acf.text,
          link_button_sessao4: acfState.acf.link_button,
          image_sessao4: acfState.acf.image.id,
        },
      };

      const res = await fetch("/api/wp/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao salvar Home");
      }

      alert("Home atualizada com sucesso!");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  if (error) return <div className="p-6 text-red-600">Erro: {error}</div>;
  if (!page) return <div className="p-6">Carregando...</div>;

  return (
    <Section className="py-6">
      <Title className="text-2xl font-bold mb-4">Home</Title>

      {/* Hero Banner Desktop */}
      <div className="mb-8">
        <Text className="mb-1 font-medium">Hero Banner Desktop</Text>
        <div className="relative w-full aspect-[3.51/1] bg-gray-100 rounded-3xl overflow-hidden border mb-2">
          {acfState.hero.hero_image.url ? (
            <Image
              src={acfState.hero.hero_image.url}
              alt="Hero Desktop"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sem imagem
            </div>
          )}
        </div>

        {/* Custom File Upload */}
        <div className="flex gap-8">
          <label className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = URL.createObjectURL(file);
                setAcfState((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    hero_image: { ...prev.hero.hero_image, url },
                  },
                }));
              }}
            />
          </label>
          {acfState.hero.hero_image.url && (
            <p className="mt-2 text-sm text-gray-500 truncate">
              {acfState.hero.hero_image.url.split("/").pop()}
            </p>
          )}
        </div>
      </div>

      {/* Hero Banner Mobile */}
      <div className="mb-12">
        <Text className="font-semibold mb-2">Hero Banner Mobile</Text>

        <div className="relative w-full max-w-[342px] aspect-square bg-cover bg-no-repeat bg-center">
          <Image
            src={acfState.hero.hero_image_mobile.url}
            alt="Hero Mobile"
            className="w-full h-64 object-cover border mb-2"
            fill
          />
        </div>

        {/* Custom File Upload */}
        <div className="flex gap-8">
          {" "}
          <label className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = URL.createObjectURL(file);
                setAcfState((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    hero_image: { ...prev.hero.hero_image_mobile, url },
                  },
                }));
              }}
            />
          </label>
          {acfState.hero.hero_image_mobile.url && (
            <p className="mt-2 text-sm text-gray-500 truncate">
              {acfState.hero.hero_image_mobile.url.split("/").pop()}
            </p>
          )}
        </div>
      </div>

      {/* --------------------- SESSÃO 4 --------------------- */}
      {/* Sessão 4 - Imagem */}
      <Title as="h2" className="font-semibold mb-2 mt-4">
        Imagem Sessão 4
      </Title>
      <div className="mb-8">
        <div className="flex-1 relative w-full max-w-[385px] aspect-[0.88/1] mb-2">
          {acfState.acf.image.url ? (
            <Image
              src={acfState.acf.image.url}
              alt="Sessão 4"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sem imagem
            </div>
          )}
        </div>

        {/* Custom File Upload */}
        <div className="flex gap-8">
          <label className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                setAcfState((prev) => ({
                  ...prev,
                  acf: { ...prev.acf, image: { ...prev.acf.image, url } },
                }));
              }}
            />
          </label>
          {acfState.acf.image.url && (
            <p className="mt-2 text-sm text-gray-500 truncate">
              {acfState.acf.image.url.split("/").pop()}
            </p>
          )}
        </div>
      </div>

      <Title as="h2" className="font-semibold mb-2 mt-4">
        Sessão 4 Texto
      </Title>
      <div
        className="border p-4 rounded mb-4"
        dangerouslySetInnerHTML={{ __html: acfState.acf.text || "" }}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Link botão"
        value={acfState.acf.link_button || ""}
        onChange={(e) =>
          setAcfState((prev) => ({
            ...prev,
            acf: { ...prev.acf, link_button: e.target.value },
          }))
        }
      />

      {/* --------------------- SESSÃO 6 --------------------- */}
      <Title as="h2" className="font-semibold mb-2">
        Sessão 6
      </Title>

      {/* Sessao6 Banner Desktop */}
      <div className="mb-8">
        <Text className="mb-1 font-medium">Sessao6 Banner Desktop</Text>
        <div className="relative w-full aspect-[3.51/1] bg-gray-100 rounded-3xl overflow-hidden border mb-2">
          {acfState.sessao6.image_sessao6.url ? (
            <Image
              src={acfState.sessao6.image_sessao6.url}
              alt="Banner"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sem imagem
            </div>
          )}
        </div>

        {/* Custom File Upload */}
        <div className="flex gap-8">
          <label className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = URL.createObjectURL(file);
                setAcfState((prev) => ({
                  ...prev,
                  sessao6: {
                    ...prev.sessao6,
                    image_sessao6: { ...prev.sessao6.image_sessao6, url },
                  },
                }));
              }}
            />
          </label>
          {acfState.sessao6.image_sessao6.url && (
            <p className="mt-2 text-sm text-gray-500 truncate">
              {acfState.sessao6.image_sessao6.url.split("/").pop()}
            </p>
          )}
        </div>
      </div>

      {/* Sessao6 Banner Mobile */}

      <div className="mb-12">
        <Text className="font-semibold mb-2">Hero Banner Mobile</Text>

        <div className="relative w-full max-w-[390px] aspect-[1.44/1] bg-cover bg-no-repeat bg-center">
          <Image
            src={acfState.sessao6.image_sessao6_mobile.url}
            alt="Hero Mobile"
            className="w-full h-64 object-cover border mb-2"
            fill
          />
        </div>

        {/* Custom File Upload */}
        <div className="flex gap-8">
          {" "}
          <label className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = URL.createObjectURL(file);
                setAcfState((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    hero_image: { ...prev.sessao6.image_sessao6_mobile, url },
                  },
                }));
              }}
            />
          </label>
          {acfState.sessao6.image_sessao6_mobile.url && (
            <p className="mt-2 text-sm text-gray-500 truncate">
              {acfState.sessao6.image_sessao6_mobile.url.split("/").pop()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={save}
        >
          {loading ? "Salvando..." : "Salvar Home"}
        </button>
      </div>
    </Section>
  );
}
