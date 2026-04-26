MASTER_STATE.md

Last Updated: 2026-04-26

PURPOSE

This document defines the complete, canonical system state of GAFAIG (Global Authority for AI Governance). It is the single source of truth for what exists, what is working, what is broken, and what must happen next. This file must always reflect reality across Snowflake, VS Code, API, SDK, and deployed production.

GAFAIG is the world’s first searchable AI governance registry. It verifies that human oversight in AI systems is real, functioning, and independently verifiable, and publishes certified outcomes as cryptographically verifiable public records.

SYSTEM DEFINITION

GAFAIG is a deterministic governance verification system composed of:

Snowflake (execution + truth)
API (projection + signing)
SDK / Widgets (distribution layer)
UI (presentation layer)
Public registry (trust surface)

All certification truth originates in Snowflake.

NON-NEGOTIABLE RULES
Snowflake is the ONLY source of truth
No computation of score, certification, lifecycle, or eligibility in API/UI/SDK
No mutation of registry snapshots
No parallel trust systems

CRITICAL (PHASE 6.4 ADDITION):

Verification MUST use proof.messageString only
Verification MUST NOT use parsed JSON fields
Verification MUST NOT use reconstructed payloads
System MUST fail closed on any verification failure

All IDs originate in Snowflake and pass through unchanged:

APPLICATION_ID
CASE_ID
REGISTRY_ID
FINDING_ID
EVIDENCE_ID
EVENT_ID
REGISTRY_SNAPSHOT_ID

Violation of these rules = system corruption

GLOBAL TRUST INVARIANTS (SYSTEM STATE LOCK)
VERIFY API IS THE PROTOCOL CONTRACT
/api/verify is the canonical verification interface
MESSAGESTRING IS THE ONLY VERIFICATION INPUT
Signature validation MUST use proof.messageString exactly
NEVER VERIFY FROM JSON
Verification must NEVER use parsed JSON fields or reconstructed payloads
DETERMINISTIC PAYLOAD GUARANTEE
Field order MUST remain stable across:
Snowflake → API → messageString → signature
SIGNATURE VS LIFECYCLE SEPARATION
Signature = authenticity
Lifecycle = current trust state
FAIL-CLOSED SYSTEM
ANY failure → NOT TRUSTED
WIDGETS MUST FAIL CLOSED
Widgets MUST display INVALID / UNVERIFIED when verification fails
CANONICAL FLOW

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEW
→ API
→ SDK/UI

CURRENT PHASE

Phase 6.4 — Trust Surface Hardening (VERIFY COMPLETE)

System has transitioned from:
“Certification as a simple status”

To:
“Certification as a structured, verifiable public record”

And now to:
“Certification as a cryptographically verifiable protocol”

WHAT IS COMPLETE
SNOWFLAKE

✔ Core tables established
✔ Canonical workflow chain complete
✔ Deterministic scoring engine working
✔ Decision layer working
✔ Registry snapshot system working

✔ CORE.V_REGISTRY_PUBLIC updated (Phase 6)

Includes:

RECORD_TYPE
RECORD_NAME
VISIBILITY_STATUS
VERIFICATION_ELIGIBLE
BADGE_ELIGIBLE
LIFECYCLE_STATUS
Full certification fields

✔ Expired records remain visible
✔ Lifecycle computed in Snowflake
✔ Eligibility computed in Snowflake

✔ Deterministic payload foundation established for messageString

API

✔ /api/verify/[registryId] exists
✔ Ed25519 signing working
✔ Public key endpoint working
✔ CORS enabled
✔ no-store caching implemented

✔ messageString contract enforced
✔ verification protocol established

✔ /api/registry working
✔ /api/badge exists

SDK

✔ public/sdk/gafaig.js created
✔ Version 1.2.0
✔ verify() working
✔ badge() working
✔ autoInit working

✔ Browser test successful:
gafaig.verify("GAFAIG-00363095")

✔ SDK aligned to verification protocol
✔ SDK does not compute trust

UI

