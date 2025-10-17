// lib/requireAuth.ts
import { NextResponse } from "next/server";
import { getAuthUser, AuthError } from "@/lib/auth";

export async function requireAuth() {
  try {
    return await getAuthUser();
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }
}
