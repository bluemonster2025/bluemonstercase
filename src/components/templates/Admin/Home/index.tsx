"use client";

import HeroEditor from "@/components/layouts/AdminLayout/HeroEditor";
import { ButtonSecondary } from "@/components/elements/Button";
import { Section } from "@/components/elements/Section";
import { PageHome } from "@/types/home";
import { useHomeEditor } from "@/hooks/useHomeEditor";
import { SaveModal } from "@/components/layouts/AdminLayout/ui/SaveModal";
import HomeBannerEditor from "@/components/layouts/AdminLayout/HomeBannerEditor";
import FeaturedFrameEditor from "@/components/layouts/AdminLayout/FeaturedFrameEditor";

interface Props {
  page: PageHome;
}

export default function HomeEditorTemplate({ page }: Props) {
  const {
    pageState,
    isSaving,
    saved,
    error,
    handleHeroChange,
    handleBannerChange,
    handleSessao4Change, // 👈 novo handler
    handleSave,
  } = useHomeEditor(page);

  if (!pageState) return <p>Página não definida</p>;

  return (
    <Section className="space-y-8">
      {/* Hero */}
      <HeroEditor
        desktop={pageState.hero?.desktop}
        mobile={pageState.hero?.mobile}
        onChange={handleHeroChange}
      />

      {/* Banner Sessão 6 */}
      <HomeBannerEditor
        desktop={pageState.banner?.desktop}
        mobile={pageState.banner?.mobile}
        onChange={handleBannerChange}
      />

      {/* Sessão 4 - Featured Frame */}
      <FeaturedFrameEditor
        image={pageState.sessao4?.image}
        title={pageState.sessao4?.title}
        text={pageState.sessao4?.text}
        linkButton={pageState.sessao4?.linkButton}
        onChange={handleSessao4Change}
      />

      {/* Botão salvar */}
      <div className="flex justify-end">
        <ButtonSecondary disabled={isSaving} onClick={handleSave}>
          {isSaving ? "Salvando..." : saved ? "Salvo ✅" : "Salvar alterações"}
        </ButtonSecondary>

        <SaveModal saved={saved} error={error} />
      </div>
    </Section>
  );
}
