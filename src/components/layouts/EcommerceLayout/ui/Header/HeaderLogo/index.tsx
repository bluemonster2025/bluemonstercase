"use client";

import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/types/home";

interface Props {
  logo: Logo;
  fallbackImage?: string;
  className?: string;
}

export default function HeaderLogo({
  logo,
  fallbackImage = "/fallback.jpg",
  className = "relative w-28 aspect-[2/1] lg:aspect-square",
}: Props) {
  const imgUrl = logo?.url || fallbackImage;

  return (
    <Link href="/" aria-label="Logo">
      <div className={className}>
        <Image
          src={imgUrl}
          alt="Logo Ncell"
          fill
          sizes="(max-width: 768px) 100vw, 112px"
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
