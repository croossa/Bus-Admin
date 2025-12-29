import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // WAIT for cookies() to resolve
    const cookieStore = await cookies();

    // Set a cookie named "admin_token"
    cookieStore.set("admin_token", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 Day Login Session
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }
}
