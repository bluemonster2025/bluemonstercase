import { NextResponse } from "next/server";
import { getPageACFBySlug } from "@/lib/wp/wpData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "home"; // 👈 fallback padrão

  try {
    const data = await getPageACFBySlug(slug);
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const axiosError = err as {
        response?: { data?: unknown; status?: number };
      };
      const details = axiosError.response?.data ?? err.message;

      return NextResponse.json(
        { error: "Erro ao buscar dados do WordPress", details },
        { status: axiosError.response?.status ?? 500 }
      );
    }

    return NextResponse.json({ error: "Erro desconhecido" }, { status: 500 });
  }
}
