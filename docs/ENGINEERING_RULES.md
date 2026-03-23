# GAFAIG — ENGINEERING RULES
Canonical Development Constraints
Last Updated: 2026-03-22

---

# PURPOSE

This document defines the **non-negotiable engineering rules** for GAFAIG.

These rules ensure:

• deterministic behavior  
• architectural integrity  
• safe AI-assisted development  
• zero system drift  

---

# CORE PRINCIPLE

GAFAIG is:

A deterministic governance engine + append-only registry

NOT:

• a dashboard  
• a mutable database  
• an analytics tool  

---

# GOLDEN RULE

ALL DATA MUST FLOW:

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ AI SYSTEMS VIEW  
→ UI  

No exceptions.

---

# IMMUTABILITY RULE

The system is append-only.

• REGISTRY_SNAPSHOTS is immutable  
• SCORE_SNAPSHOTS are immutable  
• No updates to historical rows  

Allowed:

• inserting new snapshots  
• deriving latest state via views  

Not allowed:

• updating prior records  
• overwriting certification history  

---

# SOURCE OF TRUTH RULE

Never use tables directly in the UI.

Always use:

• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

Views define the contract.

---

# CERTIFICATION RULE

The ONLY valid certification fields are:

CERTIFIED_SCORE  
CERTIFIED_TIER  
CERTIFIED_BAND  
CERTIFIED_AT  
DECISION_STATUS  
RENEWAL_STATUS  

These must:

• originate from REGISTRY_SNAPSHOTS  
• flow through V_REGISTRY_LATEST_APPROVED  
• be exposed via V_REGISTRY_AI_SYSTEMS_PUBLIC  
• be consumed by frontend  

---

# PROHIBITED PATTERNS

DO NOT:

• compute certification in frontend  
• derive certification from SCORE/TIER/BAND  
• bypass canonical views  
• join directly to REGISTRY_SNAPSHOTS in UI  
• use APPLICATIONS as a source of truth  

---

# VIEW CONTRACT RULE

Views are APIs.

Once stabilized:

• column names must not change  
• semantics must not change  
• downstream consumers depend on them  

Changes must be:

• additive only  
• backward compatible  

---

# PROCEDURE RULE

Procedures must:

• be idempotent where possible  
• never depend on mutable state  
• operate only on canonical views/tables  
• not reference non-existent columns (e.g., UPDATED_AT issues)  

---

# QUERY LAYER RULE

Next.js query layer must:

• only query canonical views  
• never contain business logic  
• never remap semantics incorrectly  

Correct pattern:

certifiedTier → r.CERTIFIED_TIER  

Incorrect pattern:

certifiedTier → r.TIER  

---

# UI RULE

Frontend must:

• display certified fields only  
• never infer certification  
• never calculate governance state  

UI is a renderer, not a processor.

---

# SNOWFLAKE WORKSHEET RULE

Worksheets are NOT reliable state.

They may retain:

• stale execution fragments  
• hidden compiled SQL  
• invalid column references  

Therefore:

• never trust a worksheet after heavy edits  
• always use clean execution blocks  
• recreate run scripts when debugging  

---

# EXECUTION SCRIPT RULE

Files like:

99_RUN_PIPELINE.sql  

Are:

• disposable  
• non-canonical  
• for manual testing only  

Do NOT:

• treat them as system logic  
• rely on them for correctness  

---

# AI DEVELOPMENT RULE

When using AI (ChatGPT):

ALWAYS:

• provide full file context  
• reference canonical views  
• avoid partial code patches  

NEVER:

• allow AI to re-architect system  
• accept schema changes without validation  
• introduce duplicate logic paths  

---

# CHANGE MANAGEMENT RULE

All changes must:

• preserve pipeline flow  
• not break downstream views  
• be tested at the view level  
• be validated via registry output  

---

# DEBUGGING RULE

When errors occur:

1. Verify canonical view definitions  
2. Use GET_DDL to inspect live objects  
3. Test views directly  
4. Avoid debugging through UI first  
5. Avoid reusing corrupted worksheets  

---

# STABILITY PRINCIPLE

Once a component works:

LOCK IT.

Do not:

• refactor working views  
• rewrite procedures  
• optimize prematurely  

---

# PLATFORM INTEGRITY

GAFAIG must always remain:

• deterministic  
• append-only  
• globally consistent  
• externally verifiable  

---

# FINAL RULE

If unsure:

→ Follow the data flow  
→ Trust the views  
→ Do not invent logic  

---

END OF FILE