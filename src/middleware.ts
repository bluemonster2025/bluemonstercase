import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ======================================
// 1. Rotas protegidas por JWT
// ======================================
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

  // ======================================
  // 1️⃣ Proteção JWT para rotas /admin
  // ======================================
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

  // ======================================
  // 2️⃣ Redireciona login se já estiver logado
  // ======================================
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/home", req.url));
  }

  // ======================================
  // 3️⃣ Basic Auth para o resto do site
  // Ignora rotas /admin e /api
  // ======================================
  const authHeader = req.headers.get("authorization");
  const username = process.env.BASIC_AUTH_USER || "admin";
  const password = process.env.BASIC_AUTH_PASSWORD || "123456";

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    if (authHeader) {
      const [scheme, encoded] = authHeader.split(" ");

      if (scheme === "Basic" && encoded) {
        const decoded = Buffer.from(encoded, "base64").toString("utf-8");
        const [user, pass] = decoded.split(":");

        if (user === username && pass === password) {
          return NextResponse.next(); // ✅ autorizado
        }
      }
    }

    // Se não autorizado → pede autenticação
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area", charset="UTF-8"',
      },
    });
  }

  // ======================================
  // 4️⃣ Se tudo ok, continua
  // ======================================
  return NextResponse.next();
}

// ======================================
// Configuração do Middleware
// ======================================
export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"], // aplica globalmente
};
