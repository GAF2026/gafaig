MASTER_STATE.md

Last Updated: 2026-05-02

PURPOSE

This document defines the complete, canonical system state of GAFAIG (Global Authority for AI Governance). It is the single source of truth for what exists, what is working, what is broken, and what must happen next. This file must always reflect reality across Snowflake, VS Code, API, SDK, and deployed production.

This document also enforces phase separation between system build completion and distribution activation.

GAFAIG is the world’s first searchable AI governance registry. It verifies that human oversight in AI systems is implemented, operational, and producing real oversight outcomes, and publishes certified outcomes as cryptographically verifiable public records.

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

CRITICAL ADDITIONS:

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
Widgets MUST display INVALID / UNVERIFIED / UNAVAILABLE / EXPIRED / REVOKED when verification or lifecycle fails

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

Phase 8 — System Hardening + Validation + Explorer Restoration (IN PROGRESS)

System has transitioned from:

“Certification as a simple status”

To:

“Certification as a structured, verifiable public record”

And then to:

“Certification as a cryptographically verifiable protocol”

And then to:

“Certification as a deterministic, Snowflake-controlled private workflow with public cryptographic proof”

Now to:

“System-wide validation, contract lock, and external trust surface readiness”

STRATEGIC STATE UPDATE (CRITICAL)

GAFAIG is technically strong but not yet discoverable.

The system has achieved:

✔ Deterministic execution
✔ Cryptographic verification
✔ Public registry trust surface

However, GAFAIG currently lacks:

External visibility
Market awareness
Active organizational usage

This creates the current mismatch:

GAFAIG is “truth infrastructure”
The market responds to “visible value”

Therefore:

Distribution, narrative, and first pilot organizations are now recognized priorities

BUT:

These are NOT active execution tasks yet

They are gated behind full system completion

WHAT IS COMPLETE

SNOWFLAKE

✔ Core tables established
✔ Canonical workflow chain complete
✔ Deterministic scoring engine working
✔ Decision layer working
✔ Registry snapshot system working

✔ CORE.V_REGISTRY_PUBLIC updated and aligned to bounded validity model

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

✔ Application intake procedure created
✔ Case creation procedure working
✔ Evidence creation procedure working
✔ Finding creation procedure corrected to match canonical schema
✔ Finding ↔ Evidence linking procedures created

✔ Decision lifecycle hardened

✔ CORE.V_CASE_RENEWAL_STATUS fixed

✔ SP_PUBLISH_CASE_TO_REGISTRY_V3 aligned

✔ Registry append-only enforcement restored

✔ 99_RUN_CANONICAL_PIPELINE.sql created

API

✔ /api/verify working
✔ Ed25519 signing working
✔ Public key endpoint working
✔ CORS enabled
✔ messageString contract enforced

✔ /api/registry working
✔ /api/search working
✔ /api/badge working

✔ API remains pass-through

SDK

✔ SDK stable (v1.3.0)
✔ verify(), badge(), getPublicKey() working
✔ External validation working

UI

✔ Core pages built and aligned
✔ Registry working
✔ Verify working
✔ Certification + Apply pages created
✔ Admin workflows functional

✔ Homepage conversion layer updated (LOCAL ONLY)

CRITICAL:

Homepage update has NOT been deployed due to Explorer build failure

CRYPTOGRAPHIC TRUST LAYER

✔ Fully operational
✔ messageString canonical
✔ Signature validation reproducible
✔ External verification confirmed

WHAT IS BROKEN OR INCOMPLETE

🔴 SNOWFLAKE RUN ORDER
🔴 FINDINGS PIPELINE
🔴 EXPLORER QUERY CONTRACT (BLOCKING DEPLOYMENT)
🔴 BADGE LIFECYCLE ENFORCEMENT
🔴 TYPE / QUERY ALIGNMENT

WHAT WE ARE DOING NEXT

STEP 0 — Fix Snowflake run-order
STEP 1 — Fix findings pipeline
STEP 2 — Restore explorer (deployment blocker)
STEP 3 — Complete linking
STEP 4 — Activate scoring
STEP 5 — Harden badge
STEP 6 — Harden widget
STEP 7 — Validate system
STEP 8 — Run canonical pipeline

SYSTEM POSITIONING

GAFAIG is NOT:

a dashboard
a scoring tool
a rating system

GAFAIG IS:

a verification system
a registry
a cryptographic trust layer
a governance execution engine

TRUST MODEL

Trust is based on:

Snowflake record
messageString
signature
public key

NOT based on:

UI
badge
SDK
widget

DEPLOYMENT

GitHub: GAF2026/gafaig
Vercel: gafaig-vercel
Production: https://www.gafaig.com

CURRENT STATUS SUMMARY

✔ Core architecture complete
✔ Verification protocol complete
✔ SDK + UI aligned
✔ Private workflow mostly complete

🟡 Homepage conversion optimized (LOCAL ONLY)

🔴 Explorer blocks deployment
🔴 Findings pipeline incomplete
🔴 Run-order validation pending

DISTRIBUTION STATUS (LOCKED)

Distribution phase is DEFINED but NOT ACTIVE

Conditions required before activation:

✔ Explorer fully functional
✔ Full build completed
✔ Seeding expanded and stable
✔ UI polished
✔ Production deployment stable

ONLY AFTER THIS:

Distribution begins

FUTURE STATE (POST-BUILD)

GAFAIG will:

Acquire first pilot organizations
Publish real records
Establish visibility
Demonstrate value

Through:

Free certification pilots
Verification-first narrative
Public trust surface

FINAL STATE TARGET

GAFAIG becomes:

deterministic governance engine
public certification registry
cryptographic verification protocol
developer platform
global trust infrastructure

FINAL TRUTH

GAFAIG does not claim trust.

GAFAIG proves it.