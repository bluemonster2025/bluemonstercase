"use client";

import HeroEditor from "@/components/layouts/AdminLayout/HeroEditor";
import { ButtonSecondary } from "@/components/elements/Button";
import { Section } from "@/components/elements/Section";
import { PageHome } from "@/types/home";
import { useHomeEditor } from "@/hooks/useHomeEditor";
import { SaveModal } from "@/components/layouts/AdminLayout/ui/SaveModal";

interface Props {
  page: PageHome;
}

export default function HomeEditorTemplate({ page }: Props) {
  const { pageState, isSaving, saved, error, handleHeroChange, handleSave } =
    useHomeEditor(page);

  if (!pageState) return <p>Página não definida</p>;

  return (
    <Section className="space-y-8">
      <HeroEditor
        desktop={pageState.hero?.desktop}
        mobile={pageState.hero?.mobile}
        onChange={handleHeroChange}
      />

      <div className="flex justify-end">
        <ButtonSecondary disabled={isSaving} onClick={handleSave}>
          {isSaving ? "Salvando..." : saved ? "Salvo ✅" : "Salvar alterações"}
        </ButtonSecondary>

        <SaveModal saved={saved} error={error} />
      </div>
    </Section>
  );
}
