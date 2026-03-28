# GAFAIG — API ROUTE MAPPING
Canonical API Surface & Data Contracts
Last Updated: 2026-03-27

---

# 🧠 PURPOSE

Defines:

• all API routes  
• their data sources  
• their responsibilities  
• their allowed behavior  

This is the **contract between Snowflake → API → UI**

---

# 🔒 CORE RULE

ALL API routes must:

• read from Snowflake  
• use query layer (sfQuery or lib/queries)  
• return normalized JSON  

API routes must NOT:

• compute scores  
• derive certification  
• perform business logic  
• transform governance logic  

---

# 🌐 PUBLIC API ROUTES

---

## 📊 REGISTRY LIST

### Route

/api/registry

### Method

GET

### Query Params

• limit  
• q (search)  
• country  
• registryId  
• caseId  
• applicationId  

### Data Source

CORE.V_REGISTRY_PUBLIC  

### Purpose

• list registry records  
• power /registry page  

---

## 🔍 REGISTRY SEARCH

### Route

/api/registry/search

### Method

GET

### Query Params

• q  

### Data Source

CORE.V_REGISTRY_PUBLIC_SEARCH  

### Purpose

• fast search  
• normalized uppercase matching  
• powers search UI  

---

## 📄 REGISTRY AI SYSTEMS

### Route

/api/registry/[registryId]/ai-systems

### Method

GET

### Data Source

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

### Purpose

• list AI systems tied to a registry  
• power registry detail page  

---

## 🏷 BADGE API

### Route

/api/badge/[registryId]

### Method

GET

### Flow

1. fetch registry record  
2. determine badge image:
   • certifiedTier  
   • certifiedBand  
   • certifiedScore  
3. optional override:
   • badgeImageUrl  
4. redirect (307) → badge image  

### Data Source

lib/queries/registry.ts  

→ REGISTRY_PUBLIC_READTHROUGH  

### Purpose

• embeddable certification badge  
• external verification display  

---

## 🔐 VERIFICATION API

### Route

/api/verify/[registryId]

### Method

GET

### Data Source

CORE.V_REGISTRY_PUBLIC  

### Output

Signed JSON:

{
  registryId,
  entityName,
  certificationStatus,
  certifiedTier,
  certifiedBand,
  certifiedAt,
  validTo,
  signature: {
    alg,
    signedAt
  }
}

### Purpose

• cryptographic verification  
• external trust integration  

---

# 🔧 ADMIN API ROUTES

---

## 🔐 AUTH

### Login

/api/admin/login

POST

• validates password  
• sets session cookie  

---

### Logout

/api/admin/logout

POST

• clears session  

---

### Status

/api/admin/status

GET

• returns session state  

---

## 📥 FINDINGS

### Route

/api/admin/verification/findings

GET / POST

### Data Source

CORE.VERIFICATION_FINDINGS  

### Purpose

• create / read findings  

---

## 📎 EVIDENCE

### Route

/api/admin/verification/evidence

GET / POST

### Data Source

CORE.VERIFICATION_EVIDENCE  

### Purpose

• upload and manage evidence  

---

## 🔗 FINDING → EVIDENCE

### Route

/api/admin/verification/finding-evidence

POST

### Data Source

CORE.VERIFICATION_FINDING_EVIDENCE  

---

## 🧾 EVENTS

### Route

/api/admin/verification/events

POST

### Data Source

CORE.VERIFICATION_EVENTS  

### Notes

• uses INSERT ... SELECT with PARSE_JSON(?)  

---

## ⚖️ DECISIONS

### Route

/api/admin/verification/decisions

POST

### Flow

• insert decision  
• emit verification event  

---

## 📊 SUMMARIES

### Route

/api/admin/verification/[caseId]/summaries

GET

### Purpose

• aggregate case-level data  
• used in admin UI  

---

# 🧱 QUERY LAYER USAGE

---

## Primary Function

sfQuery<T>()

Used by:

• explorer pages  
• API routes  
• registry lookups  

---

## CURRENT STATE

Temporary compatibility layer exists:

• executeQuery  
• snowflakeQuery  
• sfQueryResult  
• snowflakeCtx  

⚠️ DO NOT USE IN NEW CODE  

Future state:

→ ALL routes use sfQuery only  

---

# 📂 REGISTRY QUERY FILE

lib/queries/registry.ts  

### Responsibilities

• getRegistryByRegistryId  
• normalize registry row  
• handle readthrough fallback  

### Current Behavior

Uses:

REGISTRY_PUBLIC_READTHROUGH  

---

# ⚠️ KNOWN LIMITATIONS

• duplicated SQL across explorer routes  
• registry readthrough layer introduces redundancy  
• compatibility exports still present  

---

# 🔥 DO NOT BREAK

• DO NOT compute certification in API  
• DO NOT derive tier/band in API  
• DO NOT bypass Snowflake views  
• DO NOT introduce business logic  

---

# ▶️ NEXT PHASE

After validation:

1. remove compatibility exports  
2. centralize queries into lib/queries  
3. standardize ALL API routes  
4. eliminate duplicated SQL  

---

# 🧠 SUMMARY

API layer is:

✔ pass-through  
✔ Snowflake-driven  
✔ deterministic  
✔ stable  

Remaining work:

→ validation  
→ consolidation  
→ cleanup  