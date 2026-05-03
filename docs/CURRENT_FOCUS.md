CURRENT_FOCUS.md

Last Updated: 2026-05-02

PURPOSE

This document also enforces phase gating between build completion and distribution activation.

Defines the exact execution focus for GAFAIG with zero ambiguity.

No theory.
No re-architecture.
No drift.

CURRENT SYSTEM POSITION

GAFAIG is in production build completion phase transitioning into distribution readiness.

✔ Snowflake canonical pipeline complete
✔ Registry snapshots working
✔ Verification + signature system working
✔ Phase 6 record model aligned (Snowflake → API → SDK → UI)
✔ Badge API working
✔ SDK working externally
✔ Verification modal working externally
✔ Production endpoints verified

✔ Phase 6.4 verification protocol fully enforced
✔ messageString contract enforced across all layers
✔ Verify endpoint acting as canonical protocol surface

✔ Phase 7 private workflow partially implemented
✔ Application intake → case creation working
✔ Evidence creation working (Snowflake-backed)
✔ Finding procedure corrected to canonical schema
✔ Finding API route updated
✔ Finding ↔ evidence procedures created

✔ Widget system aligned to contract (GAFAIGWidget.mount)
✔ Public key endpoint live
✔ Public key page live
✔ External widget rendering validated (off-domain test successful)

✔ /registry page working in production
✔ /registry/[registryId] detail page working
✔ /verify endpoint validated with signature + messageString
✔ Badge SVG rendering working

🟡 Homepage conversion layer updated locally (NOT yet deployed due to Explorer blocker)

🔴 IMMEDIATE BLOCKER (STILL VALID — DO NOT SKIP)

Fix Snowflake Run Order Failures

Files:

12_TABLES_PARTICIPANTS.sql
15_TABLES_EVENTS.sql

Why:

Break deterministic rebuilds
Risk silent data corruption

👉 MUST be fixed before any full rebuild.

🔴 CURRENT BLOCKER (ACTIVE)

Findings pipeline visibility issue

Symptoms:

Findings count = 0 in admin case overview

Possible causes:

UI still referencing legacy endpoint
POST failing silently
CaseId mismatch
State not refreshing

👉 This must be resolved before moving to scoring.

🔴 SECONDARY BLOCKER (ACTIVE — UPDATED)

Explorer page failure

Symptoms:

/explorer page shows:

"GAFAIG could not load Explorer records from the canonical public views."

Root cause:

lib/queries/explorer.ts contract drift
Missing exports (getExplorerData, getExplorerCountries, etc.)
Mismatch between UI expectations and query layer
Potential mismatch with CORE.V_REGISTRY_PUBLIC or AI systems view

Impact:

Explorer unavailable in production
Blocks deployment (Next.js build failure)
Breaks public trust surface completeness
Prevents homepage deployment

Required action:

Restore full explorer query contract
Ensure ALL required exports exist
Align types with UI pages
Ensure queries pull ONLY from canonical public views

CRITICAL:

Explorer must read ONLY from:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

No scoring
No private data

🔴 SECONDARY BLOCKER (STILL VALID)

SCORE dependency leaking into rebuild validation

Symptoms:

01_REBUILD_ENVIRONMENT_CANONICAL.sql fails with:

invalid identifier 'SCORE'

Root cause (likely):

CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY referencing SCORE or legacy scoring view

Required action:

Run:

SELECT GET_DDL('VIEW', 'GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY');

Then remove ANY reference to:

SCORE
V_CASE_SCORE_ENTERPRISE
V_PUBLIC_OVERSIGHT_SIGNAL

CRITICAL:

Public views must NEVER depend on score

Score is PRIVATE (Snowflake internal only)

🔑 CRITICAL RULE (LOCKED)

ID PARITY RULE

All IDs:

Generated ONLY in Snowflake
Never generated in API/UI/SDK
Passed through unchanged

Violation = system corruption.

🔐 GLOBAL TRUST INVARIANTS (LOCKED)

These MUST be enforced during all work:

Verification MUST use proof.messageString only
Verification MUST NOT use JSON fields
Verification MUST NOT reconstruct payloads
Field order MUST remain deterministic
Signature validates authenticity
Lifecycle defines trust state
ANY failure → NOT TRUSTED
Widgets MUST fail closed

🎯 PRIMARY EXECUTION TARGET

