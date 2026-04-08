# GAFAIG — ENGINEERING RULES
Canonical System Constraints & Non-Negotiable Principles
Last Updated: 2026-04-06

---

# OVERVIEW

These rules define how GAFAIG must be built, extended, and maintained.

They are **non-negotiable**.

Violating these rules will break:
• determinism  
• trust integrity  
• system architecture  

---

# CORE PRINCIPLE

Snowflake is the **only source of truth**.

---

# SYSTEM ARCHITECTURE (LOCKED)

GAFAIG is a two-layer system:

1. PRIVATE VERIFICATION ENGINE (Snowflake)
2. PUBLIC TRUST LAYER (Next.js + API + UI)

STRICT SEPARATION MUST BE MAINTAINED.

---

# RULE 1 — NO TRUST LOGIC OUTSIDE SNOWFLAKE

DO NOT:

• compute score in API  
• compute score in UI  
• derive certification in frontend  
• replicate scoring logic anywhere else  

ALL OF THE FOLLOWING MUST COME FROM SNOWFLAKE:

• FINAL_SCORE  
• TIER  
• BAND  
• DECISION_STATUS  
• VALIDITY  

---

# RULE 2 — APPEND-ONLY REGISTRY

CORE.REGISTRY_SNAPSHOTS:

• NEVER UPDATE  
• NEVER DELETE  
• ONLY INSERT  

Each publish creates a new immutable snapshot.

---

# RULE 3 — PUBLISH IS THE ONLY WRITE PATH

Certification must ONLY enter the public system through:

SP_PUBLISH_CASE_TO_REGISTRY

DO NOT:

• insert directly into REGISTRY_SNAPSHOTS  
• bypass stored procedures  

---

# RULE 4 — DETERMINISTIC SCORING

Scoring must be:

• deterministic  
• reproducible  
• input-driven  

Same inputs MUST produce same outputs.

NO:

• randomness  
• heuristics  
• UI influence  

---

# RULE 5 — API IS TRANSPORT ONLY

API routes:

• must NOT compute certification  
• must NOT modify trust state  
• must ONLY return data from Snowflake views  

VALID FLOW:

Snowflake → Query Layer → API → UI  

---

# RULE 6 — UI IS PRESENTATION ONLY

UI must:

• render API data  
• not derive certification  
• not manipulate trust fields  

DO NOT:

• calculate score in UI  
• infer certification  
• modify API outputs  

---

# RULE 7 — USE CANONICAL VIEWS ONLY

All public data must come from:

• V_REGISTRY_PUBLIC  
• V_REGISTRY_PUBLIC_SEARCH  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

DO NOT:

• query raw tables in API  
• reconstruct joins manually in UI  

---

# RULE 8 — QUERY LAYER IS REQUIRED

API routes must use:

lib/queries/*

DO NOT:

• embed raw SQL in API routes  
• bypass query abstraction  

---

# RULE 9 — PROOF MUST BE CRYPTOGRAPHIC

Verification must rely on:

• proof.messageString  
• proof.signature  
• public key  

DO NOT:

• rely on UI indicators  
• trust frontend state  
• fake verification  

---

# RULE 10 — PUBLIC KEY IS CANONICAL

Endpoint:

/api/.well-known/gafaig-public-key  

Must:

• be stable  
• match signing process  
• be externally usable  

---

# RULE 11 — NO SIDE EFFECTS IN READ PATHS

GET endpoints must:

• not write data  
• not trigger scoring  
• not mutate state  

---

# RULE 12 — VARIABLE BINDING (SNOWFLAKE)

Use:

:variable  

NOT:

${variable}  

---

# RULE 13 — JSON INSERT PATTERN

For VARIANT fields:

USE:

INSERT INTO table  
SELECT PARSE_JSON(?)  

DO NOT USE:

VALUES (PARSE_JSON(?))  

---

# RULE 14 — REGISTRY ID MANAGEMENT

REGISTRY_ID:

• must be stable across re-publish  
• must be reused if exists  
• must follow GAFAIG-<id> format  

---

# RULE 15 — NO DUPLICATE TRUST SOURCES

There must be ONLY ONE:

• scoring source  
• certification source  
• registry source  

DO NOT:

• create parallel systems  
• duplicate logic  

---

# RULE 16 — COMPONENT CONSISTENCY

UI must:

• use PublicButtonLink for all CTAs  
• avoid inline button styles  
• maintain consistent layout patterns  

---

# RULE 17 — NO ARCHITECTURAL DRIFT

DO NOT:

• re-architect working systems  
• change data flow  
• move logic between layers  

---

# RULE 18 — SEPARATION OF CONCERNS

Layer responsibilities:

Snowflake:
• computation  
• scoring  
• certification  

API:
• transport  
• orchestration  

UI:
• rendering  
• interaction  

---

# RULE 19 — TESTING FLOW

All changes must be validated through:

• /api/registry  
• /api/verify/[registryId]  
• /badge/[registryId]  
• /registry/[registryId]  
• widget preview  

---

# RULE 20 — TRUST OVER FEATURES

When in doubt:

Choose:
→ correctness  
→ determinism  
→ clarity  

Over:
→ speed  
→ shortcuts  
→ UI convenience  

---

# FINAL PRINCIPLE

If it affects:

• scoring  
• certification  
• registry  

It MUST be implemented in Snowflake.

---

# FINAL SUMMARY

GAFAIG is a:

• deterministic system  
• append-only registry  
• cryptographically verifiable trust layer  

These rules preserve:

• system integrity  
• external credibility  
• long-term scalability  

They must not be broken.