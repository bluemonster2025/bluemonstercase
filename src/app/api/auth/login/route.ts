// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const WP_URL = process.env.WOO_SITE_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  try {
    const { data } = await axios.post(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
      username,
      password,
    });

    const token: string = data.token;

    const res = NextResponse.json({
      ok: true,
      user: {
        id: data.user_id,
        nicename: data.user_nicename,
        displayName: data.user_display_name,
        email: data.user_email,
      },
    });

    res.cookies.set("wp_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        "Erro na API WordPress:",
        err.response?.data || err.message
      );
    } else {
      console.error("Erro inesperado:", err);
    }

    return NextResponse.json(
      { error: "Credenciais inválidas ou erro ao autenticar" },
      { status: 401 }
    );
  }
}
