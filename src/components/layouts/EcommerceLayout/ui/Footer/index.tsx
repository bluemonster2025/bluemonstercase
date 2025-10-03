import { Section } from "@/components/elements/Section";
import { Text, Title } from "@/components/elements/Texts";
import Link from "next/link";
import { footerContent } from "./content";
import { LinkExternal } from "@/components/elements/LinkExternal/LinkExternal";
import Icon from "@/components/elements/Icon";

import { Skeleton } from "@/components/elements/Skeleton";
import Logo from "../Logo";

interface Props {
  logo?: { sourceUrl: string; altText?: string };
  loading?: boolean;
}

export default function Footer({ logo, loading }: Props) {
  return (
    <>
      <Section>
        <div className="flex gap-4 items-center justify-between">
          {loading || !logo ? (
            <div className="w-[112px] h-[112px] flex items-center">
              <Skeleton className="w-[108px] h-[38px] bg-gray-200 animate-pulse rounded" />
            </div>
          ) : (
            <Logo logo={logo} />
          )}

          <div className="flex gap-2">
            <LinkExternal href="/" aria-label="Instagram">
              <Icon name="FaInstagram" color="#000000" size={24} />
            </LinkExternal>
            <LinkExternal href="/" aria-label="Linkedin">
              <Icon name="FaLinkedinIn" color="#000000" size={24} />
            </LinkExternal>
            <LinkExternal href="/" aria-label="Facebook">
              <Icon name="FaFacebookF" color="#000000" size={24} />
            </LinkExternal>
          </div>
        </div>
      </Section>

      <Section className="bg-black text-white">
        <div className="py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
          {footerContent.map((item) => (
            <div key={item.title}>
              <Title as="h3" className="font-semibold mb-4 text-base">
                {item.title}
              </Title>

              {item.links && (
                <ul className="space-y-4 text-xs">
                  {item.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              )}

              {item.description && item.description}
            </div>
          ))}
        </div>
      </Section>

      <div className="bg-white text-grayscale-600 text-center text-sm py-4">
        <Text>©2025 Todos os direitos reservados - ncell.com.br</Text>
      </div>
    </>
  );
}
