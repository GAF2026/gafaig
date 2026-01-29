import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      "GAFAIG Ask API is running. Send a POST request with { question: string }.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body?.question?.trim();

    if (!question) {
      return NextResponse.json(
        { ok: false, message: "Question is required." },
        { status: 400 }
      );
    }

    // MVP placeholder logic (authoritative, deterministic)
    const answer = `You asked: "${question}"

Ask GAFAIG is currently operating in MVP mode.

Responses are grounded in GAFAIG’s published standards and governance framework, including:
• GAFAIG S-001 (Foundational AI Governance Certification)
• GAFAIG S-002 (AI Incident Disclosure & Reporting)
• Certification, renewal, enforcement, and registry rules

This endpoint confirms live governance infrastructure readiness.
Authoritative answers will expand as GAFAIG standards are formally indexed.`;

    return NextResponse.json({
      ok: true,
      received: true,
      answer,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid request payload.",
      },
      { status: 400 }
    );
  }
}
