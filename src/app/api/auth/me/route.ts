// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const WP_URL = process.env.WOO_SITE_URL;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("wp_jwt")?.value;

  if (!token) return NextResponse.json({ user: null });

  try {
    const { data } = await axios.get(`${WP_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json({
      user: {
        id: data.id,
        nicename: data.slug,
        displayName: data.name,
        email: data.email,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
