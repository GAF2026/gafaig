import { NextResponse } from "next/server";

type AskRequest = {
  question?: string;
  context?: {
    page?: string;
    userRole?: "public" | "applicant" | "reviewer" | "admin";
  };
};

type AskResponse = {
  ok: true;
  received: true;
  requestId: string;
  question: string;
  answer: {
    summary: string;
    directAnswer: string;
    references: Array<{ label: string; href: string; type: "standard" | "policy" | "page" }>;
    citations: Array<{ source: string; note: string }>;
    escalation: {
      shouldEscalate: boolean;
      reason?: string;
      contactPath?: string;
    };
    policyFlags: {
      legalOrRegulatoryAdvice: boolean;
      safetyCritical: boolean;
      defamationOrAccusation: boolean;
      personalData: boolean;
    };
  };
};

function makeId() {
  // short deterministic-ish id
  const rnd = Math.random().toString(16).slice(2);
  const ts = Date.now().toString(16);
  return `gafaig-ask-${ts}-${rnd.slice(0, 6)}`;
}

function normalize(q: string) {
  return q.trim().replace(/\s+/g, " ");
}

function detectFlags(question: string) {
  const q = question.toLowerCase();

  const legalOrRegulatoryAdvice =
    /\b(law|legal|regulation|regulatory|sue|lawsuit|liability|compliance with (gdpr|hipaa|ccpa)|attorney)\b/.test(q);

  const safetyCritical =
    /\b(medical|diagnosis|treatment|life[- ]?critical|aviation|nuclear|weapon|self-harm|suicide)\b/.test(q);

  const defamationOrAccusation =
    /\b(fraud|scam|criminal|illegal|cover[- ]?up|corrupt|brib(e|ery))\b/.test(q);

  const personalData =
    /\b(ssn|social security|passport|driver.?s license|home address|phone number|email address)\b/.test(q);

  return { legalOrRegulatoryAdvice, safetyCritical, defamationOrAccusation, personalData };
}

function baseReferences() {
  return [
    { label: "GAFAIG Standards", href: "/standards", type: "page" as const },
    { label: "GAFAIG-S-001 (Human Impact Disclosure)", href: "/standards/s-001", type: "standard" as const },
    { label: "GAFAIG-S-002 (AI Incident Disclosure & Reporting)", href: "/standards/s-002", type: "standard" as const },
    { label: "Certification Overview", href: "/certification", type: "page" as const },
    { label: "Master Terms", href: "/policy/master-terms", type: "policy" as const },
    { label: "Enforcement Boundary", href: "/policy/enforcement-boundary", type: "policy" as const },
    { label: "Revocation & Suspension Policy", href: "/policy/revocation-suspension", type: "policy" as const },
    { label: "Appeals Policy", href: "/policy/appeals", type: "policy" as const },
    { label: "Registry Disclosure Thresholds", href: "/policy/registry-disclosure-thresholds", type: "policy" as const },
    { label: "Public Registry", href: "/registry", type: "page" as const }
  ];
}

