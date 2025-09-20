"use client";

import { useUserContext } from "@/context/UserContext/context";
import Logo from "../../EcommerceLayout/ui/Header/Logo";
import { useRouter, usePathname } from "next/navigation";
import { Section } from "@/components/elements/Section";
import { LogoType } from "@/types/home";

interface Props {
  data: LogoType;
}

export default function Header({ data }: Props) {
  const { user, setUser } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/admin/login");
  }

  const menuItems = [
    { label: "Home", path: "/admin/home" },
    { label: "Meus Produtos", path: "/admin/produtos" },
    { label: "Configurações", path: "/admin/configuracoes" },
    { label: "Usuários", path: "/admin/usuarios" },
  ];

  return (
    <header className="w-full">
      {/* Topo do Header */}
      <Section className="flex items-center py-4">
        {user ? (
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
          <div className="flex justify-center w-full">
            <Logo logo={data} />
          </div>
        )}
      </Section>

      {/* Menu abaixo do header (apenas logado) */}
      {user && (
        <Section className="border-t border-grayscale-200">
          <nav>
            <ul className="flex gap-6 py-3 text-sm font-medium text-grayscale-500">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => router.push(item.path)}
                      className={`text-grayscale-450 cursor-pointer ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Section>
      )}
    </header>
  );
}
