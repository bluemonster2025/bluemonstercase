// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req: Request) {
  console.log("🔒 Middleware rodando em:", req.url); // Para debug no localhost

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

  // Resposta 401 que força o popup do navegador
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area", charset="UTF-8"',
    },
  });
}

// Matcher atualizado:
// - Ignora assets estáticos (_next, favicon, robots)
// - Ignora rotas /api
// - Protege todas as outras páginas
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|api).*)"],
};
