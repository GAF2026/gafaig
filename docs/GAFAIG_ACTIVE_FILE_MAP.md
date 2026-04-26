# GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-04-26

## PURPOSE
This file maps the currently active GAFAIG files across Snowflake, VS Code, APIs, UI, SDK, and deployment.

GAFAIG = Global Authority for AI Governance  
GAFAIG is the world’s first searchable AI governance registry.

The platform verifies that human oversight in AI systems is real, functioning, and independently verifiable, and publishes certified outcomes as publicly verifiable records.

This file is canonical system context and must remain aligned with:
- Snowflake (source of truth)
- VS Code files (execution layer)
- Production deployment (Vercel)

---

## NON-NEGOTIABLE ENGINEERING RULES

Snowflake is the source of truth.

Do NOT:
- Compute governance score, certification, lifecycle, eligibility, or trust in API/UI/SDK
- Generate IDs outside Snowflake
- Mutate published registry snapshots
- Create parallel trust paths
- Reconstruct verification payloads

CRITICAL (PHASE 6.4 HARDENING):
Do NOT:
- Verify using parsed JSON fields
- Verify using UI-rendered data
- Reconstruct messageString from proof.message
- Verify using any payload other than proof.messageString

All IDs originate in Snowflake and pass through unchanged:
- APPLICATION_ID
- CASE_ID
- REGISTRY_ID
- FINDING_ID
- EVIDENCE_ID
- EVENT_ID
- REGISTRY_SNAPSHOT_ID

CRITICAL RULE:
Verification MUST use `proof.messageString` exactly as returned.
Never reconstruct from JSON fields.
Never verify from UI-rendered data.
Never verify from parsed JSON objects.

CRITICAL ADDITION:
- messageString is the ONLY valid verification input
- proof.message is informational ONLY
- JSON fields are NOT valid verification inputs

Canonical flow:
APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEW → API → SDK/UI

Public surfaces expose:
- Certification outcome
- Lifecycle state
- Eligibility state
- Signed proof
- Public metadata

Private data NEVER exposed:
- Evidence
- Findings
- Reviewer notes
- Score / tier / band
- Internal decisions

---

## GLOBAL TRUST INVARIANTS (PHASE 6.4 — PROTOCOL RULES)

These rules apply across ALL layers (Snowflake, API, SDK, widget, UI):

1. VERIFY API IS THE PROTOCOL CONTRACT  
   `/api/verify` is the canonical external verification interface

2. MESSAGESTRING IS THE ONLY VERIFICATION INPUT  
   Signature validation MUST use `proof.messageString` exactly

3. NEVER VERIFY FROM JSON  
   Verification must NEVER use parsed JSON fields or reconstructed payloads

4. DETERMINISTIC PAYLOAD GUARANTEE  
   Field order MUST remain stable across:
   Snowflake → API → messageString → signature

5. SIGNATURE VS LIFECYCLE SEPARATION  
   Signature = authenticity  
   Lifecycle = current trust state

6. FAIL-CLOSED SYSTEM  
   ANY failure → NOT TRUSTED

7. WIDGETS MUST FAIL CLOSED  
   Widgets MUST display INVALID / UNVERIFIED when verification fails

---

## CURRENT PHASE

Phase 6.4 — Trust Surface Hardening (VERIFY COMPLETE)

Phase 6.3 Completed:
- /developers page upgraded to Stripe-level developer experience
- Versioned SDK + widget architecture clarified
- messageString rule surfaced in developer flow

Phase 6.4 Completed:
- /verify/[registryId] hardened to cryptographic verification surface
- messageString enforced as canonical payload (no reconstruction allowed)
- Signature validation clearly separated from UI rendering
- Public key surfaced and labeled as verification authority
- Failure states explicitly defined (DO NOT TRUST on failure)
- Lifecycle interpretation clarified (ACTIVE / EXPIRED / REVOKED)
- Trust chain fully visible:
  Registry → Verify → Signed Payload → Widget

---

## CORE REPOSITORY

GitHub: GAF2026/gafaig  
Local Path: C:\Users\drter\dev\gafaig  
Branch: main  
Vercel Project: gafaig-vercel  
Production: https://www.gafaig.com  
Local: http://localhost:3000  

---

## SNOWFLAKE ENVIRONMENT

ROLE: ACCOUNTADMIN  
WAREHOUSE: GAFAIG_WH  
DATABASE: GAFAIG_DB  
SCHEMA: CORE  

SQL context:
USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

---

## 🔴 CRITICAL SNOWFLAKE FILE PRIORITY

Fix BEFORE any rebuild:

- 12_TABLES_PARTICIPANTS.sql
- 15_TABLES_EVENTS.sql

Reason:
- Break canonical run order
- Block deterministic rebuilds
- Risk silent corruption

---

## ACTIVE SNOWFLAKE TABLES

- CORE.APPLICATIONS
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_EVENTS
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.DECISIONS
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS
- CORE.REGISTRY_ENTITIES

---

## ACTIVE SNOWFLAKE VIEWS

- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_GOVERNANCE_SCORE_CASE

IMPORTANT:

V_REGISTRY_PUBLIC is the ONLY public trust contract.

Includes:
- lifecycle
- eligibility
- certification outcome

Excludes:
- score / tier / band

Expired records remain visible.

CRITICAL ADDITION:
- This view must produce deterministic output used to generate messageString
- Any field order change may break verification

---

## ACTIVE PROCEDURES

- CORE.SP_CREATE_CASE_FROM_APPLICATION
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

CRITICAL ADDITION:
- Publish output must remain stable for deterministic signing

---

## VS CODE STRUCTURE

- app/
- app/_components/
- app/api/
- components/
- components/registry/
- components/ui/
- lib/
- lib/queries/
- lib/crypto/
- types/
- public/
- public/widget/
- public/sdk/
- public/badges/
- docs/

---

## KEY PUBLIC PAGES

- app/page.tsx
- app/mission/page.tsx
- app/framework/page.tsx
- app/developers/page.tsx
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx
- app/verify/page.tsx
- app/verify/[registryId]/page.tsx
- app/explorer/*
- app/widget-preview/[registryId]/page.tsx

---

## TRUST SURFACE (FINAL STATE)

/developers
- Developer entry point
- Live API console
- Widget + modal + badge integration
- Versioned SDK enforcement
- messageString rule surfaced

/verify/[registryId]
- Cryptographic verification surface
- Signature validation (primary trust signal)
- Payload integrity validation
- Public key verification (Ed25519)
- Failure-state enforcement (invalid = DO NOT TRUST)
- Developer proof interface (messageString, signature, key)
- Canonical trust explanation (no ambiguity)
- Lifecycle-aware trust interpretation

---

## API ROUTES

- /api/registry
- /api/registry/search
- /api/verify/[registryId]
- /api/badge/[registryId]
- /api/.well-known/gafaig-public-key

---

## VERIFY API (CRITICAL)

Source: CORE.V_REGISTRY_PUBLIC

Must:
- Return signed proof (Ed25519)
- Include messageString
- Support CORS
- Use no-store cache
- Never compute trust

CRITICAL:
- messageString is the ONLY valid input for verification
- verify API is the canonical protocol contract

---

## SDK (VERSIONED SYSTEM)

Production stable:

- /sdk/gafaig.v1.js
- /widget/gafaig-widget.v1.js
- /widget/gafaig-verify.v1.js

Latest aliases (NOT stable):

- /sdk/gafaig.js
- /widget/gafaig-widget.js
- /widget/gafaig-verify.js

RULE:
Use versioned files for production integrations.

---

## WIDGET SYSTEM

Reads from /api/verify  
Displays trust signals  
Must NOT compute trust  
Must fail safely  

CRITICAL:
- Widget is a rendering layer ONLY
- Widget MUST fail closed
- Widget MUST display INVALID when verification fails

States:

- verified
- invalid
- unavailable
- expired
- revoked

---

## BADGE SYSTEM

Controlled by BADGE_ELIGIBLE  
Reflects lifecycle  
No scoring exposure  

States:

- certified
- expired
- revoked
- unavailable

---

## CERTIFICATION MODEL

Approval = internal  
Certification = public  

Certification = published + verifiable record

---

## LIFECYCLE MODEL

- active
- expired
- revoked

Origin: Snowflake only

CRITICAL:
Signature proves authenticity  
Lifecycle determines trust state  

---

## ELIGIBILITY MODEL

VERIFICATION_ELIGIBLE → controls verify  
BADGE_ELIGIBLE → controls badge  

Never computed outside Snowflake.

---

## DOCUMENTATION FILES

- MASTER_STATE.md
- CURRENT_FOCUS.md
- ENGINEERING_RULES.md
- GAFAIG_ACTIVE_FILE_MAP.md
- GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
- GAFAIG_VS_CODE_File_Tree.md
- CANONICAL_RUN_ORDER.md
- PAGE_LAYOUT_SYSTEM.md
- PUBLIC_PAGE_TEMPLATE_MAP.md
- PUBLIC_PAGE_AUDIT.md
- VERIFICATION_SIGNATURE_CONTRACT.md
- VERIFIED_DEFINITION.md
- VERSIONING.md

---

## TEST ID

GAFAIG-00363095

---

## TEST COMMANDS

gafaig.version  
gafaig.verify("GAFAIG-00363095").then(console.log)

---

## NEXT ACTION

Phase 7 — Full System Alignment

- Widget hardening (must match verify page trust model exactly)
- Badge lifecycle enforcement validation
- Registry page trust surface consistency
- Multi-case seed validation refresh
- External verification documentation (SDK-level)

---

## END STATE

GAFAIG becomes:

- Deterministic Snowflake execution system
- Public registry of verifiable certification records
- Verification layer for governance frameworks (NIST AI RMF)
- Cryptographic trust infrastructure
- Developer platform (SDK, API, widget, badge)
- Enterprise-ready multi-record system