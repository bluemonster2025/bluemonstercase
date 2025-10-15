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
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const now = Math.floor(Date.now() / 1000);

  // 1️⃣ Proteção JWT para rotas /admin
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete({ name: "token", path: "/" });
      return res;
    }

    const decoded = parseJwt(token);
    if (!decoded || (decoded.exp && decoded.exp < now)) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete({ name: "token", path: "/" });
      return res;
    }
  }

  // 2️⃣ Redireciona login se já estiver logado
  if (pathname === "/admin/login" && token) {
    const decoded = parseJwt(token);
    if (decoded && (!decoded.exp || decoded.exp > now)) {
      return NextResponse.redirect(new URL("/admin/home", req.url));
    }
  }

  // 3️⃣ Basic Auth para o resto do site
  const authHeader = req.headers.get("authorization");
  const username = process.env.BASIC_AUTH_USER || "admin";
  const password = process.env.BASIC_AUTH_PASSWORD || "123456";

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    if (authHeader) {
      const [scheme, encoded] = authHeader.split(" ");
      if (scheme === "Basic" && encoded) {
        const decodedAuth = Buffer.from(encoded, "base64").toString("utf-8");
        const [user, pass] = decodedAuth.split(":");
        if (user === username && pass === password) return NextResponse.next();
      }
    }

    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area", charset="UTF-8"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
