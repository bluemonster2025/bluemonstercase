"use client";

import { BuyButtonProps } from "@/types/product";
import { ButtonPrimary, ButtonSecondary } from "@/components/elements/Button";
import Icon from "@/components/elements/Icon";
import { Text } from "@/components/elements/Texts";

export default function BuyButton({
  produto,
  title,
  icon,
  variant = "primary",
  fontWeight,
}: BuyButtonProps) {
  // ⚠ produto agora é sempre do tipo Product
  const numeroWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!numeroWhatsApp) {
    throw new Error(
      "Número de WhatsApp não definido. Configure NEXT_PUBLIC_WHATSAPP_NUMBER no .env"
    );
  }

  const produtoNome = produto.name || "Produto";
  const produtoPreco = produto.price ?? "";

  const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
    `Olá! Tenho interesse no produto: ${produtoNome}, preço: R$${produtoPreco}`
  )}`;

  const IconElement = icon ? <Icon name={icon} size={24} /> : null;

  return variant === "primary" ? (
    <ButtonPrimary type="button" href={link}>
      <div className="flex gap-2">
        {IconElement} <Text className={`${fontWeight}`}>{title}</Text>
      </div>
    </ButtonPrimary>
  ) : (
    <ButtonSecondary type="button" href={link}>
      <div className="flex gap-2">
        {IconElement} {title}
      </div>
    </ButtonSecondary>
  );
}
