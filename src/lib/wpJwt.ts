// lib/wpJwt.ts
import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export const getWpJwtToken = async (): Promise<string> => {
  const now = Date.now();

  // Retorna token do cache se ainda válido
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken!; // <-- garantimos que não é null
  }

  try {
    const response = await axios.post(
      `${process.env.WOO_SITE_URL}/wp-json/jwt-auth/v1/token`,
      {
        username: process.env.BASIC_AUTH_USER,
        password: process.env.BASIC_AUTH_PASSWORD,
      }
    );

    const { token, expires_in } = response.data;

    if (!token || !expires_in) {
      throw new Error("Resposta inválida do WordPress JWT");
    }

    cachedToken = token;
    tokenExpiry = now + (expires_in - 60) * 1000; // renova 1 min antes do vencimento

    return cachedToken!;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        `Erro ao obter JWT do WP: ${err.response?.status} ${err.response?.statusText}`
      );
    }
    throw err;
  }
};
