"use client";

import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/elements/Icon";
import { Section } from "@/components/elements/Section";
import { Logo } from "@/types/home";

interface Props {
  data: Logo;
  fallbackImage?: string;
}

export default function HeaderMain({
  data,
  fallbackImage = "/fallback.jpg",
}: Props) {
  const imgUrl = data?.url || fallbackImage;
  return (
    <Section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* Logo */}
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

        {/* Busca */}
        <Link
          href="/buscar"
          className="flex w-full flex-1 items-center rounded-lg bg-grayscale-150 cursor-pointer text-sm"
        >
          <input
            type="text"
            placeholder="O que você está buscando?"
            className="flex-1 px-3 py-2 rounded-l-md bg-transparent outline-none cursor-pointer"
            readOnly
          />
          <span className="px-3">
            <Icon name="CiSearch" color="#272934" size={16} />
          </span>
        </Link>

        {/* Login */}
        <Link
          href="/login"
          className="bg-grayscale-550 text-white px-6 py-2 rounded text-center md:w-auto w-full text-sm"
        >
          Login
        </Link>
      </div>
    </Section>
  );
}
