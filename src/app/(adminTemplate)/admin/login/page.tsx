"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/elements/Section";
import { Text, Title } from "@/components/elements/Texts";
import { ButtonSecondary } from "@/components/elements/Button";
import { useUserContext } from "@/context/UserContext/context"; // 🔑 importa o contexto

export default function AdminLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { setUser } = useUserContext(); // 🔑 pega a função do contexto

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();

        // 🔑 Atualiza o contexto imediatamente
        setUser(data.user);

        // 🔑 Redireciona após atualizar o contexto
        router.push("/admin");
      } else {
        await res.json().catch(() => {});
        alert("Usuário ou senha inválido");
      }
    } catch (error) {
      console.error(error);
      alert("Usuário ou senha inválido");
    }
  }

  return (
    <Section className="bg-grayscale-200 p-12 mx-auto">
      <div className="flex flex-col gap-12">
        <Title className="text-2xl font-semibold text-grayscale-450 text-center">
          Sistema de gerenciamento
        </Title>
        <form
          onSubmit={submit}
          className="mx-auto flex flex-col gap-3 bg-white border border-grayscale-100 w-1/3 p-8 rounded-[6px]"
        >
          <p className="text-[22px] text-black mb-4">Login</p>
          <div className="flex flex-col gap-2">
            <Text>Usuário </Text>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="name"
              className="border border-grayscale-200 rounded p-4 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text>Senha </Text>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*********"
              className="border border-grayscale-200 rounded p-4 outline-none"
            />
          </div>
          <ButtonSecondary type="submit">
            <Text className="uppercase cursor-pointer">Entrar</Text>
          </ButtonSecondary>
        </form>
      </div>
    </Section>
  );
}
