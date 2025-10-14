"use server";

import { NextResponse } from "next/server";
import { getGraphQLClient } from "@/lib/graphql";
import { ClientError } from "graphql-request";

const LOGIN_MUTATION = `
mutation Login($username: String!, $password: String!) {
  login(input: { clientMutationId: "login", username: $username, password: $password }) {
    authToken
    refreshToken
    user {
      id
      name
      email
    }
  }
}
`;

interface LoginResponse {
  login: {
    authToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Usuário e senha são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const client = getGraphQLClient();
    const data = await client.request<LoginResponse>(LOGIN_MUTATION, {
      username,
      password,
    });
    const { authToken, refreshToken, user } = data.login;

    const response = NextResponse.json({ success: true, user });

    // Token de 30 minutos
    response.cookies.set("token", authToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    // Refresh token de 7 dias
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return response;
  } catch (err) {
    let errorMessage = "Usuário ou senha inválidos!";
    if (err instanceof ClientError && err.response?.errors?.length) {
      errorMessage = err.response.errors[0].message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
