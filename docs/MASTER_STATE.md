# GAFAIG — MASTER STATE
Canonical Architecture & Platform Memory
Last Updated: 2026-03-29

---

# PLATFORM IDENTITY

GAFAIG = Global Authority for AI Governance

GAFAIG is the world’s first:
→ deterministic AI governance certification engine
→ global, searchable AI governance registry

GAFAIG is NOT:
• a dashboard
• a scoring toy
• a simple database

GAFAIG IS:
• trust infrastructure
• certification authority for AI governance
• registry of verified AI systems and organizations

Comparable to:
• financial audit systems
• certificate authorities (SSL)
• regulatory registries
• standards organizations

---

# REPOSITORY + DEPLOYMENT

GitHub:
GAF2026/gafaig

Production:
https://www.gafaig.com

Hosting:
Vercel

Framework:
Next.js (App Router) + TypeScript

---

# SNOWFLAKE ENVIRONMENT (SOURCE OF TRUTH)

Account:
GAFAIG1

Database:
GAFAIG_DB

Schema:
CORE

Warehouse:
GAFAIG_WH

Role:
GAFAIG_APP_ROLE

---

# NON-NEGOTIABLE PRINCIPLE

SNOWFLAKE IS THE SYSTEM OF RECORD

ALL:
• joins
• scoring
• aggregation
• certification logic

MUST exist in Snowflake

NEVER:
• compute certification in UI
• compute certification in API
• duplicate logic outside Snowflake

---

# CANONICAL DATA FLOW (LOCKED)

ALL DATA MUST FOLLOW:

CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SCORE SNAPSHOT
→ REGISTRY SNAPSHOT
→ PUBLIC VIEWS
→ API
→ UI

NO SHORTCUTS
NO BYPASSES

---

# CORE TABLES

VERIFICATION_CASES
VERIFICATION_FINDINGS
VERIFICATION_EVIDENCE
VERIFICATION_FINDING_EVIDENCE
VERIFICATION_EVENTS

CASE_SCORE_SNAPSHOTS_V2
DECISIONS

REGISTRY_SNAPSHOTS
REGISTRY_AI_SYSTEMS

---

# CORE VIEWS (CANONICAL)

V_GOVERNANCE_SCORE_CASE
→ deterministic governance score

V_CASE_TIER_BAND
→ tier + band mapping

V_REGISTRY_LATEST_APPROVED
→ latest approved snapshot per case

V_REGISTRY_PUBLIC
→ PUBLIC CONTRACT (registry UI + API)

V_REGISTRY_PUBLIC_SEARCH
→ search-optimized projection

V_REGISTRY_AI_SYSTEMS_PUBLIC
→ AI systems joined to registry certification

---

# CORE PROCEDURES

SP_SCORE_CASE_ENTERPRISE
→ computes deterministic score + snapshot

SP_PUBLISH_CASE_TO_REGISTRY_V3
→ publishes certified/approved case into registry
→ append-only snapshot system
→ generates registry_id
→ aligns AI systems

---

# REGISTRY CONTRACT (PUBLIC)

Each registry record exposes:

registryId
applicationId
caseId

entityName
entityType
country

certifiedScore
certifiedTier
certifiedBand

decisionStatus
certificationStatus

validFrom
validTo

certifiedAt
publishedAt

renewalStatus
lifecycleStatus

---

# PUBLIC SURFACES

Pages:

/
 /mission
 /framework
 /demo
 /demo-script

/registry
/registry/[registryId]

/registry/ai-systems
/registry/ai-systems/[systemId]

/explorer
/explorer/organizations
/explorer/systems
/explorer/countries
/explorer/map

---

# API CONTRACT

/api/registry
→ reads V_REGISTRY_PUBLIC

/api/registry/search
→ reads V_REGISTRY_PUBLIC_SEARCH

/api/registry/[registryId]/ai-systems
→ reads V_REGISTRY_AI_SYSTEMS_PUBLIC

/api/verify/[registryId]
→ returns signed verification JSON

---

# ADMIN SURFACE

/admin/login
/admin/applications
/admin/verification/[caseId]/evidence
/admin/verification/[caseId]/findings
/admin/verification/[caseId]/score
/admin/verification/[caseId]/publish

---

# QUERY LAYER

lib/snowflake.ts
→ connection + execution

lib/queries/*
→ canonical query layer

RULE:
API = thin pass-through
NO business logic in API

---

# AUTH MODEL

middleware.ts protects:
• /admin/*
• /api/admin/*

Session:
GAFAIG_SESSION_SECRET

Legacy support:
gafaig_admin cookie (temporary)

---

# CURRENT SYSTEM STATUS

✔ End-to-end pipeline working
✔ CASE → REGISTRY → UI fully functional
✔ Deterministic scoring engine stable
✔ Publish procedure stable
✔ Registry views stable
✔ Explorer working
✔ Verification endpoint working

---

# CANONICAL DEMO STATE (LOCKED)

PRIMARY CASE:

CASE-0001
→ GAFAIG Certified Demo Org
→ Certified
→ Score = 100
→ Tier = Certified
→ Band = A

This is the flagship certification record.

---

# MULTI-CASE EXPANSION (IN PROGRESS)

Target:

CASE-0002 → Anthropic → Not Certified
CASE-0003 → Google DeepMind → Not Certified
CASE-0004 → Microsoft → Not Certified
CASE-0005 → NVIDIA → Not Certified

RULE:
All cases MUST:
• produce governance score row
• pass through scoring engine
• publish via SP_PUBLISH_CASE_TO_REGISTRY_V3

NO manual registry inserts

---

# CRITICAL ENGINEERING RULES

DO NOT:
• re-architect system
• bypass scoring engine
• bypass publish procedure
• insert directly into registry snapshots
• compute certification in UI/API

ALWAYS:
• follow canonical pipeline
• use Snowflake views as truth
• keep append-only snapshot model

---

# CURRENT FOCUS

Registry Enrichment (Post-Engine Stabilization)

Goal:
→ Fully populated, realistic registry
→ Clean multi-entity demo
→ Strong explorer surfaces
→ Production-ready verification UX

---

# NEXT PHASES

1. Multi-case canonical expansion (scoreable cases)
2. Verification UX polish
3. Demo narrative (investor-ready)
4. Explorer analytics enrichment

---

# KEY TAKEAWAY

GAFAIG is not a frontend project.

It is a:
→ deterministic certification engine
→ backed by Snowflake
→ surfaced through a registry

ALL TRUST COMES FROM:
Snowflake → Views → Deterministic Logic

NOT from UI.

---