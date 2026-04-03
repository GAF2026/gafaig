# GAFAIG — API ROUTE MAPPING
API Contract & Data Flow Reference
Last Updated: 2026-04-03

---

# PURPOSE

This document defines:

• all API routes  
• their data sources  
• their responsibilities  
• their constraints  

Use this as the **canonical API contract reference**.

---

# CORE PRINCIPLE

API layer is:

→ PASS-THROUGH ONLY

It MUST NOT:

• compute scores  
• determine certification  
• mutate registry data  
• duplicate Snowflake logic  

All outputs must originate from:

→ Snowflake views  
→ deterministic engine outputs  

---

# API ARCHITECTURE

Snowflake (truth)
→ Views
→ Query Layer (sfQuery)
→ API Route
→ JSON Response
→ UI / External Systems

---

# API ROUTES

---

## 1. REGISTRY LIST API

### Route
/api/registry

### Purpose
• list registry records  
• support filtering  
• support search  

---

### Data Source
CORE.V_REGISTRY_PUBLIC

---

### Query Behavior
• optional filters:
  - q (search)
  - country  

• uses LIKE matching  
• case-insensitive  

---

### Output
{
  records: [...]
}

---

### Notes
• no transformation of certification logic  
• direct projection of Snowflake data  

---

---

## 2. REGISTRY SEARCH API

### Route
/api/registry/search

### Purpose
• optimized search endpoint  

---

### Data Source
CORE.V_REGISTRY_PUBLIC_SEARCH

---

### Behavior
• full-text style search  
• normalized query field (q)  

---

### Output
{
  results: [...]
}

---

---

## 3. VERIFY API (CRITICAL)

### Route
/api/verify/[registryId]

---

### Purpose
• public verification of certification  
• returns record + proof  
• enables external validation  

---

### Data Source
CORE.V_REGISTRY_PUBLIC

---

### Input
registryId (path param)

---

### Output

{
  ok: boolean,
  verified: boolean,
  registryId: string,
  record: {
    registryId,
    entityName,
    entityType,
    country,
    applicationId,
    caseId,
    certificationStatus,
    certifiedTier,
    certifiedBand,
    decisionStatus,
    certifiedAt,
    validFrom,
    validTo
  },
  proof: {
    alg,
    kid,
    signature,
    signedAt,
    verificationKeyUrl,
    message,
    messageString
  }
}

---

### Certification Logic

verified = (CERTIFIED_AT != null)

DO NOT:
• rely on CERTIFICATION_STATUS field  
• compute logic outside Snowflake  

---

### Proof Generation

messageObject = deterministic payload

signature = sign(messageString)

---

### CORS

Enabled:
Access-Control-Allow-Origin: *

Allows:
• external widget usage  
• third-party verification  

---

### Errors

400 → missing registryId  
404 → not found  
500 → internal error  

---

---

## 4. BADGE API

### Route
/api/badge/[registryId]

---

### Purpose
• render certification badge  
• embeddable visual trust signal  

---

### Data Source
CORE.V_REGISTRY_PUBLIC

---

### Behavior
• fetch record  
• format badge  
• return image or structured response  

---

### Notes
• depends on certification fields  
• no logic duplication  

---

---

## 5. PUBLIC KEY ENDPOINT

### Route
/api/.well-known/gafaig-public-key

---

### Purpose
• expose verification key  
• allow external signature validation  

---

### Output
{
  alg,
  kid,
  publicKey
}

---

### Usage

External systems:

1. call verify API  
2. get proof  
3. fetch public key  
4. validate signature  

---

---

# INTERNAL ADMIN APIs

(Not publicly exposed)

---

## Applications
/api/admin/applications

---

## Verification Workflow

/api/admin/verification/[caseId]/evidence  
/api/admin/verification/[caseId]/findings  
/api/admin/verification/[caseId]/score  
/api/admin/verification/[caseId]/publish  
/api/admin/verification/[caseId]/decisions  

---

### Purpose

• drive internal workflow  
• feed Snowflake engine  

---

### Rules

• never exposed publicly  
• never used by UI public layer  

---

---

# QUERY LAYER CONNECTION

All API routes must use:

lib/snowflake.ts → sfQuery()

---

### Pattern

const rows = await sfQuery(`
  SELECT ...
  FROM CORE.V_REGISTRY_PUBLIC
  WHERE REGISTRY_ID = ?
`, [registryId]);

---

### DO NOT

• inline Snowflake connections  
• duplicate query logic  
• bypass query layer  

---

---

# TRUST INFRASTRUCTURE FLOW

External System:

Widget / Badge / QR / API Client

↓

/api/verify/[registryId]

↓

Snowflake (V_REGISTRY_PUBLIC)

↓

Signed Proof

↓

Public Key Validation

---

---

# API GUARANTEES

GAFAIG APIs guarantee:

• deterministic outputs  
• verifiable signatures  
• consistent structure  
• public trust compatibility  

---

---

# NON-NEGOTIABLE RULES

1. Snowflake is the source of truth  
2. API is pass-through only  
3. No business logic in API  
4. No mutation of registry data  
5. Certification derived from CERTIFIED_AT  
6. Proof must be deterministic  

---

---

# FAILURE HANDLING

API must:

• return structured errors  
• never crash runtime  
• support UI fallback  

---

---

# FUTURE API EXPANSION

Planned:

• system-level verification  
• batch verification  
• certification lifecycle endpoints  
• issuer endpoints  

---

---

# SUMMARY

The API layer is:

→ the bridge between Snowflake and the world  

It must remain:

• simple  
• deterministic  
• verifiable  
• stable  

Everything resolves back to:

→ the canonical registry record