import { ReactNode } from "react";

export type FooterItem = {
  title: string;
  links?: { label: string; href: string }[];
  description?: ReactNode;
};

export const footerContent: FooterItem[] = [
  {
    title: "Ncell Osasco",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Política & Privacidade", href: "#" },
      { label: "Trabalhe conosco", href: "#" },
      { label: "Encontre uma loja", href: "#" },
      { label: "Eventos", href: "#" },
    ],
  },
  {
    title: "Categorias",
    links: [
      { label: "Capas", href: "#" },
      { label: "Películas", href: "#" },
      { label: "Carregadores", href: "#" },
      { label: "Celulares", href: "#" },
      { label: "Acessórios", href: "#" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Envio e entregas", href: "#" },
      { label: "Rastreie seu pedido", href: "#" },
      { label: "Pagamentos e reembolsos", href: "#" },
      { label: "Devoluções e trocas", href: "#" },
      { label: "Cancelamentos", href: "#" },
    ],
  },
  {
    title: "Relacionamento",
    links: [
      { label: "Rastreie seu pedido", href: "#" },
      { label: "Contato comercial", href: "#" },
      { label: "Contato SAC", href: "#" },
      { label: "Feedbacks", href: "#" },
      { label: "Reclamações", href: "#" },
    ],
  },
  {
    title: "Contato",
    description: (
      <ul className="flex flex-col justify-between h-36 text-xs">
        <li>
          <strong>Ncell - Osasco</strong>
          <br />
          Avenida das Autonomias, 1400 - Vila Yara
        </li>
        <li>
          <strong>Telefone:</strong>
          <br />
          (11) 0000-0000
        </li>
        <li>
          <strong>E-mail:</strong>
          <br />
          atendimento@ncell.com.br
        </li>
      </ul>
    ),
  },
];
