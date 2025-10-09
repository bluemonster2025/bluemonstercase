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