✔ Homepage complete
✔ Mission page complete
✔ Framework page updated (Snowflake + NIST alignment)
✔ Developers page updated (SDK + verification positioning)
✔ Registry page working
✔ Verify page hardened (protocol-level)
✔ Explorer pages working

✔ Layout system normalized
✔ Footer updated with Snowflake execution messaging

✔ Verify page reflects:

messageString
signature
public key verification
failure states
CRYPTOGRAPHIC TRUST LAYER

✔ Ed25519 signing implemented
✔ Key ID: gafaig-ed25519-2026-01
✔ Public key endpoint live
✔ Signed payload contract defined

✔ messageString is canonical
✔ Signature generated from messageString only
✔ Verification externally reproducible

WHAT IS BROKEN OR INCOMPLETE
🔴 SNOWFLAKE RUN ORDER

Files:

12_TABLES_PARTICIPANTS.sql
15_TABLES_EVENTS.sql

Status:

Previously errored
Must be fixed before full rebuild
🔴 BADGE SYSTEM

Current state:

Static assets incomplete
Eligibility not fully enforced

Issues:

Badge may misrepresent lifecycle
Rendering not fully fail-safe
🔴 TYPES + QUERY LAYER

Files:

types/registry.ts
lib/queries/registry.ts

Status:

Require strict alignment verification

Impact:

Potential drift risk if not locked
WHAT WE ARE DOING NEXT
STEP 0 (MANDATORY)

Fix Snowflake run-order files:

12_TABLES_PARTICIPANTS.sql
15_TABLES_EVENTS.sql
STEP 1

Lock API + query layer alignment

Goal:

Exact pass-through from Snowflake
Zero transformation of trust logic
STEP 2

Finalize badge system

Goal:

Lifecycle-aware rendering
Eligibility enforcement
No trust misrepresentation
STEP 3

Finalize widget system

Goal:

Fail-closed behavior
messageString-based verification display
Full protocol alignment
STEP 4

System-wide validation

Goal:

Cross-layer consistency check
Snowflake → API → SDK → UI alignment
SYSTEM POSITIONING

GAFAIG is NOT:

a dashboard
a scoring tool
a rating system
a UI product

GAFAIG IS:

a verification system
a registry of public certification records
a cryptographic trust layer
a Snowflake-executed governance engine
CERTIFICATION MODEL

Approval:

Internal workflow state

Certification:

Public record

Verification:

Cryptographic validation of certification
RECORD MODEL (PHASE 6)

Certification attaches to a record.

Record types:

ORGANIZATION
AI_SYSTEM
PORTFOLIO
USE_CASE

Implication:

Certification is scoped
No over-claiming trust
LIFECYCLE MODEL

Defined in Snowflake:

active
expired
revoked

Must NOT be computed elsewhere

CRITICAL:
Signature proves authenticity
Lifecycle determines trust state

ELIGIBILITY MODEL

Defined in Snowflake:

verificationEligible
badgeEligible

Must NOT be computed elsewhere

TRUST MODEL

Trust is based on:

Snowflake public record
messageString
signature
public key verification

NOT based on:

UI
badges
widgets
SDK
DEPLOYMENT

GitHub:
GAF2026/gafaig

Vercel:
gafaig-vercel

Production:
https://www.gafaig.com

TEST RECORD

GAFAIG-00363095

TEST COMMAND

gafaig.verify("GAFAIG-00363095").then(console.log)

Expected:

verified: true
proof present
signature valid
CURRENT STATUS SUMMARY

✔ Core system architecture complete
✔ Snowflake execution layer complete
✔ Verification protocol complete
✔ SDK aligned
✔ UI trust surface complete

🔴 Snowflake run-order files need fix
🔴 Badge system finalization needed

FINAL STATE TARGET

GAFAIG becomes:

deterministic governance engine (Snowflake)
public registry of verifiable certification records
cryptographic verification protocol
developer platform (SDK + API)
enterprise-scale governance infrastructure

FINAL TRUTH

GAFAIG does not claim trust.

GAFAIG proves it.