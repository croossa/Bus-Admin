import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // WAIT for cookies() to resolve
  const cookieStore = await cookies();
  
  // Delete the cookie
  cookieStore.delete("admin_token");
  
  // Redirect to login page
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}