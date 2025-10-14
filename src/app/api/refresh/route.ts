"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.WOO_SITE_URL!;

const REFRESH_MUTATION = `
mutation RefreshAuthToken($refreshToken: String!) {
  refreshJwtAuthToken(
    input: { clientMutationId: "refresh", jwtRefreshToken: $refreshToken }
  ) {
    authToken
  }
}
`;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Sem refresh token" }, { status: 401 });
  }

  try {
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: REFRESH_MUTATION,
        variables: { refreshToken },
      }),
    });

    const json = await res.json();
    const newToken = json?.data?.refreshJwtAuthToken?.authToken;

    if (!newToken) {
      return NextResponse.json(
        { error: "Falha ao atualizar token" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Renova cookie do token por mais 30 minutos
    response.cookies.set("token", newToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar token" },
      { status: 500 }
    );
  }
}
