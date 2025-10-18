import { NextRequest, NextResponse } from "next/server";
import { mapProduct } from "@/utils/mappers/mapProduct";
import type { RawProduct } from "@/types/product";

const WP_URL = process.env.WOO_SITE_URL!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || null;
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : null;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : null;
  const order = searchParams.get("sort")?.toUpperCase() || null; // ASC | DESC

  const query = `
    query Products(
  $search: String
  $categoryId: Int
  $minPrice: Float
  $maxPrice: Float
  $order: OrderEnum
  $after: String
) {
  products(
    first: 50
    after: $after
    where: {
      search: $search
      categoryId: $categoryId
      minPrice: $minPrice
      maxPrice: $maxPrice
      orderby: { field: PRICE, order: $order }
    }
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ... on SimpleProduct {
        id
        name
        slug
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        productTags {
          nodes {
            name
          }
        }
        ... on ProductWithPricing {
          price
          regularPrice
          salePrice
        }
      }

      ... on VariableProduct {
        id
        name
        slug
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        productTags {
          nodes {
            name
          }
        }
        ... on ProductWithPricing {
          price
          regularPrice
          salePrice
        }
      }

      ... on UniformResourceIdentifiable {
        uri
      }

      image {
        sourceUrl
        altText
      }
    }
  }
}

  `;

  try {
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { search, categoryId, minPrice, maxPrice, order },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar produtos" },
        { status: res.status }
      );
    }

    const result = await res.json();

    const mappedProducts = result.data.products.nodes.map((p: RawProduct) =>
      mapProduct(p)
    );

    return NextResponse.json(mappedProducts);
  } catch (err) {
    console.error("❌ Erro interno ao buscar produtos:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
