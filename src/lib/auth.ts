// lib/auth.ts
import { cookies } from "next/headers";

// ----------------------
// 🔍 Tipagem do payload do JWT
// ----------------------
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  exp: number; // timestamp de expiração
  iat: number; // timestamp de emissão
  [key: string]: unknown; // outros campos extras do token
}

// ----------------------
// 🔍 Decodifica JWT
// ----------------------
function parseJwt(token: string): AuthUser | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload) as AuthUser; // ⬅️ tipagem explícita
  } catch {
    return null;
  }
}

// ----------------------
// 🚫 Erro padrão de auth
// ----------------------
export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

// ----------------------
// 🔹 Tipagem do refresh token response
// ----------------------
interface RefreshResponse {
  token: string;
}

// ----------------------
// ✅ getAuthUser() principal
// ----------------------
export async function getAuthUser(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token && !refreshToken) {
    throw new AuthError("Missing authentication tokens");
  }

  let decoded: AuthUser | null = token ? parseJwt(token) : null;
  const now = Math.floor(Date.now() / 1000);
  const isExpired = !decoded || decoded.exp < now;

  // 🔁 Se token expirou, tenta refresh
  if (isExpired && refreshToken) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new AuthError("Refresh token inválido");
      }

      const data: RefreshResponse = (await res.json()) as RefreshResponse;

      if (!data.token) {
        throw new AuthError("Token não pôde ser atualizado");
      }

      decoded = parseJwt(data.token);
      if (!decoded) {
        throw new AuthError("Token inválido após refresh");
      }

      return decoded;
    } catch (err) {
      console.error("Erro ao tentar refresh automático:", err);
      throw new AuthError("Token expirado");
    }
  }

  if (!decoded) {
    throw new AuthError("Token inválido");
  }

  return decoded; // retorna o payload do usuário
}
