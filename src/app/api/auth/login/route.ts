import { NextResponse } from "next/server";
import { getGraphQLClient } from "@/lib/graphql";
import { ClientError } from "graphql-request";

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: { clientMutationId: "login", username: $username, password: $password }) {
      authToken
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
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

// 🔹 Decodifica entidades HTML (&lt;strong&gt; -> <strong>)
function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
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

    const token = data.login.authToken;

    const response = NextResponse.json({
      success: true,
      user: data.login.user,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (err) {
    let errorMessage = "Usuário ou senha inválidos!";

    if (err instanceof ClientError && err.response?.errors?.length) {
      // 1️⃣ Decodifica entidades HTML (&lt;strong&gt;)
      let decoded = decodeHTMLEntities(err.response.errors[0].message);

      // 2️⃣ Remove tags HTML (<strong>)
      decoded = decoded.replace(/<[^>]+>/g, "").trim();

      // 3️⃣ Remove prefixos desnecessários (ex: "ERRO:", "Erro:")
      decoded = decoded.replace(/^(ERRO:|Erro:)\s*/i, "");

      errorMessage = decoded;
    }

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
