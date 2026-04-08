# GAFAIG — PROJECT INDEX
Repository Structure & System Map
Last Updated: 2026-04-06

---

# ROOT

gafaig/

├─ app/  
├─ components/  
├─ lib/  
├─ public/  
├─ docs/  
├─ styles/  
├─ .env.local  
├─ next.config.js  
├─ package.json  
├─ tsconfig.json  

---

# APP DIRECTORY (NEXT.JS — APP ROUTER)

## CORE PUBLIC PAGES

app/page.tsx  
→ Homepage (positioning: proof of human oversight)

app/mission/page.tsx  
→ Mission narrative

app/framework/page.tsx  
→ System explanation (deterministic model)

app/registry/page.tsx  
→ Public registry list

app/registry/[registryId]/page.tsx  
→ Registry detail page

app/explorer/page.tsx  
→ Explorer landing

app/explorer/organizations/page.tsx  
→ Organizations view

app/explorer/systems/page.tsx  
→ AI systems view

app/explorer/countries/page.tsx  
→ Countries view

app/explorer/map/page.tsx  
→ Map view

app/developers/page.tsx  
→ Integration hub (API, SDK, widget, badge)

app/apply/page.tsx  
→ Certification onboarding entry

app/demo/page.tsx  
→ Guided demo

app/verify/page.tsx  
→ Manual verification page

---

## REGISTRY — AI SYSTEMS

app/registry/ai-systems/page.tsx  
→ AI systems list

app/registry/ai-systems/[systemId]/page.tsx  
→ AI system detail page

---

## ADMIN (PRIVATE)

app/admin/login/page.tsx  
→ Admin login

app/admin/applications/page.tsx  
→ Application intake list

app/admin/verification/[caseId]/page.tsx  
→ Case overview

app/admin/verification/[caseId]/findings/page.tsx  
→ Findings workflow

app/admin/verification/[caseId]/evidence/page.tsx  
→ Evidence workflow

app/admin/verification/[caseId]/events/page.tsx  
→ Event logging

app/admin/verification/[caseId]/score/page.tsx  
→ Scoring view

app/admin/verification/[caseId]/publish/page.tsx  
→ Publish certification

---

## API ROUTES

app/api/registry/route.ts  
→ Public registry query

app/api/registry/search/route.ts  
→ Registry search

app/api/verify/[registryId]/route.ts  
→ Verification endpoint (proof)

app/api/badge/[registryId]/route.ts  
→ Badge resolver

app/api/.well-known/gafaig-public-key/route.ts  
→ Public key endpoint

app/api/admin/verification/*  
→ Admin workflow endpoints

---

# COMPONENTS

## GLOBAL UI

app/_components/PublicPageHero.tsx  
→ Standard hero block

app/_components/PublicButtonLink.tsx  
→ Standard button system

app/_components/SiteNav.tsx  
→ Top navigation

---

## REGISTRY COMPONENTS

components/registry/RegistryHeaderPanel.tsx  
components/registry/RegistryCertificationSummary.tsx  
components/registry/RegistryVerificationPanel.tsx  
components/registry/RegistryTrustTools.tsx  

---

## ADMIN COMPONENTS

components/admin/AdminNav.tsx  
components/admin/AdminPageHeader.tsx  

---

# LIB (QUERY + CORE LOGIC)

lib/snowflake.ts  
→ Snowflake connection + query execution

lib/queries/registry.ts  
→ Registry queries

lib/queries/registry-ai-systems.ts  
→ AI systems queries

lib/queries/explorer.ts  
→ Explorer queries

lib/auth/requireAdmin.ts  
→ Admin auth guard

---

# PUBLIC (STATIC + SDK)

public/widget/gafaig-widget.js  
→ Widget + SDK entry

public/verify.js  
→ Verification helper (if present)

---

# DOCS (CANONICAL MEMORY)

docs/MASTER_STATE.md  
→ System architecture + identity (authoritative)

docs/CURRENT_FOCUS.md  
→ Active execution plan

docs/CHANGELOG.md  
→ Chronological updates

docs/PROJECT_INDEX.md  
→ This file

docs/API_ROUTE_MAPPING.md  
→ API surface map

docs/UI_COMPONENT_MAPPING.md  
→ UI structure map

docs/SNOWFLAKE_WORKSHEET_MAPPING.md  
→ SQL file mapping

docs/GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md  
→ SQL definitions summary

docs/GAFAIG_VS_CODE_File_Tree.md  
→ Full file tree

docs/ENGINEERING_RULES.md  
→ System rules (strict)

---

# SNOWFLAKE (CORE SYSTEM)

## DATABASE

GAFAIG_DB  
→ Schema: CORE  

---

## TABLES

CORE.VERIFICATION_CASES  
CORE.FINDINGS  
CORE.EVIDENCE  
CORE.VERIFICATION_EVENTS  
CORE.CASE_SCORE_SNAPSHOTS  
CORE.DECISIONS  
CORE.REGISTRY_SNAPSHOTS  
CORE.REGISTRY_AI_SYSTEMS  

---

## VIEWS

V_REGISTRY_LATEST_APPROVED  
→ Latest approved snapshot per case

V_REGISTRY_PUBLIC  
→ Public registry projection

V_REGISTRY_PUBLIC_SEARCH  
→ Search-optimized view

V_REGISTRY_AI_SYSTEMS_PUBLIC  
→ AI systems public projection

---

## STORED PROCEDURES

SP_SCORE_CASE_ENTERPRISE  
→ Deterministic scoring engine

SP_PUBLISH_CASE_TO_REGISTRY_V3  
→ Publish to registry (append-only)

---

# DATA FLOW (REFERENCE)

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SCORE SNAPSHOT  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  
→ API  
→ UI  

---

# TRUST SURFACES

/api/verify/[registryId]  
→ canonical verification endpoint

/badge/[registryId]  
→ badge image

/widget/gafaig-widget.js  
→ embeddable widget + SDK

/.well-known/gafaig-public-key  
→ public key for proof validation

---

# DEPLOYMENT

Frontend:
→ Next.js (App Router)

Hosting:
→ Vercel (production)

Backend:
→ Snowflake (source of truth)

Repo:
→ GitHub: GAF2026/gafaig

---

# SYSTEM SUMMARY

GAFAIG is composed of:

1. Private verification engine (Snowflake)  
2. Public trust layer (Next.js + Vercel)  
3. Developer integration layer (API + SDK + widget)  

All layers are strictly separated.

---

# FINAL NOTE

This index is the canonical map of the GAFAIG system.

Use it to:
• locate files quickly  
• understand system boundaries  
• avoid architectural drift  