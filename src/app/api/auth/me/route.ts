"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser, AuthError } from "@/lib/auth";

const WP_URL = process.env.WOO_SITE_URL!;

// ------------------------
// Tipos
// ------------------------
export interface MediaItem {
  databaseId: number;
  sourceUrl: string;
  altText: string;
  title: string;
}

interface MediaItemsResponse {
  mediaItems: {
    nodes: MediaItem[];
  };
}

interface GraphQLErrorItem {
  message: string;
}

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLErrorItem[];
}

// ------------------------
// Função para fetch autenticado no WP GraphQL
// ------------------------
async function fetchWithToken<T>(query: string): Promise<GraphQLResponse<T>> {
  try {
    // 🔒 Garante que há um token válido (faz refresh se expirou)
    await getAuthUser();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new AuthError("Token ausente após autenticação");

    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result: GraphQLResponse<T> = await res.json();

    if (result.errors?.length) {
      console.error("GraphQL Errors:", result.errors);
    }

    return result;
  } catch (err) {
    if (err instanceof AuthError) {
      throw new AuthError("Usuário não autenticado ou token inválido");
    }
    throw err;
  }
}

// ------------------------
// GET → Buscar mídias
// ------------------------
export async function GET() {
  const query = `
    query MediaItems {
      mediaItems(first: 100) {
        nodes {
          databaseId
          sourceUrl
          altText
          title
        }
      }
    }
  `;

  try {
    const result = await fetchWithToken<MediaItemsResponse>(query);

    if (result.errors?.length) {
      return NextResponse.json(
        { error: result.errors.map((e) => e.message).join(", ") },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data?.mediaItems.nodes || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    const status = err instanceof AuthError ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// ------------------------
// POST → Upload de mídia
// ------------------------
export async function POST(req: Request) {
  try {
    // 🔒 Garante que o token está válido (ou faz refresh automático)
    await getAuthUser();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    // Lê o arquivo vindo do form
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file)
      return NextResponse.json(
        { error: "Arquivo não enviado" },
        { status: 400 }
      );

    const wpForm = new FormData();
    wpForm.append("file", file, (file as File).name);

    // Envia ao WP
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: wpForm,
    });

    const data = await res.json();

    if (!res.ok)
      return NextResponse.json({ error: data }, { status: res.status });

    return NextResponse.json({
      databaseId: data.id,
      sourceUrl: data.source_url,
      altText: data.alt_text,
      title: data.title.rendered,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    const status = err instanceof AuthError ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
