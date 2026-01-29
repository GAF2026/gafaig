import { NextResponse } from "next/server";

type AskBody = { question?: string };

const KB = {
  project: {
    name: "GAFAIG",
    longName: "Global Authority for AI Governance",
    hero:
      "A global framework for human-centered AI governance, enabling transparent oversight, participation, and accountability at planetary scale.",
  },
  standards: {
    "S-001": {
      slug: "/standards/s-001",
      title: "GAFAIG-S-001 — Human Impact Disclosure Standard",
      summary:
        "A disclosure standard that requires clear, human-readable reporting of AI system impacts, scope, risks, and accountability signals.",
      whenToUse:
        "Use S-001 when the question is about impact disclosure, transparency to the public, required fields in a disclosure, or what an AI developer must publish.",
    },
    "S-002": {
      slug: "/standards/s-002",
      title: "GAFAIG-S-002 — AI Incident Disclosure & Reporting Standard",
      summary:
        "A reporting standard for AI incidents, including severity, confidence, containment, notification, and post-incident updates.",
      whenToUse:
        "Use S-002 when the question is about incidents, reporting timelines, severity/confidence scoring, corrective actions, or public incident transparency.",
    },
  },
  policy: {
    anchor:
      "GAFAIG policy pages define enforcement boundaries, revocation/suspension, appeals, registry disclosure thresholds, and master terms.",
    links: [
      "/policy",
      "/policy/enforcement-boundary",
      "/policy/revocation-suspension",
      "/policy/appeals",
      "/policy/registry-disclosure-thresholds",
      "/policy/master-terms",
    ],
  },
  certification: {
    overview:
      "GAFAIG certification is a structured pathway for systems to meet defined governance and disclosure standards, with renewal and low-risk fast-track options.",
    links: ["/certification", "/certification/apply", "/certification/renewal"],
  },
};

function normalize(q: string) {
  return q.trim().replace(/\s+/g, " ");
}

function classify(question: string) {
  const q = question.toLowerCase();

  const isS001 =
    q.includes("s-001") ||
    q.includes("s001") ||
    q.includes("human impact") ||
    q.includes("impact disclosure") ||
    q.includes("disclosure standard") ||
    q.includes("transparency");

  const isS002 =
    q.includes("s-002") ||
    q.includes("s002") ||
    q.includes("incident") ||
    q.includes("reporting") ||
    q.includes("severity") ||
    q.includes("confidence score") ||
    q.includes("breach") ||
    q.includes("harm event");

  const isCertification =
    q.includes("certification") ||
    q.includes("apply") ||
    q.includes("renewal") ||
    q.includes("fast-track") ||
    q.includes("reviewer");

  const isRegistry =
    q.includes("registry") ||
    q.includes("public record") ||
    q.includes("listed") ||
    q.includes("lookup");

  const isPolicy =
    q.includes("policy") ||
    q.includes("appeal") ||
    q.includes("revocation") ||
    q.includes("suspension") ||
    q.includes("enforcement") ||
    q.includes("terms") ||
    q.includes("boundary");

  return { isS001, isS002, isCertification, isRegistry, isPolicy };
}

function buildAnswer(questionRaw: string) {
  const question = normalize(questionRaw);
  const c = classify(question);

  // If both standards appear, provide a compare response
  if (c.isS001 && c.isS002) {
    return [
      `You asked: "${question}"`,
      ``,
      `**GAFAIG S-001 vs S-002 (quick distinction):**`,
      `- **S-001** focuses on *human impact disclosure*—what an AI system is, how it affects people, and what should be transparently disclosed.`,
      `- **S-002** focuses on *AI incident disclosure & reporting*—how to report harmful/abnormal events, including severity, confidence, containment, and updates.`,
      ``,
      `Helpful links:`,
      `- ${KB.standards["S-001"].slug}`,
      `- ${KB.standards["S-002"].slug}`,
    ].join("\n");
  }

  if (c.isS001) {
    return [
      `You asked: "${question}"`,
      ``,
      `**${KB.standards["S-001"].title}**`,
      `${KB.standards["S-001"].summary}`,
      ``,
      `**When this applies:**`,
      `${KB.standards["S-001"].whenToUse}`,
      ``,
      `Read the standard: ${KB.standards["S-001"].slug}`,
    ].join("\n");
  }

  if (c.isS002) {
    return [
      `You asked: "${question}"`,
      ``,
      `**${KB.standards["S-002"].title}**`,
      `${KB.standards["S-002"].summary}`,
      ``,
      `**When this applies:**`,
      `${KB.standards["S-002"].whenToUse}`,
      ``,
      `Read the standard: ${KB.standards["S-002"].slug}`,
    ].join("\n");
  }

  if (c.isCertification) {
    return [
      `You asked: "${question}"`,
      ``,
      `**GAFAIG Certification (overview):**`,
      `${KB.certification.overview}`,
      ``,
      `Next steps:`,
      `- Certification overview: ${KB.certification.links[0]}`,
      `- Apply: ${KB.certification.links[1]}`,
      `- Renewal: ${KB.certification.links[2]}`,
    ].join("\n");
  }

  if (c.isRegistry) {
    return [
      `You asked: "${question}"`,
      ``,
      `**GAFAIG Public Certification Registry:**`,
      `The registry is the public record of certification status and (where applicable) disclosure thresholds and material status changes.`,
      ``,
      `Go here: /registry`,
      `Policy background: /policy/registry-disclosure-thresholds`,
    ].join("\n");
  }

  if (c.isPolicy) {
    return [
      `You asked: "${question}"`,
      ``,
      `**GAFAIG Policy & Enforcement:**`,
      KB.policy.anchor,
      ``,
      `Key pages:`,
      ...KB.policy.links.map((l) => `- ${l}`),
    ].join("\n");
  }

  // default response (still GAFAIG-anchored)
  return [
    `You asked: "${question}"`,
    ``,
    `**${KB.project.longName} (GAFAIG):**`,
    KB.project.hero,
    ``,
    `If you’re asking about standards, try:`,
    `- S-001 (Human Impact Disclosure): ${KB.standards["S-001"].slug}`,
    `- S-002 (Incident Reporting): ${KB.standards["S-002"].slug}`,
    ``,
    `If you’re asking about certification or policy, try:`,
    `- Certification: /certification`,
    `- Policy: /policy`,
    `- Registry: /registry`,
    ``,
    `Tip: Ask me “What does S-001 require?” or “How does GAFAIG handle incident reporting?”`,
  ].join("\n");
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'GAFAIG Ask API is running. Send a POST with { "question": string }.',
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AskBody;
    const question = body?.question?.trim();

    if (!question) {
      return NextResponse.json(
        { ok: false, received: false, error: "Missing required field: question" },
        { status: 400 }
      );
    }

    const answer = buildAnswer(question);

    return NextResponse.json({
      ok: true,
      received: true,
      answer,
      meta: {
        routed: true,
        hint:
          "This is a deterministic GAFAIG-anchored responder. Next step will add structured templates + expandable knowledge.",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, received: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
