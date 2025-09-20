"use client";

import { useUserContext } from "@/context/UserContext/context";
import Logo from "../../EcommerceLayout/ui/Header/Logo";
import { useRouter } from "next/navigation";
import { Section } from "@/components/elements/Section";
import { LogoType } from "@/types/home";

interface Props {
  data: LogoType;
}

export default function Header({ data }: Props) {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/admin/login");
  }

  return (
    <Section className="flex items-center p-4">
      {user ? (
        // Usuário logado → logo à esquerda e botão logout à direita
        <div className="flex justify-between w-full items-center">
          <Logo logo={data} />
          <button
            onClick={handleLogout}
            className="cursor-pointer px-6 py-2 bg-white border border-grayscale-100 text-grayscale-450 rounded text-sm font-semibold"
          >
            Sair
          </button>
        </div>
      ) : (
        // Usuário não logado → logo centralizada
        <div className="flex justify-center w-full">
          <Logo logo={data} />
        </div>
      )}
    </Section>
  );
}
