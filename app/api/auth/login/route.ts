import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // 1. Create the response first
    const response = NextResponse.json({ success: true });

    // 2. Set the cookie directly on the response object
    // This guarantees the header is sent with this specific response
    response.cookies.set("admin_token", "true", {
      httpOnly: true, 
      secure: true, // FORCE this to true for Vercel (HTTPS)
      maxAge: 60 * 60 * 24, // 1 Day
      path: "/",
      sameSite: "lax", // REQUIRED: This stops the browser from rejecting the cookie
    });

    return response;
    
  } else {
    return NextResponse.json(
      { success: false, error: "Invalid password" }, 
      { status: 401 }
    );
  }
}
