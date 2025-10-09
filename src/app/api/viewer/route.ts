import { NextResponse } from "next/server";
import { getGraphQLClient } from "@/lib/graphql";

const VIEWER_QUERY = `
  query Viewer {
    viewer {
      id
      name
      email
      username
      avatar {
        url
      }
    }
  }
`;

// Tipagem da resposta esperada
interface Viewer {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: {
    url: string;
  } | null;
}

interface ViewerResponse {
  viewer: Viewer | null;
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ viewer: null });

  try {
    const client = getGraphQLClient(token);
    const data = await client.request<ViewerResponse>(VIEWER_QUERY);
    return NextResponse.json({ viewer: data.viewer });
  } catch {
    // err removido já que não é usado
    return NextResponse.json({ viewer: null });
  }
}
