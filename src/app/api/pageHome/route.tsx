"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mapHome } from "@/utils/mappers/mapHome";
import { RawHome, PageHome } from "@/types/home";

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
type AcfFields = Record<string, unknown>;

// ========================
// GET → página Home
// ========================
export async function GET() {
  const query = `
    query Home {
      page(id: "home", idType: URI) {
        databaseId
        id
        slug
        title
        homeHero {
          heroImage { node { altText sourceUrl } }
          heroImageMobile { node { altText sourceUrl } }
        }
        homeSessao2 {
          titleSessao2
          featuredTags2
          visibleTag2
          featuredProducts2 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags { nodes { name } }
                featuredImage { node { sourceUrl altText } }
              }
              ... on SimpleProduct { price }
              ... on VariableProduct { price }
            }
          }
        }
        homeSessao3 {
          titleSessao3
          featuredTags3
          visibleTag3
          featuredProducts3 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags { nodes { name } }
                featuredImage { node { sourceUrl altText } }
              }
              ... on SimpleProduct { price }
              ... on VariableProduct { price }
            }
          }
        }
        homeSessao4 {
          imageSessao4 { node { altText sourceUrl } }
          titleSessao4
          textSessao4
          linkButtonSessao4
        }
        homeSessao5 {
          featuredTags5
          visibleTag5
          featuredProducts5 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags { nodes { name } }
                featuredImage { node { sourceUrl altText } }
              }
              ... on SimpleProduct { price }
              ... on VariableProduct { price }
            }
          }
        }
        homeBanner {
          homeBannerDesktop { node { altText sourceUrl } }
          homeBannerMobile { node { altText sourceUrl } }
        }
        homeSessao7 {
          titleSessao7
          featuredTags7
          visibleTag7
          featuredProducts7 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags { nodes { name } }
                featuredImage { node { sourceUrl altText } }
              }
              ... on SimpleProduct { price }
              ... on VariableProduct { price }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const result: GraphQLResponse<{ page: RawHome }> = await res.json();

    if (!res.ok || !result.data?.page) {
      return NextResponse.json(
        { error: "Erro ao buscar página" },
        { status: res.status || 404 }
      );
    }

    const page: PageHome = mapHome(result.data.page);
    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ========================
// POST → atualizar ACF
// ========================
interface UpdateACFResponse {
  updateACFFields: { success: boolean };
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      // Redireciona para /admin/login se não autenticado
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const data: { pageId: number; acfFields: AcfFields } = await req.json();

    const mutation = `
      mutation UpdateAnyACF($input: UpdateACFFieldsInput!) {
        updateACFFields(input: $input) {
          success
        }
      }
    `;

    const variables = {
      input: {
        pageId: data.pageId,
        acfFields: JSON.stringify(data.acfFields),
      },
    };

    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const result: GraphQLResponse<UpdateACFResponse> = await res.json();

    if (!res.ok || result.errors?.length) {
      return NextResponse.json(
        {
          error:
            result.errors?.map((e) => e.message).join(", ") || "Erro ao salvar",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
