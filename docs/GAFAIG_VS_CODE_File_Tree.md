# GAFAIG — FULL VS CODE FILE TREE
Canonical Project Structure (Clean)
Last Updated: 2026-03-27

---

# 🧠 PURPOSE

This is the clean, canonical file tree for the GAFAIG repository.

Use this to:

• understand structure  
• locate files quickly  
• avoid confusion in future chats  

---

# 📂 ROOT

gafaig/

---

## ⚙️ SYSTEM / CONFIG

├─ package.json  
├─ package-lock.json  
├─ next.config.js  
├─ tsconfig.json  
├─ .env.local  
├─ .gitignore  
├─ middleware.ts  

---

## 📂 APP (Next.js App Router)

├─ app/

---

### 🌐 PUBLIC PAGES

│  ├─ page.tsx  

---

### 📊 REGISTRY

│  ├─ registry/  
│  │  ├─ page.tsx  
│  │  ├─ [registryId]/  
│  │  │  └─ page.tsx  
│  │  ├─ ai-systems/  
│  │  │  ├─ page.tsx  
│  │  │  └─ [systemId]/  
│  │  │     └─ page.tsx  

---

### 🌍 EXPLORER

│  ├─ explorer/  
│  │  ├─ page.tsx  
│  │  ├─ countries/  
│  │  │  ├─ page.tsx  
│  │  │  └─ [country]/  
│  │  │     └─ page.tsx  
│  │  ├─ map/  
│  │  │  └─ page.tsx  
│  │  ├─ organizations/  
│  │  │  └─ page.tsx  
│  │  ├─ systems/  
│  │  │  └─ page.tsx  

---

### 🏢 ORGANIZATION DETAIL

│  ├─ organizations/  
│  │  └─ [registryId]/  
│  │     └─ page.tsx  

---

### 🔐 ADMIN

│  ├─ admin/  
│  │  ├─ login/  
│  │  │  └─ page.tsx  
│  │  ├─ applications/  
│  │  │  └─ page.tsx  
│  │  ├─ verification/  
│  │  │  ├─ [caseId]/  
│  │  │  │  ├─ findings/  
│  │  │  │  │  └─ page.tsx  
│  │  │  │  ├─ evidence/  
│  │  │  │  │  └─ page.tsx  
│  │  │  │  ├─ score/  
│  │  │  │  │  └─ page.tsx  
│  │  │  │  ├─ publish/  
│  │  │  │  │  └─ page.tsx  

---

### 🔌 API ROUTES

│  ├─ api/  

---

#### 🌐 PUBLIC API

│  │  ├─ registry/  
│  │  │  ├─ route.ts  
│  │  │  ├─ search/  
│  │  │  │  └─ route.ts  
│  │  │  ├─ [registryId]/  
│  │  │  │  └─ ai-systems/  
│  │  │  │     └─ route.ts  

│  │  ├─ badge/  
│  │  │  └─ [registryId]/  
│  │  │     └─ route.ts  

│  │  ├─ verify/  
│  │  │  └─ [registryId]/  
│  │  │     └─ route.ts  

---

#### 🔧 ADMIN API

│  │  ├─ admin/  
│  │  │  ├─ login/route.ts  
│  │  │  ├─ logout/route.ts  
│  │  │  ├─ status/route.ts  

│  │  │  ├─ verification/  
│  │  │  │  ├─ findings/route.ts  
│  │  │  │  ├─ events/route.ts  
│  │  │  │  ├─ decisions/route.ts  
│  │  │  │  ├─ [caseId]/  
│  │  │  │  │  └─ summaries/route.ts  

---

## 🧱 LIB (CORE LOGIC)

├─ lib/  

---

### ❄️ SNOWFLAKE

│  ├─ snowflake.ts  

Primary:

• sfQuery()

Temporary compatibility:

• executeQuery  
• snowflakeQuery  
• sfQueryResult  
• snowflakeCtx  

---

### 📂 QUERY LAYER

│  ├─ queries/  
│  │  ├─ registry.ts  

---

### 🔐 AUTH

│  ├─ auth/  
│  │  ├─ require.ts  
│  │  ├─ session.ts  
│  │  ├─ admin.ts  

---

### 🌐 HTTP HELPERS

│  ├─ http/  
│  │  ├─ json.ts  

---

## 🧩 COMPONENTS

├─ app/components/  

Examples:

• PublicPageHero.tsx  
• UI cards / layout components  

---

## 📄 DOCS

├─ docs/  

• MASTER_STATE.md  
• CURRENT_FOCUS.md  
• ENGINEERING_RULES.md  
• PROJECT_INDEX.md  
• CHANGELOG.md  
• API_ROUTE_MAPPING.md  
• SNOWFLAKE_WORKSHEET_MAPPING.md  
• GAFAIG — SNOWFLAKE SQL FILE SUMMARY.md  
• GAFAIG — FULL VS CODE FILE TREE.md  
• UI_COMPONENT_MAPPING.md  

---

## 🧾 PUBLIC ASSETS

├─ public/  

• images/  
  • gafaig-badge-tier-1.png  
  • gafaig-badge-tier-2.png  
  • gafaig-badge-tier-3.png  

---

# ⚠️ IMPORTANT NOTES

---

## 🔥 CRITICAL FILES

Do NOT break:

• lib/snowflake.ts  
• lib/queries/registry.ts  
• app/api/badge/[registryId]/route.ts  
• app/registry/[registryId]/page.tsx  

---

## ⚠️ TEMPORARY STATE

Currently:

• compatibility exports exist in snowflake.ts  
• explorer pages use direct sfQuery  
• duplicated SQL exists across pages  

---

## 🧠 ARCHITECTURE RULE

Flow:

Snowflake → Query Layer → API → UI  

NEVER:

UI → compute → override  

---

# ▶️ NEXT PHASE

• validate explorer pages  
• consolidate queries  
• remove compatibility layer  
• standardize sfQuery usage  

---

# 🧠 SUMMARY

This is the **full working system tree**.

Use this as the reference for:

• debugging  
• navigation  
• development continuity  