"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  nicename: string;
  displayName: string;
  email: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me"); // rota que retorna o usuário logado
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return user;
}
