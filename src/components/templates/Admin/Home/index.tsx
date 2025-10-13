"use client";

import HeroEditor from "@/components/layouts/AdminLayout/HeroEditor";
import { ButtonPrimary } from "@/components/elements/Button";
import { Section } from "@/components/elements/Section";
import { PageHome } from "@/types/home";
import { useHomeEditor } from "@/hooks/useHomeEditor";
import { SaveModal } from "@/components/layouts/AdminLayout/ui/SaveModal";
import HomeBannerEditor from "@/components/layouts/AdminLayout/HomeBannerEditor";
import FeaturedFrameEditor from "@/components/layouts/AdminLayout/FeaturedFrameEditor";
import { Title } from "@/components/elements/Texts";

import { RelatedProductNode } from "@/types/product";
import SectionProductsEdit from "@/components/layouts/AdminLayout/SectionProductsEdit";

interface Props {
  page: PageHome;
}

// 🔹 HomeEditorTemplate.tsx
export default function HomeEditorTemplate({ page }: Props) {
  const {
    pageState,
    isSaving,
    saved,
    error,
    handleHeroChange,
    handleSessaoChange,
    handleBannerChange,
    handleSessao4Change,
    handleSave,
  } = useHomeEditor(page);

  if (!pageState) return <p>Página não definida</p>;

  const renderSessaoProdutos = (
    key: "sessao2" | "sessao3" | "sessao5" | "sessao7"
  ) => {
    const sessao = pageState[key];
    if (!sessao) return null;

    // Mapear SessaoProduct -> RelatedProductNode
    const displayProducts: RelatedProductNode[] =
      sessao.featuredProducts?.map((p) => ({
        id: p.id,
        name: p.title || "",
        price: p.price || "",
        image: p.featuredImage?.node
          ? {
              sourceUrl: p.featuredImage.node.sourceUrl,
              altText: p.featuredImage.node.altText || "",
            }
          : undefined,
        tags: p.productTags?.nodes?.map((t) => t.name) || [], // ✅ Tags da UI
      })) || [];

    return (
      <SectionProductsEdit
        key={key}
        title={sessao.title || ""}
        products={displayProducts}
        onUpdate={(index, newProduct) => {
          const sessaoProducts = pageState[key]?.featuredProducts ?? [];
          const updatedProducts = [...sessaoProducts];

          // Atualiza produto mantendo productTags
          updatedProducts[index] = {
            ...updatedProducts[index],
            id: newProduct.id || updatedProducts[index]?.id || "",
            title: newProduct.name,
            price: newProduct.price,
            featuredImage: newProduct.image
              ? {
                  node: {
                    sourceUrl: newProduct.image.sourceUrl,
                    altText: newProduct.image.altText || null,
                  },
                }
              : updatedProducts[index]?.featuredImage,
            productTags: {
              nodes: newProduct.tags?.map((name) => ({ name })) || [],
            },
          };

          handleSessaoChange(key, { featuredProducts: updatedProducts });
        }}
        onTagChange={(index, checked) => {
          const sessaoProducts = pageState[key]?.featuredProducts ?? [];
          const updatedProducts = [...sessaoProducts];

          if (checked) {
            // Marca tag padrão "Tag"
            updatedProducts[index].productTags = { nodes: [{ name: "Tag" }] };
          } else {
            // Desmarca
            updatedProducts[index].productTags = { nodes: [] };
          }

          handleSessaoChange(key, { featuredProducts: updatedProducts });
        }}
        onTitleChange={(newTitle) =>
          handleSessaoChange(key, { title: newTitle })
        }
      />
    );
  };

  return (
    <Section className="py-8">
      <Title className="text-grayscale-550 text-2xl font-semibold mb-12">
        Sistema de gerenciamento do site
      </Title>

      {/* Hero principal */}
      <HeroEditor
        desktop={pageState.hero?.desktop}
        mobile={pageState.hero?.mobile}
        onChange={handleHeroChange}
      />

      {/* Sessões de produtos */}
      {renderSessaoProdutos("sessao2")}
      {renderSessaoProdutos("sessao3")}

      {/* Sessão 4 - Banner destacado */}
      {pageState.sessao4 && (
        <FeaturedFrameEditor
          image={pageState.sessao4.image}
          title={pageState.sessao4.title}
          text={pageState.sessao4.text}
          linkButton={pageState.sessao4.linkButton}
          onChange={handleSessao4Change}
        />
      )}

      {/* Sessão 5 */}
      {renderSessaoProdutos("sessao5")}

      {/* Banner inferior */}
      <HomeBannerEditor
        desktop={pageState.banner?.desktop}
        mobile={pageState.banner?.mobile}
        onChange={handleBannerChange}
      />

      {/* Sessão 7 */}
      {renderSessaoProdutos("sessao7")}

      {/* Botão de salvar */}
      <div className="w-fit mt-8">
        <ButtonPrimary disabled={isSaving} onClick={handleSave}>
          {isSaving ? "Salvando..." : saved ? "Salvo" : "Salvar alterações"}
        </ButtonPrimary>
        <SaveModal saved={saved} error={error} />
      </div>
    </Section>
  );
}
