CURRENT_FOCUS.md

Last Updated: 2026-04-30

PURPOSE

Defines the exact execution focus for GAFAIG with zero ambiguity.

No theory.
No re-architecture.
No drift.

CURRENT SYSTEM POSITION

GAFAIG is in production trust distribution phase transitioning into private workflow completion.

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

🔴 SECONDARY BLOCKER (ADDED — DO NOT IGNORE)

SCORE dependency leaking into rebuild validation

Symptoms:

01_REBUILD_ENVIRONMENT_CANONICAL.sql fails with:

invalid identifier 'SCORE'

Root cause (likely):

CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY referencing SCORE or legacy scoring view

Required action:

Run:

SELECT GET_DDL('VIEW', 'GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY');

Then:

Remove ANY reference to:

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

Must:

verify DB insert
verify API response
verify correct endpoint usage

STEP 2 — LINK FINDINGS ↔ EVIDENCE

Files:

28_PROCEDURES_FINDING_EVIDENCE.sql
app/api/admin/verification/finding-evidence/route.ts

Objective:

Activate:

CORE.VERIFICATION_FINDING_EVIDENCE

Must:

use Snowflake procedures only
no JSON storage

STEP 3 — ACTIVATE SCORING PIPELINE

Files:

CORE.SP_SCORE_CASE_ENTERPRISE
CASE_SCORE_SNAPSHOTS

Objective:

Score must respond to:

Findings
Linked evidence

CRITICAL:

No scoring in API/UI

STEP 4 — BADGE HARDENING

File:

public/sdk/gafaig.js

Objective:

Badge must ALWAYS reflect:

lifecycleStatus
badgeEligible

Must:

degrade to "Unavailable" if invalid
never show Certified incorrectly
never imply trust without verification

CRITICAL ADDITION:

Badge must NEVER be treated as proof
Badge must always defer to verify endpoint

STEP 5 — MODAL HARDENING

File:

public/widget/gafaig-verify.js

Objective:

Modal must:

always load verify endpoint
never rely on badge data
fail safely if API fails

Add:

loading state
error state
fallback messaging

CRITICAL ADDITION:

Modal MUST display messageString-based verification
Modal MUST reflect signature validity explicitly

STEP 6 — SDK FAILURE HANDLING

File:

public/sdk/gafaig.js

Objective:

Handle:

network failure
invalid JSON
missing fields

Must:

never crash page
return safe error object

CRITICAL ADDITION:

SDK must NEVER verify using JSON fields
SDK must NEVER reconstruct payloads

STEP 7 — VERIFY API LOCK

File:

app/api/verify/[registryId]/route.ts

Objective:

Lock response contract

Must:

always return:

record (full Phase 6)
proof
messageString

Must NOT:

change field names
remove fields

CRITICAL ADDITION:

Verify API is the protocol contract
messageString must be deterministic
signature must be generated from messageString only

STEP 8 — BADGE API LOCK

File:

app/api/badge/[registryId]/route.ts

Objective:

Lock response contract

Must:

respect lifecycleStatus
respect badgeEligible

Must NOT:

guess status
override Snowflake truth

STEP 9 — WIDGET FAIL-SAFE UX

File:

public/widget/gafaig.js (or equivalent)

Objective:

If API fails:

Show:

"Verification unavailable"

NOT:

blank state
broken UI

CRITICAL ADDITION:

Widget MUST fail closed
Widget MUST display INVALID when verification fails

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

Test:

External page:

badge loads
modal opens
SDK returns JSON

Verify page:

signature valid
payload verified
messageString present

Admin:

Create finding → count increases
Create evidence → count increases
Link evidence → scoring changes

API:

/api/badge/{id}
/api/verify/{id}
/api/admin/verification/{caseId}/findings

CRITICAL:

Verification must use messageString only

🚀 DEPLOY FLOW

git add .
git commit -m "Phase 7/8: <description>"
git push origin main

📍 CURRENT STATE SUMMARY

✔ System aligned
✔ External trust working
✔ Production endpoints live
✔ Verification protocol enforced
✔ Private workflow mostly functional

🔴 Snowflake run-order fix still required
🔴 Findings pipeline bug (active)
🔴 SCORE dependency leak (new blocker)
🔴 Badge + widget final hardening pending

🎯 NEXT FOCUS:

Fix findings pipeline
Fix SCORE dependency in view
Restore deterministic rebuild
Activate linking
Trigger scoring
Harden trust surfaces
Lock contracts
Eliminate failure modes

FINAL LINE

Do not add features.
Do not redesign.

Stabilize and lock the system.