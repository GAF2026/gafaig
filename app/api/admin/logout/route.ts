import { NextResponse } from "next/server";

const COOKIE_NAME = "gafaig_admin";

export async function GET() {
  // Clear cookie then redirect to login
  const res = NextResponse.redirect(new URL("/admin/login", "http://localhost:3000"));

  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });

  return res;
}
