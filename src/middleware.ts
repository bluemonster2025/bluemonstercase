import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ======================================
// Rotas que exigem autenticação (admin)
// ======================================
const protectedPaths = [
  "/admin/home",
  "/admin/produtos",
  "/admin/configuracoes",
  "/admin/usuarios",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ======================================
  // 1. Proteção das rotas /admin
  // ======================================
  const token = req.cookies.get("token")?.value;

  // Bloqueia qualquer rota admin sem token
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Redireciona login se já estiver logado
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/home", req.url));
  }

  // ======================================
  // 2. Basic Auth para o resto do site
  // ======================================
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api");

  if (!isAdminRoute) {
    const authHeader = req.headers.get("authorization");
    const username = process.env.BASIC_AUTH_USER || "admin";
    const password = process.env.BASIC_AUTH_PASSWORD || "123456";

    if (authHeader) {
      const [scheme, encoded] = authHeader.split(" ");

      if (scheme === "Basic" && encoded) {
        const decoded = Buffer.from(encoded, "base64").toString("utf-8");
        const [user, pass] = decoded.split(":");

        if (user === username && pass === password) {
          // ✅ Autorizado
          return NextResponse.next();
        }
      }
    }

    // ❌ Falhou na autenticação → mostra popup padrão do navegador
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area", charset="UTF-8"',
      },
    });
  }

  return NextResponse.next();
}

// ======================================
// Configuração do matcher
// ======================================
export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"], // aplica em tudo exceto assets
};