function answerRouter(question: string) {
  const q = question.toLowerCase();

  // Very lightweight routing (we’ll replace later with real retrieval + models)
  if (q.includes("s-001") || q.includes("human impact disclosure")) {
    return {
      summary: "GAFAIG-S-001 is the foundational disclosure standard for human impacts of AI systems.",
      directAnswer:
        "GAFAIG-S-001 defines what certified organizations must disclose about human impact: system purpose and scope, affected populations, risk identification, mitigations, monitoring, and accountability ownership. It is used both in certification review and in ongoing posture updates.",
      refs: [
        { label: "GAFAIG-S-001 (Human Impact Disclosure)", href: "/standards/s-001", type: "standard" as const },
        { label: "Certification Overview", href: "/certification", type: "page" as const }
      ]
    };
  }

  if (q.includes("s-002") || q.includes("incident disclosure") || q.includes("incident reporting")) {
    return {
      summary: "GAFAIG-S-002 defines how organizations disclose and report AI incidents.",
      directAnswer:
        "GAFAIG-S-002 specifies incident definitions, severity concepts, disclosure expectations, and the minimum information required to report and update incidents. It supports consistent transparency without implying regulatory authority.",
      refs: [
        { label: "GAFAIG-S-002 (AI Incident Disclosure & Reporting)", href: "/standards/s-002", type: "standard" as const },
        { label: "Registry Disclosure Thresholds", href: "/policy/registry-disclosure-thresholds", type: "policy" as const }
      ]
    };
  }

  if (q.includes("certification") || q.includes("apply") || q.includes("how do i get certified")) {
    return {
      summary: "GAFAIG certification is a private mark-and-licensing program based on GAFAIG standards and policies.",
      directAnswer:
        "To pursue certification, an organization applies, provides required disclosures, acknowledges the Master Terms, and undergoes a policy-bound review. Certification status is recorded in the public registry. Applicants can renew annually and may be eligible for a low-risk fast-track route.",
      refs: [
        { label: "Certification Overview", href: "/certification", type: "page" as const },
        { label: "Apply", href: "/certification/apply", type: "page" as const },
        { label: "Renewal / Fast-Track", href: "/certification/renewal", type: "page" as const },
        { label: "Master Terms", href: "/policy/master-terms", type: "policy" as const }
      ]
    };
  }

  if (q.includes("registry") || q.includes("public registry")) {
    return {
      summary: "The GAFAIG public registry lists certification status and limited disclosure fields by policy threshold.",
      directAnswer:
        "GAFAIG’s registry is the authoritative public record of certification status. Disclosures are governed by the Registry Disclosure Thresholds policy and may change as certification status changes (e.g., renewal, suspension, revocation, appeals).",
      refs: [
        { label: "Public Registry", href: "/registry", type: "page" as const },
        { label: "Registry Disclosure Thresholds", href: "/policy/registry-disclosure-thresholds", type: "policy" as const }
      ]
    };
  }

  if (q.includes("why") && q.includes("change")) {
    return {
      summary: "Certification can change when scope, disclosures, or policy-bound findings change.",
      directAnswer:
        "GAFAIG certification status can change due to renewals, scope changes, new incident disclosures, policy threshold triggers, verification findings, misuse of the mark, or outcomes of appeals. GAFAIG publishes a non-punitive, procedural posture for these changes.",
      refs: [
        { label: "Revocation & Suspension Policy", href: "/policy/revocation-suspension", type: "policy" as const },
        { label: "Appeals Policy", href: "/policy/appeals", type: "policy" as const },
        { label: "Enforcement Boundary", href: "/policy/enforcement-boundary", type: "policy" as const }
      ]
    };
  }

  // default
  return {
    summary: "GAFAIG provides policy-bound, public-facing guidance tied to standards, certification, and registry rules.",
    directAnswer:
      "Ask GAFAIG can explain GAFAIG standards (S-001/S-002), certification steps, registry disclosures, and core policy posture. For complex cases, we may recommend escalation to a human reviewer.",
    refs: [
      { label: "How GAFAIG Works", href: "/how-gafaig-works", type: "page" as const },
      { label: "Standards", href: "/standards", type: "page" as const },
      { label: "Policy Index", href: "/policy", type: "page" as const }
    ]
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'GAFAIG Ask API is running. Send a POST with { "question": "..." }.'
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as AskRequest;
  const rawQ = typeof body.question === "string" ? body.question : "";
  const question = normalize(rawQ);

  if (!question || question.length < 3) {
    return NextResponse.json(
      {
        ok: false,
        received: false,
        error: "Missing required field: question (string)."
      },
      { status: 400 }
    );
  }

  const requestId = makeId();
  const flags = detectFlags(question);
  const routed = answerRouter(question);

  const shouldEscalate =
    flags.safetyCritical || flags.defamationOrAccusation || flags.personalData || flags.legalOrRegulatoryAdvice;

  const response: AskResponse = {
    ok: true,
    received: true,
    requestId,
    question,
    answer: {
      summary: routed.summary,
      directAnswer: routed.directAnswer,
      references: [...routed.refs, ...baseReferences()].slice(0, 10),
      citations: [
        {
          source: "GAFAIG internal corpus (placeholder)",
          note: "Citations will be added when GAFAIG connects standards/policies to a retrieval layer."
        }
      ],
      escalation: shouldEscalate
        ? {
            shouldEscalate: true,
            reason:
              "This question touches an area that requires careful handling (legal/safety/personal data/accusations).",
            contactPath: "/contact"
          }
        : { shouldEscalate: false },
      policyFlags: flags
    }
  };

  return NextResponse.json(response);
}
