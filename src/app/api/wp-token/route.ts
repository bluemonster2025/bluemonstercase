import { NextResponse } from "next/server";
import axios from "axios";

const WP_URL = process.env.WOO_SITE_URL;
const WP_USER = process.env.BASIC_AUTH_USER; // usuário WordPress
const WP_PASS = process.env.BASIC_AUTH_PASSWORD; // senha do usuário WordPress

export async function GET() {
  try {
    const { data } = await axios.post(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
      username: WP_USER,
      password: WP_PASS,
    });

    return NextResponse.json({ token: data.token });
  } catch (err) {
    console.error("Erro ao gerar JWT:", err);
    return NextResponse.json(
      { error: "Não foi possível gerar o token" },
      { status: 500 }
    );
  }
}
