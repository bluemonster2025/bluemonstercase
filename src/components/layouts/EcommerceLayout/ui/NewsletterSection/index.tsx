"use client";

import { useState } from "react";
import { Text } from "@/components/elements/Texts";
import { Section } from "@/components/elements/Section";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("E-mail enviado:", email);
    // Aqui você pode integrar com API de envio de newsletter
  };

  return (
    <Section className="bg-gray-100 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Text className="text-black text-[18px] text-center md:text-left flex items-center font-semibold">
          Receba nossas&nbsp;
          <Text className="text-greenscale-100 text-[18px]">
            novidades&nbsp;
          </Text>{" "}
          por e-mail
        </Text>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md md:w-[370px]"
        >
          <input
            type="email"
            placeholder="digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 rounded-l-lg focus:outline-none bg-white placeholder-grayscale-300 text-sm"
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-r-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </Section>
  );
}