Phase 7 — Private Verification Workflow Completion
→ then Phase 8 — Trust Surface Hardening + Production Lock
→ then Distribution Activation (POST-BUILD ONLY)

EXECUTION PLAN (STRICT ORDER)
STEP 0 — FIX SNOWFLAKE RUN ORDER

Files:

12_TABLES_PARTICIPANTS.sql
15_TABLES_EVENTS.sql

Objective:

Restore deterministic rebuild capability

STEP 1 — FIX FINDINGS PIPELINE (CURRENT PRIORITY)

Files:

app/admin/verification/[caseId]/page.tsx
app/api/admin/verification/[caseId]/findings/route.ts
CORE.SP_CREATE_FINDING

Objective:

Ensure:

Finding inserts into Snowflake
API returns row
UI reflects count

STEP 2 — RESTORE EXPLORER (CRITICAL FOR DEPLOYMENT)

Files:

lib/queries/explorer.ts
app/api/explorer/route.ts
app/explorer/page.tsx
app/explorer/* subpages

Objective:

Restore full explorer functionality
Unblock Next.js build
Enable production deployment

STEP 3 — LINK FINDINGS ↔ EVIDENCE

Activate:

CORE.VERIFICATION_FINDING_EVIDENCE

STEP 4 — ACTIVATE SCORING PIPELINE

Files:

CORE.SP_SCORE_CASE_ENTERPRISE
CASE_SCORE_SNAPSHOTS

STEP 5 — COMPLETE BADGE HARDENING
STEP 6 — COMPLETE MODAL HARDENING
STEP 7 — COMPLETE SDK FAILURE HANDLING
STEP 8 — LOCK VERIFY API CONTRACT
STEP 9 — LOCK BADGE API CONTRACT
STEP 10 — COMPLETE WIDGET FAIL-SAFE UX
🧠 SYSTEM THINKING (LOCKED)

GAFAIG is:

a verification system
a registry of certified records
a cryptographic trust layer
a Snowflake execution engine

🔐 TRUST MODEL (LOCKED)

Trust comes from:

Snowflake record
messageString
signature
public key verification

NOT from:

UI
SDK
badge
widget

⚠️ DO NOT BREAK

No computation outside Snowflake
No lifecycle logic outside Snowflake
No certification logic outside Snowflake
No ID generation outside Snowflake
Do not modify signed payload structure
Do not change messageString format
Do not verify from JSON

🧪 TEST (MANDATORY)

Explorer:

/explorer loads without error
countries / organizations / systems pages load

CRITICAL:

Verification must use messageString only

🚀 DEPLOY FLOW (BLOCKED UNTIL EXPLORER FIX)

git add .
git commit -m "Homepage + Explorer fix"
git push origin main
vercel --prod

📍 CURRENT STATE SUMMARY

✔ Core system architecture complete
✔ Verification protocol complete
✔ SDK + UI aligned
✔ Homepage conversion optimized (local only)

🔴 Snowflake run-order fix still required
🔴 Findings pipeline bug (active)
🔴 Explorer broken (deployment blocker)
🔴 SCORE dependency leak (active risk)

🚫 DISTRIBUTION PLAN STATUS (NOT ACTIVE YET)

30-Day Execution Plan for onboarding first 5 organizations EXISTS
BUT is NOT ACTIVE

Activation condition:

✔ Explorer fully working
✔ Full platform build complete
✔ Seeding finalized and expanded
✔ Public trust surface stable
✔ Deployment fully working
✔ UI polished and production-ready

🚀 FUTURE PHASE (LOCKED — DO NOT START YET)

30-DAY EXECUTION PLAN (POST-BUILD)

Goal:

Get first 5 real organizations testing GAFAIG

Strategy:

Free pilot certification
One system per organization
Signed public record output

Channels:

LinkedIn
Cold outreach
Developer API exposure

Success Criteria:

3–5 organizations tested
3+ real registry records
1–2 public mentions
1 confirmed value signal

CRITICAL:

This phase ONLY begins after platform completion

🎯 NEXT FOCUS

Fix Explorer (deployment blocker)
Complete platform build
Finalize seed data
Polish UI
Stabilize system
Deploy homepage update

ONLY THEN:

Activate distribution

FINAL LINE

Do not start outreach.
Do not start promotion.

Finish the system.