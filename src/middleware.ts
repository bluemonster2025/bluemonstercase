import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WP_URL = process.env.WOO_SITE_URL;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ======================================
  // 1. Proteção com JWT no /admin
  // ======================================
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("wp_jwt")?.value;
    const isLoginPage = pathname.startsWith("/admin/login");

    if (!token) {
      if (!isLoginPage) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      return NextResponse.next();
    }

    // 🔎 Valida token no WordPress
    try {
      const wpRes = await fetch(
        `${WP_URL}/wp-json/jwt-auth/v1/token/validate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!wpRes.ok) {
        // token inválido ou expirado → força login
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch (err) {
      console.error("Erro validando token JWT no WordPress:", err);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (isLoginPage) {
      // já autenticado e tentando acessar login → redireciona
      return NextResponse.redirect(new URL("/admin/home", req.url));
    }

    return NextResponse.next();
  }

  // ======================================
  // 2. Basic Auth para o resto do site
  // ======================================
  const authHeader = req.headers.get("authorization");

  const username = process.env.BASIC_AUTH_USER || "admin";
  const password = process.env.BASIC_AUTH_PASSWORD || "123456";

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

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area", charset="UTF-8"',
    },
  });
}

// Middleware roda em tudo, exceto assets estáticos e /api
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|api).*)"],
};
