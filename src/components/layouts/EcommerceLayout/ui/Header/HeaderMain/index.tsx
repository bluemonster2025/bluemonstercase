"use client";

import Link from "next/link";
import Icon from "@/components/elements/Icon";
import { Section } from "@/components/elements/Section";
import { LogoType } from "@/types/home";
import Logo from "../Logo";

interface Props {
  data: LogoType;
}

export default function HeaderMain({ data }: Props) {
  return (
    <Section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* Logo */}
        <Logo logo={data} />

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
