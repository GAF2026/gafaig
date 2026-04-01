# GAFAIG — API_ROUTE_MAPPING.md
API Contract + Route Mapping
Last Updated: 2026-03-31

---

# 🚨 SYSTEM RULE

APIs are:

• Thin
• Stateless
• Pass-through

APIs must NOT:

• Compute scores
• Modify certification logic
• Bypass Snowflake views
• Contain business logic

ALL APIs MUST FOLLOW:

Snowflake → View → Query Layer → API → UI

---

# 🌐 API OVERVIEW

GAFAIG APIs provide:

• Public registry access
• Certification verification
• Cryptographic proof
• Badge rendering

---

# 🔐 CORE VERIFICATION SYSTEM

## 1. VERIFY ENDPOINT

### Route

/api/verify/[registryId]

### File

app/api/verify/[registryId]/route.ts

---

### Purpose

Returns:

• Public certification record
• Cryptographically signed proof

---

### Data Source

CORE.V_REGISTRY_PUBLIC

---

### Request

GET /api/verify/{registryId}

---

### Response

```json
{
  "ok": true,
  "verified": true,
  "registryId": "GAFAIG-XXXX",
  "record": {
    "registryId": "...",
    "entityName": "...",
    "entityType": "...",
    "country": "...",
    "applicationId": "...",
    "caseId": "...",
    "certificationStatus": "...",
    "certifiedTier": "...",
    "certifiedBand": "...",
    "decisionStatus": "...",
    "certifiedAt": "...",
    "validFrom": "...",
    "validTo": "..."
  },
  "proof": {
    "alg": "Ed25519",
    "kid": "gafaig-ed25519-2026-01",
    "signature": "...",
    "signedAt": "...",
    "verificationKeyUrl": "/api/.well-known/gafaig-public-key",
    "message": { ... }
  }
}