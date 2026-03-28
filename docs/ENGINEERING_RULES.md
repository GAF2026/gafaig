# GAFAIG — ENGINEERING RULES
Non-Negotiable Development Constraints
Last Updated: 2026-03-27

---

# 🧠 PURPOSE

These rules define:

• how GAFAIG must be built  
• what is allowed vs forbidden  
• how to prevent architectural drift  

These rules are **strict and non-negotiable**.

---

# 🔒 RULE #1 — DO NOT RE-ARCHITECT

The architecture is COMPLETE.

You must NOT:

• redesign the system  
• introduce new pipelines  
• create alternate flows  
• bypass the canonical data flow  

---

# 🔄 RULE #2 — FOLLOW THE CANONICAL FLOW

ALL data MUST follow:

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ PUBLIC VIEWS  
→ API  
→ UI  

No shortcuts. No bypassing.

---

# ❄️ RULE #3 — SNOWFLAKE IS THE SOURCE OF TRUTH

ALL:

• scoring  
• certification  
• aggregation  
• joins  
• registry state  

MUST exist in Snowflake.

---

## ❌ FORBIDDEN

• computing scores in API  
• deriving certification in UI  
• joining data in frontend  
• patching missing data in code  

---

# 🔌 RULE #4 — API IS PASS-THROUGH ONLY

API must:

• call Snowflake  
• return results  

API must NOT:

• compute  
• transform  
• interpret governance logic  

---

# 🧱 RULE #5 — USE sfQuery ONLY (GOING FORWARD)

Canonical function:

sfQuery()

---

## ⚠️ CURRENT TEMPORARY STATE

Compatibility exports exist:

• executeQuery  
• snowflakeQuery  
• sfQueryResult  
• snowflakeCtx  

These are:

• temporary  
• allowed only for stability  

---

## 🚫 DO NOT

• introduce new wrappers  
• expand compatibility layer  
• write new code using legacy patterns  

---

# 🧩 RULE #6 — UI IS DISPLAY ONLY

UI must:

• render data  

UI must NOT:

• compute certification  
• derive tier/band  
• calculate scores  

---

# 📦 RULE #7 — REGISTRY IS IMMUTABLE

CORE.REGISTRY_SNAPSHOTS:

• append-only  
• never updated  
• never deleted  

---

## 🚫 DO NOT

• update registry rows  
• overwrite snapshots  
• mutate certification history  

---

# 🆔 RULE #8 — REGISTRY ID IS DETERMINISTIC

• same CASE → same REGISTRY_ID  
• never regenerate  
• never duplicate  

---

# ⚙️ RULE #9 — PUBLISH IS AUTHORITATIVE

Procedure:

SP_PUBLISH_CASE_TO_REGISTRY_V3  

Controls:

• certification creation  
• snapshot insertion  
• registry ID reuse  

---

## 🚫 DO NOT

• create alternative publish logic  
• manually insert registry rows  
• bypass publish procedure  

---

# 📂 RULE #10 — QUERY LAYER STRUCTURE

Preferred:

lib/queries/*  

---

## CURRENT STATE

• explorer pages use direct sfQuery  
• SQL duplication exists  

---

## FUTURE STATE

• shared query modules  
• no duplication  
• clean abstraction  

---

# ⚠️ RULE #11 — TEMPORARY PATTERNS MUST NOT SPREAD

Allowed temporarily:

• compatibility exports  
• readthrough registry layer  
• duplicated SQL  

---

## 🚫 DO NOT

• replicate these patterns  
• expand their usage  
• treat them as permanent  

---

# 🧪 RULE #12 — FIX ONLY WHAT IS BROKEN

Current phase:

Validation + stabilization  

---

## DO:

• fix runtime errors  
• fix missing data  
• fix broken queries  

---

## DO NOT:

• refactor working systems  
• introduce new abstractions  
• optimize prematurely  

---

# 🔍 RULE #13 — DEBUGGING APPROACH

Always debug in this order:

1. Snowflake (data exists?)  
2. View (returns row?)  
3. Query layer (correct call?)  
4. API (returns data?)  
5. UI (renders correctly?)  

---

# 🚫 RULE #14 — NO UI-LEVEL PATCHES

If data is wrong:

→ FIX IN SNOWFLAKE  

NOT:

→ patch in API  
→ patch in UI  

---

# 🔐 RULE #15 — AUTH IS SERVER-SIDE

Use:

• middleware.ts  
• requireAdmin()  

---

## DO NOT

• trust client-side auth  
• bypass session checks  

---

# 🚀 RULE #16 — DEPLOYMENT DISCIPLINE

Before deploy:

• npm run build must pass  
• no TypeScript errors  
• no missing imports  

---

## AFTER DEPLOY

• test routes  
• validate data  
• confirm registry integrity  

---

# 🔥 RULE #17 — NEVER BREAK THESE

• scoring engine  
• registry snapshot system  
• publish procedure  
• Snowflake views  
• canonical data flow  

---

# 🧠 RULE #18 — SYSTEM MINDSET

You are NOT:

• building a frontend app  
• experimenting with patterns  

You ARE:

• maintaining a governance infrastructure system  
• enforcing deterministic certification  

---

# ▶️ NEXT PHASE RULES

After validation:

• remove compatibility exports  
• consolidate queries  
• standardize on sfQuery  
• eliminate duplication  

---

# 🧠 FINAL PRINCIPLE

If unsure:

→ DO NOTHING  
→ ask  
→ verify against MASTER_STATE.md  

---

This system must remain:

✔ deterministic  
✔ auditable  
✔ immutable  
✔ Snowflake-driven  