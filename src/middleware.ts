import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/admin/home",
  "/admin/produtos",
  "/admin/configuracoes",
  "/admin/usuarios",
];

function parseJwt(token: string) {
  try {
    const payload = Buffer.from(token.split(".")[1], "base64").toString(
      "utf-8"
    );
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Proteção das rotas /admin
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete("token");
      res.cookies.delete("refreshToken");
      return res;
    }

    const decoded = parseJwt(token);
    const now = Math.floor(Date.now() / 1000);

    if (!decoded || (decoded.exp && decoded.exp < now)) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete("token");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  // Redireciona login se já estiver logado
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
