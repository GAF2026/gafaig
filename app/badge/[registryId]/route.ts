import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RegistryApiRow = {
  registryId?: string;
  applicationId?: string | null;
  caseId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  certifiedScore?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certificationStatus?: string | null;
  decisionStatus?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  certifiedAt?: string | null;
};

type RegistryApiResponse = {
  ok?: boolean;
  total?: number;
  rows?: RegistryApiRow[];
  error?: string;
};

type VerifyApiRecord = {
  registryId?: string;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  applicationId?: string | null;
  caseId?: string | null;
  certificationStatus?: string | null;
  certifiedScore?: number | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
};

type VerifyApiResponse = {
  ok?: boolean;
  verified?: boolean;
  registryId?: string;
  record?: VerifyApiRecord;
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function infoValue(values: Array<string | null | undefined>): string {
  for (const value of values) {
    const s = String(value ?? "").trim();
    if (s) return s;
  }
  return "—";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTierBand(tier?: string | null, band?: string | null): string {
  const safeTier = String(tier ?? "").trim();
  const safeBand = String(band ?? "").trim();
  if (safeTier && safeBand) return `${safeTier} · ${safeBand}`;
  if (safeTier) return safeTier;
  if (safeBand) return safeBand;
  return "—";
}

function htmlPage(input: {
  entityName: string;
  country: string;
  registryId: string;
  tierBand: string;
  validTo: string;
  verificationUrl: string;
  certifiedAt: string;
  status: string;
  decision: string;
  recordUrl: string;
  verificationProofUrl: string;
  proofJsonUrl: string;
  widgetPreviewUrl: string;
  badgePreviewUrl: string;
  registryUrl: string;
  accentClass: string;
}) {
  const entityName = escapeHtml(input.entityName);
  const country = escapeHtml(input.country);
  const registryId = escapeHtml(input.registryId);
  const tierBand = escapeHtml(input.tierBand);
  const validTo = escapeHtml(input.validTo);
  const verificationUrl = escapeHtml(input.verificationUrl);
  const certifiedAt = escapeHtml(input.certifiedAt);
  const status = escapeHtml(input.status);
  const decision = escapeHtml(input.decision);
  const recordUrl = escapeHtml(input.recordUrl);
  const verificationProofUrl = escapeHtml(input.verificationProofUrl);
  const proofJsonUrl = escapeHtml(input.proofJsonUrl);
  const widgetPreviewUrl = escapeHtml(input.widgetPreviewUrl);
  const badgePreviewUrl = escapeHtml(input.badgePreviewUrl);
  const registryUrl = escapeHtml(input.registryUrl);
  const accentClass = input.accentClass;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${entityName} — GAFAIG Badge</title>
<style>
  :root{
    color-scheme: light;
    --bg:#f5f5f3;
    --card:#ffffff;
    --line:rgba(0,0,0,0.10);
    --text:#0b0b0c;
    --muted:rgba(11,11,12,0.62);
    --muted-2:rgba(11,11,12,0.42);
    --shadow:0 14px 40px rgba(0,0,0,0.06);
    --blue-bg:#eef4ff;
    --blue-text:#2457d6;
    --blue-line:#c9d9ff;
    --green-bg:#e9f8ef;
    --green-text:#138a52;
    --green-line:#9fe0bb;
    --navy:#071a49;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  body{padding:32px}
  .shell{max-width:1280px;margin:0 auto}
  .card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:32px;
    box-shadow:var(--shadow);
    overflow:hidden;
  }
  .topbar{
    height:10px;
    background:${accentClass === "warning" ? "#1d4ed8" : "#0f9d58"};
  }
  .content{padding:34px 38px 28px}
  .eyebrow{
    font-size:12px;
    font-weight:700;
    letter-spacing:.28em;
    text-transform:uppercase;
    color:#61708e;
  }
  .header{
    display:grid;
    grid-template-columns:minmax(0,1fr) 160px;
    gap:28px;
    align-items:start;
    margin-top:18px;
  }
  .chips{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    margin-bottom:18px;
  }
  .chip{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    border-radius:999px;
    padding:11px 20px;
    font-size:14px;
    font-weight:800;
    letter-spacing:.12em;
    text-transform:uppercase;
    border:1px solid var(--line);
    line-height:1;
    white-space:nowrap;
  }
  .chip.green{background:var(--green-bg);color:var(--green-text);border-color:var(--green-line)}
  .chip.blue{background:var(--blue-bg);color:var(--blue-text);border-color:var(--blue-line)}
  .title{
    margin:0;
    font-size:72px;
    line-height:1.02;
    letter-spacing:-.04em;
    font-weight:700;
    color:#0c1838;
  }
  .subtitle{
    margin:22px 0 0;
    font-size:22px;
    line-height:1.6;
    color:#31435f;
    max-width:860px;
  }
  .markWrap{
    display:flex;
    align-items:flex-start;
    justify-content:flex-end;
  }
  .mark{
    width:154px;
    height:154px;
    border-radius:999px;
    background:#d8f3e2;
    border:6px solid #91dfb2;
    display:flex;
    align-items:center;
    justify-content:center;
    margin-top:6px;
  }
  .markInner{
    width:104px;
    height:104px;
    border-radius:999px;
    background:#b7e9cb;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .mark svg{width:54px;height:54px;color:#0f9d58}
  .metrics{
    display:grid;
    grid-template-columns:2fr 1.2fr 1.2fr .95fr;
    gap:18px;
    margin-top:40px;
  }
  .metric{
    min-height:124px;
    border:1px solid var(--line);
    border-radius:24px;
    background:#fff;
    padding:20px 22px;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
  }
  .metric.highlight{
    background:#c9eed5;
    border-color:#91dfb2;
  }
  .metricLabel{
    font-size:12px;
    font-weight:700;
    letter-spacing:.20em;
    text-transform:uppercase;
    color:#61708e;
  }
  .metricValue{
    margin-top:18px;
    font-size:25px;
    line-height:1.22;
    font-weight:700;
    color:#0c1838;
    word-break:break-word;
  }
  .metricValue.compact{
    font-size:19px;
    line-height:1.35;
  }
  .verifyPanel{
    margin-top:24px;
    background:var(--navy);
    border-radius:26px;
    padding:24px 30px 22px;
    color:#fff;
  }
  .verifyLabel{
    font-size:12px;
    font-weight:700;
    letter-spacing:.20em;
    text-transform:uppercase;
    color:rgba(255,255,255,.62);
  }
  .verifyValue{
    margin-top:14px;
    font-size:21px;
    line-height:1.5;
    font-weight:700;
    word-break:break-all;
  }
  .footer{
    padding:18px 10px 0;
    font-size:14px;
    line-height:1.6;
    color:#64748b;
    font-weight:600;
  }
  .actions{
    margin-top:18px;
    display:flex;
    flex-wrap:wrap;
    gap:12px;
  }
  .button{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-height:48px;
    padding:0 20px;
    border-radius:999px;
    border:1px solid var(--line);
    text-decoration:none;
    font-size:15px;
    font-weight:700;
    color:#0b0b0c;
    background:#fff;
  }
  .button.primary{
    background:#0b0b0c;
    color:#fff;
    border-color:#0b0b0c;
  }
  .button:hover{filter:brightness(.98)}
  @media (max-width: 1120px){
    .title{font-size:58px}
    .metrics{grid-template-columns:1fr 1fr}
  }
  @media (max-width: 860px){
    body{padding:16px}
    .content{padding:24px 20px 20px}
    .header{grid-template-columns:1fr}
    .markWrap{justify-content:flex-start}
    .title{font-size:44px}
    .subtitle{font-size:18px}
    .metrics{grid-template-columns:1fr}
    .metric{min-height:auto}
    .verifyValue{font-size:16px}
  }
</style>
</head>
<body>
  <div class="shell">
    <div class="card">
      <div class="topbar"></div>
      <div class="content">
        <div class="eyebrow">GAFAIG Certification Badge</div>

        <div class="header">
          <div>
            <div class="chips">
              <span class="chip green">${status}</span>
              <span class="chip blue">${decision}</span>
            </div>

            <h1 class="title">${entityName}</h1>

            <p class="subtitle">
              Public certification record issued through the GAFAIG registry of record.
            </p>
          </div>

          <div class="markWrap">
            <div class="mark" aria-hidden="true">
              <div class="markInner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric">
            <div class="metricLabel">Registry ID</div>
            <div class="metricValue">${registryId}</div>
          </div>

          <div class="metric">
            <div class="metricLabel">Country</div>
            <div class="metricValue">${country}</div>
          </div>

          <div class="metric">
            <div class="metricLabel">Tier / Band</div>
            <div class="metricValue compact">${tierBand}</div>
          </div>

          <div class="metric highlight">
            <div class="metricLabel">Valid To</div>
            <div class="metricValue compact">${validTo}</div>
          </div>
        </div>

        <div class="verifyPanel">
          <div class="verifyLabel">Verification Endpoint</div>
          <div class="verifyValue">${verificationUrl}</div>
        </div>

        <div class="actions">
          <a class="button primary" href="${recordUrl}">Open Certification Record</a>
          <a class="button" href="${verificationProofUrl}">Open Verification Proof</a>
          <a class="button" href="${proofJsonUrl}">Proof JSON</a>
          <a class="button" href="${widgetPreviewUrl}">Open Widget Preview</a>
          <a class="button" href="${badgePreviewUrl}">Open Badge Preview</a>
          <a class="button" href="${registryUrl}">Browse Registry</a>
        </div>

        <div class="footer">
          Issued ${certifiedAt} • Public trust surface only • Private review materials not disclosed
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(
  request: NextRequest,
  context: { params: { registryId: string } }
) {
  const registryId = String(context.params.registryId || "").trim();
  if (!registryId) {
    return new NextResponse("Missing registryId", { status: 400 });
  }

  const origin = new URL(request.url).origin;

  const [registryRes, verifyRes] = await Promise.all([
    fetch(`${origin}/api/registry?registryId=${encodeURIComponent(registryId)}`, {
      cache: "no-store",
    }).catch(() => null),
    fetch(`${origin}/api/verify/${encodeURIComponent(registryId)}`, {
      cache: "no-store",
    }).catch(() => null),
  ]);

  const registryData: RegistryApiResponse | null = registryRes
    ? ((await registryRes.json()) as RegistryApiResponse)
    : null;

  const verifyData: VerifyApiResponse | null = verifyRes
    ? ((await verifyRes.json()) as VerifyApiResponse)
    : null;

  const row = registryData?.rows?.[0] ?? null;
  const record = verifyData?.record ?? null;

  if (!row && !record) {
    return new NextResponse("Badge not found", { status: 404 });
  }

  const entityName = infoValue([record?.entityName, row?.entityName]);
  const country = infoValue([record?.country, row?.country]);
  const decision = infoValue([record?.decisionStatus, row?.decisionStatus]);
  const status = infoValue([
    record?.certificationStatus,
    row?.certificationStatus,
  ]);
  const certifiedTier = infoValue([record?.certifiedTier, row?.certifiedTier]);
  const certifiedBand = infoValue([record?.certifiedBand, row?.certifiedBand]);
  const validTo = formatDate(record?.validTo ?? row?.validTo ?? null);
  const certifiedAt = formatDate(record?.certifiedAt ?? row?.certifiedAt ?? null);
  const tierBand = formatTierBand(
    certifiedTier === "—" ? null : certifiedTier,
    certifiedBand === "—" ? null : certifiedBand
  );

  const html = htmlPage({
    entityName,
    country,
    registryId,
    tierBand,
    validTo,
    verificationUrl: `${origin}/api/verify/${encodeURIComponent(registryId)}`,
    certifiedAt,
    status,
    decision,
    recordUrl: `${origin}/registry/${encodeURIComponent(registryId)}`,
    verificationProofUrl: `${origin}/verify/${encodeURIComponent(registryId)}`,
    proofJsonUrl: `${origin}/api/verify/${encodeURIComponent(registryId)}`,
    widgetPreviewUrl: `${origin}/widget-preview/${encodeURIComponent(registryId)}`,
    badgePreviewUrl: `${origin}/badge-preview/${encodeURIComponent(registryId)}`,
    registryUrl: `${origin}/registry`,
    accentClass: "success",
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}