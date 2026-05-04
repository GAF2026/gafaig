# MASTER_STATE.md

Last Updated: 2026-05-04

PURPOSE

This document defines the complete, canonical system state of GAFAIG (Global Authority for AI Governance). It is the single source of truth for what exists, what is working, what is broken, and what must happen next.

This file must always reflect reality across:

Snowflake  
VS Code  
API  
SDK  
Widget  
UI  
Production deployment  

This document enforces phase separation between:

System build completion  
Validation and hardening  
Distribution activation  

GAFAIG is the world’s first searchable AI governance registry. It verifies that human oversight in AI systems is implemented, operational, and producing real oversight outcomes, and publishes certified outcomes as cryptographically verifiable public records.

---

SYSTEM DEFINITION

GAFAIG is a deterministic governance verification system composed of:

Snowflake (execution + truth)  
API (projection + signing)  
SDK / Widget (distribution layer)  
UI (presentation layer)  
Public registry (trust surface)  

All certification truth originates in Snowflake.

---

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

---

GLOBAL TRUST INVARIANTS (SYSTEM STATE LOCK)

VERIFY API IS THE PROTOCOL CONTRACT  

/api/verify is the canonical verification interface  

MESSAGESTRING IS THE ONLY VERIFICATION INPUT  

Signature validation MUST use proof.messageString exactly  

NEVER VERIFY FROM JSON  

Verification must NEVER use parsed JSON fields or reconstructed payloads  

DETERMINISTIC PAYLOAD GUARANTEE  

Field order MUST remain stable across:

Snowflake  
→ API  
→ messageString  
→ signature  

SIGNATURE VS LIFECYCLE SEPARATION  

Signature = authenticity  
Lifecycle = current trust state  

FAIL-CLOSED SYSTEM  

ANY failure → NOT TRUSTED  

WIDGETS MUST FAIL CLOSED  

Widgets MUST display INVALID / UNVERIFIED / UNAVAILABLE / EXPIRED / REVOKED when verification or lifecycle fails  

---

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

---

CURRENT PHASE

Phase 9 — Public Trust Layer Complete → Snowflake Validation Phase (ACTIVE)

System has evolved through:

Certification as status  
→ Certification as structured record  
→ Certification as public record  
→ Certification as cryptographic proof  
→ Certification as deterministic Snowflake-controlled system  
→ Certification as public trust infrastructure  

Current phase:

System-wide validation  
Contract lock  
Snowflake pipeline validation  
Explorer stabilization  
Pre-distribution readiness  

---

STRATEGIC STATE UPDATE (CRITICAL)

GAFAIG is technically strong but not yet discoverable.

The system has achieved:

✔ Deterministic execution  
✔ Cryptographic verification  
✔ Public registry trust surface  
✔ SDK + widget portability  
✔ Public proof system  

However, GAFAIG currently lacks:

External visibility  
Market awareness  
Active organizational usage  

This creates the mismatch:

GAFAIG is “truth infrastructure”  
The market responds to “visible value”  

Therefore:

Distribution, narrative, and pilot onboarding are priorities

BUT:

These are NOT active execution tasks yet  

They are gated behind full system validation and stability  

---

WHAT IS COMPLETE

SNOWFLAKE

✔ Core tables established  
✔ Canonical workflow chain complete  
✔ Deterministic scoring engine working  
✔ Decision layer working  
✔ Registry snapshot system working  

✔ CORE.V_REGISTRY_PUBLIC aligned to bounded validity model  

✔ Lifecycle logic moved fully into Snowflake  

✔ CORE.V_CASE_RENEWAL_STATUS fixed  

✔ SP_PUBLISH_CASE_TO_REGISTRY_V3 aligned  

✔ Registry append-only enforcement restored  

✔ Deterministic payload foundation established for messageString  

✔ Application intake procedure working  
✔ Case creation procedure working  
✔ Finding creation procedure aligned  
✔ Evidence creation procedure working  
✔ Finding ↔ Evidence linking procedures working  

✔ Decision lifecycle hardened  

✔ 99_RUN_CANONICAL_PIPELINE.sql created  

---

API

✔ /api/verify working  
✔ Ed25519 signing working  
✔ messageString contract enforced  
✔ Public key endpoint working  
✔ CORS enabled  

