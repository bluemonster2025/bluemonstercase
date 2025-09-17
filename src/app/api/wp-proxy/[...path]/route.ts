import { NextResponse } from "next/server";

export async function GET(req: Request, context: unknown) {
  // Fazemos uma verificação runtime
  const path = (context as { params?: { path?: string[] } })?.params?.path;
  if (!path || !Array.isArray(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const wpPath = path.join("/");
  const wpUrl = `https://cms.bluemonstercase.com/wp-json/${wpPath}`;

  try {
    const response = await fetch(wpUrl, {
      headers: {
        Authorization: `Bearer ${process.env.WP_JWT_SECRET}`,
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from WordPress" },
      { status: 500 }
    );
  }
}
