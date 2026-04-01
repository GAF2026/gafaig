# GAFAIG — MASTER_STATE.md
Last Updated: 2026-03-31

---

# 🚨 SYSTEM CONTINUATION INSTRUCTION

THIS IS A CONTINUATION SYSTEM.
DO NOT RESET CONTEXT.
DO NOT RE-ARCHITECT.

All future work must strictly follow this document.

---

# 🌍 PLATFORM DEFINITION

GAFAIG (Global Authority for AI Governance) is:

The world’s first deterministic AI governance verification engine + public registry of record.

It functions as:

• Trust infrastructure (not a dashboard)
• A certification authority for AI governance
• A globally verifiable registry of certified AI systems

Comparable to:

• Financial audit systems
• Certificate authorities (SSL/TLS)
• Regulatory registries
• International standards bodies

---

# 🧠 CORE ARCHITECTURE (LOCKED)

Two-layer system:

## 1. PRIVATE VERIFICATION ENGINE (Snowflake-native)

Handles:

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SCORE SNAPSHOT

Characteristics:

• Deterministic
• Reproducible
• Auditable
• Evidence remains private

---

## 2. PUBLIC REGISTRY (Next.js + Vercel)

Handles:

REGISTRY SNAPSHOT
→ PUBLIC VIEWS
→ API
→ UI

Characteristics:

• Append-only
• Controlled disclosure
• Public trust surface

---

# 🔒 CANONICAL DATA FLOW (NON-NEGOTIABLE)

ALL DATA MUST FOLLOW:

CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SNAPSHOT
→ REGISTRY
→ PUBLIC VIEW
→ API
→ UI

NO BYPASSES
NO DUPLICATION
NO LOGIC IN UI/API

---

# 🧱 SOURCE OF TRUTH

Snowflake is the ONLY source of truth.

Environment:

• Database: GAFAIG_DB
• Schema: CORE
• Warehouse: GAFAIG_WH
• Role: GAFAIG_APP_ROLE
• User: GAFAIG1

---

# 🧮 ENGINE OUTPUTS (LOCKED)

ONLY produced in Snowflake:

• FINAL_SCORE
• TIER
• BAND

NEVER computed in:

• API
• UI

---

# 📦 REGISTRY SYSTEM (APPEND-ONLY)

## CORE TABLE

CORE.REGISTRY_SNAPSHOTS

Properties:

• Immutable
• Append-only
• Each publish = new row
• No updates

---

## CANONICAL VIEW

CORE.V_REGISTRY_LATEST_APPROVED

Logic:

• ROW_NUMBER()
• Latest APPROVED_AT
• One row per CASE

---

## PUBLIC VIEW

CORE.V_REGISTRY_PUBLIC

Contains:

• REGISTRY_ID
• APPLICATION_ID
• CASE_ID
• ENTITY_NAME
• ENTITY_TYPE
• COUNTRY
• CERTIFIED_SCORE
• CERTIFIED_TIER
• CERTIFIED_BAND
• DECISION_STATUS
• CERTIFIED_AT
• VALID_FROM
• VALID_TO

---

## SEARCH VIEW

CORE.V_REGISTRY_PUBLIC_SEARCH

Provides:

• Normalized fields
• Searchable concatenation column

---

# 🧾 CERTIFICATION MODEL

Certification is defined by:

• CERTIFIED_SCORE
• CERTIFIED_TIER
• CERTIFIED_BAND
• CERTIFIED_AT
• VALID_FROM
• VALID_TO
• DECISION_STATUS

---

# 🔐 VERIFICATION LAYER (CURRENT STATE)

## ✅ IMPLEMENTED

### Endpoint:

/api/verify/[registryId]

Returns:

• ok
• verified
• registryId
• record (public certification data)
• proof object

---

## 🔐 CRYPTOGRAPHY (CURRENT STATE)

Ed25519 (asymmetric signing)

---

## 🔑 KEY INFRASTRUCTURE

### PRIVATE KEY (server only)

Environment variable:

GAFAIG_PRIVATE_KEY

Format:

PKCS8 PEM

---

### PUBLIC KEY ENDPOINT (LIVE)

Endpoint:

/api/.well-known/gafaig-public-key

Returns:

{
  "kid": string,
  "publicKeyPem": string
}

This is the global verification anchor.

---

## 🔏 SIGNING MODEL

Canonical message:

{
  registryId,
  entityName,
  entityType,
  country,
  applicationId,
  caseId,
  certificationStatus,
  certifiedScore,
  certifiedTier,
  certifiedBand,
  decisionStatus,
  certifiedAt,
  validFrom,
  validTo,
  signedAt
}

Signature:

Ed25519(message)

Encoding:

• UTF-8 JSON string
• Detached signature (hex or base64 depending on implementation)

---

# 🌐 PUBLIC SURFACES

## Registry

/registry
/registry/[registryId]

---

## Badge

/badge/[registryId]

Purpose:

• Visual certification surface
• Public trust artifact
• Embeddable

---

## Verification API

/api/verify/[registryId]

---

## Public Key

/api/.well-known/gafaig-public-key

---

## Explorer

/explorer
/explorer/countries
/explorer/organizations
/explorer/systems
/explorer/map

---

# 🧩 QUERY LAYER (ENFORCED)

All data access must go through:

lib/queries/*

NEVER:

• Direct SQL in routes
• Logic duplication

---

# ⚙️ API RULES (STRICT)

APIs are:

• Thin
• Stateless
• Pass-through

APIs must NOT:

• Compute scores
• Modify certification
• Contain business logic

---

# 🎯 CURRENT PHASE

Verification Infrastructure Complete → Moving to Trust UX + External Verification

---

# ✅ WHAT IS COMPLETE

• Full verification pipeline (case → registry)
• Deterministic scoring engine (Snowflake)
• Registry snapshot system (append-only)
• Public registry views (latest approved)
• Registry UI (production-ready)
• Badge surface (layout + scaling fixed)
• Verification API (working)
• Public key endpoint (working)
• Ed25519 signing (implemented)
• Explorer (Phase 1 complete)

---

# ⚠️ KNOWN GAPS (NEXT WORK)

## 1. Verification UX

• Add “Verify this certification” button on registry page
• Add verification explanation UI
• Add copyable verification endpoint
• Add developer instructions

---

## 2. External Verification Flow

• Example verification script (Node / Python)
• Public docs-style explanation
• Trust explanation layer on site

---

## 3. Key Management

• Multiple keys (kid rotation)
• Key versioning
• Graceful rotation support

---

## 4. Proof Standardization

• Formal GAFAIG proof schema
• Optional JWS compatibility layer

---

## 5. Explorer Phase 2

• Filters (country, tier, band)
• Aggregations
• Metrics
• Time-based trends

---

## 6. Registry Enrichment

• Country normalization
• Organization normalization
• AI system linking expansion

---

# 🚫 DO NOT DO

• Do NOT re-architect system
• Do NOT move logic out of Snowflake
• Do NOT compute scores in API/UI
• Do NOT mutate registry snapshots
• Do NOT expose private evidence

---

# 🧠 DESIGN PRINCIPLE

GAFAIG is:

NOT a product
NOT a dashboard

It is:

A global verification system for AI governance

---

# 🚀 NEXT CHAT INSTRUCTION

Resume with:

“Continue GAFAIG — Verification UX + External Verification Flow”

---

# END OF MASTER STATE