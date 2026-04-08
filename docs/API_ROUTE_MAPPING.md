# GAFAIG — API ROUTE MAPPING
Canonical API Surface Definition
Last Updated: 2026-04-06

---

# OVERVIEW

The GAFAIG API layer is a **thin transport layer** between:

Snowflake (source of truth)
→ Query layer (lib/queries)
→ API routes (Next.js)
→ UI / external systems

STRICT RULE:
→ API routes DO NOT compute certification, scoring, or trust
→ API routes ONLY return canonical data from Snowflake views

---

# CORE PUBLIC API

## 1. REGISTRY LIST

ROUTE:
GET /api/registry

SOURCE:
V_REGISTRY_PUBLIC

PURPOSE:
Return list of public certification records

QUERY PARAMS (optional):
q
country
registryId
caseId
applicationId
limit

RESPONSE:
{
  ok: true,
  rows: RegistryRow[],
  total: number,
  limit: number
}

---

## 2. REGISTRY SEARCH

ROUTE:
GET /api/registry/search

SOURCE:
V_REGISTRY_PUBLIC_SEARCH

PURPOSE:
Searchable registry endpoint

NOTES:
• uses normalized fields (*_norm)
• supports full-text style search via q column

---

## 3. REGISTRY DETAIL (BY FILTER)

ROUTE:
GET /api/registry?registryId=<id>

SOURCE:
V_REGISTRY_PUBLIC

PURPOSE:
Fetch specific registry record

NOTES:
• used by registry detail page
• must return canonical snapshot fields

---

## 4. VERIFICATION ENDPOINT (CRITICAL)

ROUTE:
GET /api/verify/[registryId]

SOURCE:
V_REGISTRY_PUBLIC (or equivalent canonical view)

PURPOSE:
Return certification + signed proof

RESPONSE:
{
  ok: true,
  registryId: string,
  verified: boolean,
  record: { ... },
  proof: {
    alg: string,
    signature: string,
    messageString: string,
    signedAt: string
  }
}

RULES:
• proof MUST be deterministic
• messageString MUST match signed payload exactly
• no UI-derived fields allowed

---

## 5. BADGE ENDPOINT

ROUTE:
GET /api/badge/[registryId]

PURPOSE:
Resolve certification badge image

INPUT:
registryId

OUTPUT:
• image (SVG or PNG)
• reflects certification status

NOTES:
• lightweight trust surface
• should map to certified tier/band

---

## 6. PUBLIC KEY ENDPOINT

ROUTE:
GET /api/.well-known/gafaig-public-key

PURPOSE:
Expose verification public key

OUTPUT:
{
  alg: "Ed25519",
  publicKey: string
}

USAGE:
• used to validate proof.signature
• enables independent verification

---

# ADMIN API (PRIVATE)

## 7. APPLICATION INTAKE

ROUTE:
POST /api/admin/applications

PURPOSE:
Create application / case

TARGET TABLE:
CORE.VERIFICATION_CASES

---

## 8. FINDINGS

ROUTE:
POST /api/admin/verification/findings

PURPOSE:
Insert findings

TARGET TABLE:
CORE.FINDINGS

---

## 9. EVIDENCE

ROUTE:
POST /api/admin/verification/evidence

PURPOSE:
Insert evidence

TARGET TABLE:
CORE.EVIDENCE

---

## 10. EVENTS

ROUTE:
POST /api/admin/verification/events

PURPOSE:
Insert verification events

TARGET TABLE:
CORE.VERIFICATION_EVENTS

NOTES:
• use PARSE_JSON(?) pattern
• avoid VALUES for VARIANT

---

## 11. SCORING

ROUTE:
POST /api/admin/verification/score

PURPOSE:
Trigger deterministic scoring

CALLS:
SP_SCORE_CASE_ENTERPRISE

OUTPUT:
• score snapshot written to table

---

## 12. DECISION

ROUTE:
POST /api/admin/verification/decisions

PURPOSE:
Insert certification decision

TARGET TABLE:
CORE.DECISIONS

---

## 13. PUBLISH

ROUTE:
POST /api/admin/verification/publish

PURPOSE:
Publish case to registry

CALLS:
SP_PUBLISH_CASE_TO_REGISTRY_V3

OUTPUT:
• new row in CORE.REGISTRY_SNAPSHOTS
• registryId assigned or reused

---

# QUERY LAYER (CRITICAL)

FILES:

lib/queries/registry.ts  
lib/queries/registry-ai-systems.ts  
lib/queries/explorer.ts  

RULES:

• API routes MUST use query layer
• Query layer MUST use Snowflake views
• No direct table joins in API layer

---

# RESPONSE CONTRACTS

## RegistryRow

Fields:
• registryId
• applicationId
• caseId
• entityName
• entityType
• country
• certifiedScore
• certifiedTier
• certifiedBand
• decisionStatus
• validFrom
• validTo
• certifiedAt
• lastActivityAt
• snapshotId
• modelVersion
• renewalStatus
• scoredAt
• isCurrentlyValid

---

## VerifyApiResponse

Fields:
• ok
• registryId
• verified
• record
• proof

---

# TRUST PRINCIPLES

• Snowflake is authoritative
• API is transport only
• Proof is cryptographic, not UI-based
• Registry is append-only
• Verification must be reproducible

---

# DO NOT

• compute score in API
• modify registry snapshots
• derive certification in UI
• bypass publish procedure
• introduce non-deterministic logic

---

# FINAL SUMMARY

The GAFAIG API layer:

• exposes canonical trust data  
• enables verification  
• supports integration  

It does NOT:

• perform evaluation  
• compute certification  
• store authoritative state  

All authority lives in Snowflake.