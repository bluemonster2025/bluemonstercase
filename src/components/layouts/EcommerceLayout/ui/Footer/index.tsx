import { Section } from "@/components/elements/Section";
import { Text, Title } from "@/components/elements/Texts";
import Link from "next/link";
import { footerContent } from "./content";
import Image from "next/image";
import { LinkExternal } from "@/components/elements/LinkExternal/LinkExternal";
import Icon from "@/components/elements/Icon";
import { Logo } from "@/types/home";

interface Props {
  data: Logo;
  fallbackImage?: string;
}

export default function Footer({
  data,
  fallbackImage = "/fallback.jpg",
}: Props) {
  const imgUrl = data?.url || fallbackImage;

  return (
    <>
      <Section>
        <div className="flex gap-4 items-center justify-between">
          <Link href="/" aria-label="Ncell">
            {imgUrl ? (
              <>
                <div className="relative w-28 aspect-square">
                  <Image
                    src={imgUrl}
                    alt="Logo Ncell"
                    fill
                    sizes="(max-width: 768px) 100vw, 112px"
                    className="rounded-lg object-contain"
                    priority
                  />
                </div>
              </>
            ) : (
              <p>Nenhum logo cadastrado</p>
            )}
          </Link>

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
