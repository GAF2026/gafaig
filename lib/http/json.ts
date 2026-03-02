// lib/http/json.ts
import { NextResponse } from "next/server";

/**
 * Small helper to return JSON responses consistently.
 * Usage:
 *   return json({ ok: true })
 *   return json({ ok: false, error: "..." }, 500)
 */
export function json(body: unknown, status = 200, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");

  return NextResponse.json(body as any, { status, headers });
}