✔ /api/registry working  
✔ /api/search working  
✔ /api/badge working  
✔ /api/.well-known/gafaig-public-key working  

✔ API remains pass-through (no computation)  

---

SDK

✔ SDK stable (v1.x production)  
✔ verify() working  
✔ badge() working  
✔ getPublicKey() working  
✔ External verification validated  

---

WIDGET

✔ Widget operational  
✔ Browser-side verification working  
✔ Fail-closed behavior implemented  
✔ Terminology aligned  
✔ CTA standardized: “Verify This Record”  

---

UI (PUBLIC)

✔ Homepage aligned  
✔ Registry list aligned  
✔ Registry detail aligned  
✔ Verify tool aligned  
✔ Proof page aligned  
✔ Developers page aligned  

✔ No Application ID exposed publicly  
✔ No Case ID exposed publicly  

✔ Terminology standardized:

Public Certification Registry  
Public Certification Record  
Public Proof Record  
Proof JSON  

---

CRYPTOGRAPHIC TRUST LAYER

✔ Fully operational  
✔ messageString deterministic  
✔ Signature validation reproducible  
✔ External verification confirmed (Node + Python)  
✔ Tamper detection working  

---

DEPLOYMENT

✔ Vercel deployment working  
✔ Production domain active  
✔ Build passes  

---

WHAT IS BROKEN OR INCOMPLETE

🔴 12_TABLES_PARTICIPANTS.sql (run-order blocker)  
🔴 15_TABLES_EVENTS.sql (run-order blocker)  

🟡 Explorer query contract requires revalidation  
🟡 Explorer pages require revalidation  
🟡 Multi-case stress testing not complete  
🟡 Lifecycle edge-case testing not complete  
🟡 Performance optimization not started  

---

CRITICAL BLOCKERS (STEP ZERO)

Before ANY forward work:

Fix Snowflake run-order failures:

12_TABLES_PARTICIPANTS.sql  
15_TABLES_EVENTS.sql  

These:

Break deterministic rebuild  
Block validation  
Risk downstream corruption  

---

WHAT WE ARE DOING NEXT

STEP 0 — Fix Snowflake run-order  
STEP 1 — Validate APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS  
STEP 2 — Validate scoring pipeline  
STEP 3 — Validate decisions (VALID_FROM / VALID_TO)  
STEP 4 — Validate registry snapshots  
STEP 5 — Validate CORE.V_REGISTRY_PUBLIC  
STEP 6 — Validate CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
STEP 7 — Validate API consistency  
STEP 8 — Validate widget + SDK fail-closed behavior  
STEP 9 — Run canonical validation runner  

---

SYSTEM POSITIONING

GAFAIG is NOT:

a dashboard  
a scoring tool  
a rating system  
a UI product  

GAFAIG IS:

a verification system  
a registry  
a cryptographic trust protocol  
a governance execution engine  
a public certification infrastructure  

---

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

---

DISTRIBUTION STATUS (LOCKED)

Distribution phase is DEFINED but NOT ACTIVE  

Activation requires:

✔ Snowflake validation complete  
✔ Explorer stable  
✔ Multi-case dataset stable  
✔ UI polished  
✔ API stable under load  
✔ Widget/SDK validated at scale  

Only after these are complete:

Distribution begins  

---

POST-VALIDATION FUTURE PHASE

AI INTELLIGENCE LAYER

AI will be implemented as a separate Snowflake-backed recommendation system.

AI must:

Observe  
Learn  
Recommend  

AI must NOT:

Score  
Certify  
Publish  
Modify registry  
Override Snowflake outputs  

Canonical rule:

AI suggests  
Humans approve  
Snowflake decides  
Registry publishes  
Proof verifies  

---

FUTURE STATE

After validation:

GAFAIG will:

Acquire pilot organizations  
Publish real certification records  
Demonstrate verifiable trust  
Establish market visibility  

---

FINAL STATE TARGET

GAFAIG becomes:

Deterministic governance engine  
Public certification registry  
Cryptographic verification protocol  
Developer trust platform  
Global AI governance infrastructure  

---

FINAL TRUTH

GAFAIG does not claim trust.

GAFAIG proves it.

END OF FILE