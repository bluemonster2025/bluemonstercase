// src/app/api/pageHome/route.ts
import { NextResponse } from "next/server";
import { mapHome } from "@/utils/mappers/mapHome";
import { RawHome, PageHome } from "@/types/home";

const WP_URL = process.env.WOO_SITE_URL!;

interface GraphQLResponse {
  data?: { page?: RawHome };
}

export async function GET() {
  const query = `
    query Home {
      page(id: "home", idType: URI) {
        id
        slug
        title
        homeHero {
          heroImage {
            node {
              altText
              sourceUrl
            }
          }
          heroImageMobile {
            node {
              altText
              sourceUrl
            }
          }
        }
        homeSessao2 {
          titleSessao2
          featuredProducts2 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags {
                  nodes {
                    name
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
              ... on SimpleProduct {
                price
              }
              ... on VariableProduct {
                price
              }
            }
          }
        }
        homeSessao3 {
          titleSessao3
          featuredProducts3 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags {
                  nodes {
                    name
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
              ... on SimpleProduct {
                price
              }
              ... on VariableProduct {
                price
              }
            }
          }
        }
        homeSessao4 {
          imageSessao4 {
            node {
              altText
              sourceUrl
            }
          }
          titleSessao4
          textSessao4
          linkButtonSessao4
        }
        homeSessao5 {
          featuredProducts5 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags {
                  nodes {
                    name
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
              ... on SimpleProduct {
                price
              }
              ... on VariableProduct {
                price
              }
            }
          }
        }
        homeBanner {
          homeBannerDesktop {
            node {
              altText
              sourceUrl
            }
          }
          homeBannerMobile {
            node {
              altText
              sourceUrl
            }
          }
        }
        homeSessao7 {
          titleSessao7
          featuredProducts7 {
            nodes {
              ... on Product {
                id
                uri
                title
                productTags {
                  nodes {
                    name
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
              ... on SimpleProduct {
                price
              }
              ... on VariableProduct {
                price
              }
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

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar página" },
        { status: res.status }
      );
    }

    const result: GraphQLResponse = await res.json();

    if (!result.data?.page) {
      return NextResponse.json(
        { error: "Página não encontrada" },
        { status: 404 }
      );
    }

    const page: PageHome = mapHome(result.data.page);

    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
