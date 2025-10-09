"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.WOO_SITE_URL!;

// Tipos GraphQL
interface GraphQLErrorItem {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLErrorItem[];
}

interface MediaItem {
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

// GET: buscar mídias
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

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
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result: GraphQLResponse<MediaItemsResponse> = await res.json();

    if (!res.ok || result.errors?.length) {
      return NextResponse.json(
        {
          error:
            result.errors?.map((e) => e.message).join(", ") ||
            "Erro ao buscar mídia",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data?.mediaItems?.nodes || []);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}

// ========================
// POST → upload de mídia
// ========================
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não enviado" },
        { status: 400 }
      );
    }

    const wpForm = new FormData();
    wpForm.append("file", file, (file as File).name);

    // Upload server-side para o WordPress
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // mesmo token do cookie
      },
      body: wpForm,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    // Retorna a mídia criada
    return NextResponse.json({
      databaseId: data.id,
      sourceUrl: data.source_url,
      altText: data.alt_text,
      title: data.title.rendered,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
