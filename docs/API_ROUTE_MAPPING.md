# GAFAIG — API Route Mapping
Canonical API Surface Map
Last Updated: 2026-03-25

---

# PURPOSE

This document maps all API routes to:

• route path  
• purpose  
• Snowflake source  
• frontend consumer  
• system role  

This prevents:

• API confusion  
• duplicate logic  
• incorrect route edits  
• business logic drift into the API layer  

---

# CORE RULE

API routes are PASS-THROUGH ONLY.

They may:

• call query layer  
• call Snowflake procedures  
• return canonical results  

They may NOT:

• compute certification  
• derive score / tier / band  
• override Snowflake truth  
• contain business logic  

---

# ARCHITECTURE

Snowflake
→ Views / Procedures
→ Query Layer
→ API Route
→ UI

No exceptions.

---

# PUBLIC API ROUTES

## Registry

### /api/registry
Purpose:
Return canonical public registry records.

Source:
CORE.V_REGISTRY_PUBLIC

Query layer:
lib/queries/registry.ts

Frontend consumers:
• /registry
• homepage fallback metrics
• explorer supporting checks

Returns:
• registryId
• entityName
• entityType
• country
• applicationId
• caseId
• certificationStatus
• certifiedScore
• certifiedTier
• certifiedBand
• decisionStatus
• certifiedAt
• validFrom
• validTo
• lastActivityAt

---

### /api/registry/search
Purpose:
Search public registry records.

Source:
CORE.V_REGISTRY_PUBLIC_SEARCH

Frontend consumers:
• registry search UI

Returns:
Search-filtered public registry rows

---

### /api/registry/[registryId]
Purpose:
Return a single registry record.

Source:
CORE.V_REGISTRY_PUBLIC

Query layer:
lib/queries/registry.ts

Frontend consumers:
• /registry/[registryId]

Returns:
Single canonical public record

---

### /api/registry/[registryId]/ai-systems
Purpose:
Return AI systems attached to a registry record.

Source:
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Frontend consumers:
• /registry/ai-systems
• /registry/ai-systems/[systemId]
• registry detail supporting AI system surfaces

Returns:
Public AI system disclosures

---

## Verification

### /api/verify/[registryId]
Purpose:
Return public verification payload for a registry record.

Source:
CORE.V_REGISTRY_PUBLIC
plus verification proof generation logic

Frontend consumers:
• /registry/[registryId]
• RegistryVerificationPanel
• external verification consumers

Returns:
• ok
• verified
• registryId
• entity
• entityType
• country
• applicationId
• caseId
• status
• tier
• band
• score
• decisionStatus
• certifiedAt
• validFrom
• validTo
• lastActivityAt
• proof
  - alg
  - signature
  - signedAt
  - message

Role:
Public trust verification surface

---

## Badge

### /api/badge/[registryId]
Purpose:
Return tier badge image for a certified registry record.

Source:
CORE.V_REGISTRY_PUBLIC

Frontend consumers:
• /registry/[registryId]
• external badge embedding
• certification preview surfaces

Assets:
• /public/images/gafaig-badge-tier-1.png
• /public/images/gafaig-badge-tier-2.png
• /public/images/gafaig-badge-tier-3.png

Behavior:
• resolve certification tier
• redirect to correct badge image
• no business logic beyond mapping tier → asset

---

## Explorer

### /api/explorer
Purpose:
Return public explorer analytics summary.

Source:
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Query layer:
lib/queries/explorer.ts

Frontend consumers:
• /explorer

Returns:
Explorer metrics and distributions

---

### /api/public/metrics
Purpose:
Return lightweight homepage trust metrics.

Source:
Explorer / registry summary layer

Frontend consumers:
• homepage (/)

Returns:
• certifiedOrganizations
• disclosedAiSystems
• countriesRepresented

Fallback:
Homepage may fall back to /api/registry if this route fails

---

# ADMIN API ROUTES

These routes are protected and may only be used within admin workflows.

---

## Authentication

### /api/admin/login
Purpose:
Authenticate admin session

Frontend consumers:
• /admin/login

---

### /api/admin/logout
Purpose:
Terminate admin session

Frontend consumers:
• admin authenticated surfaces

---

### /api/admin/status
Purpose:
Return current admin session status

Frontend consumers:
• middleware-protected admin UI
• admin auth checks

---

## Applications

### /api/admin/applications
Purpose:
Application list / intake operations

Source:
CORE.APPLICATIONS

Frontend consumers:
• /admin/applications

---

### /api/admin/applications/[requestId]
Purpose:
Single application access

Source:
CORE.APPLICATIONS

Frontend consumers:
• /admin/applications/[requestId]

---

### /api/admin/applications/convert-to-case
Purpose:
Convert approved intake into verification case

Source:
Applications + case creation procedure

Frontend consumers:
• admin workflow

---

### /api/admin/applications/start-verification
Purpose:
Start verification for an application

Source:
case creation / verification workflow layer

Frontend consumers:
• admin workflow

---

### /api/admin/applications/status
Purpose:
Update or inspect application status

Source:
CORE.APPLICATIONS

Frontend consumers:
• admin workflow

---

## Participants

### /api/admin/participants
Purpose:
List / create / manage participants

Source:
CORE.PARTICIPANTS

Frontend consumers:
• /admin/participants

---

### /api/admin/participants/[participantId]
Purpose:
Single participant detail

Source:
CORE.PARTICIPANTS

Frontend consumers:
• /admin/participants/[id]

---

### /api/admin/participants/search
Purpose:
Search participants

Source:
CORE.PARTICIPANTS

Frontend consumers:
• admin participant selection UI

---

## Verification Core

### /api/admin/verification
Purpose:
General verification workflow access

Frontend consumers:
• /admin/verification

---

### /api/admin/verification/[caseId]
Purpose:
Case-level verification access

Source:
CORE.VERIFICATION_CASES

Frontend consumers:
• /admin/verification/[caseId]

---

### /api/admin/verification/cases
Purpose:
Case list / retrieval

Source:
CORE.VERIFICATION_CASES

Frontend consumers:
• verification admin surfaces

---

### /api/admin/verification/status
Purpose:
Verification status updates / reads

Source:
CORE.VERIFICATION_CASES

Frontend consumers:
• verification admin surfaces

---

## Findings

### /api/admin/verification/findings
Purpose:
Create / read / update findings

Source:
CORE.VERIFICATION_FINDINGS

Frontend consumers:
• /admin/verification/[caseId]/findings

---

### /api/admin/verification/[caseId]/findings
Purpose:
Case-specific findings retrieval

Source:
CORE.VERIFICATION_FINDINGS

Frontend consumers:
• findings UI

---

## Evidence

### /api/admin/verification/evidence
Purpose:
General evidence access

Source:
CORE.VERIFICATION_EVIDENCE

Frontend consumers:
• evidence admin surfaces

---

### /api/admin/verification/[caseId]/evidence
Purpose:
Case-specific evidence retrieval

Source:
CORE.VERIFICATION_EVIDENCE

Frontend consumers:
• /admin/verification/[caseId]/evidence

---

### /api/admin/verification/evidence/link
Purpose:
Link evidence to findings

Source:
finding/evidence mapping layer

Frontend consumers:
• evidence workflow

---

### /api/admin/verification/evidence/upload
Purpose:
Upload evidence

Source:
CORE.VERIFICATION_EVIDENCE

Frontend consumers:
• evidence workflow

---

### /api/admin/verification/finding-evidence
Purpose:
Inspect finding ↔ evidence linkages

Source:
mapping layer

Frontend consumers:
• findings / evidence workflow

---

## Events

### /api/admin/verification/events
Purpose:
Create / read verification events

Source:
CORE.VERIFICATION_EVENTS

Frontend consumers:
• /admin/verification/[caseId]/events

---

## Decisions

### /api/admin/verification/decisions
Purpose:
Write governance decision rows

Source:
CORE.DECISIONS

Frontend consumers:
• /admin/verification/[caseId]/decisions

Important:
DECISIONS authorize approval/publish status
They do NOT override engine score / tier / band

---

## Scoring

### /api/admin/verification/[caseId]/score
Purpose:
Return case score information

Source:
CORE.V_GOVERNANCE_SCORE_CASE
score snapshots

Frontend consumers:
• /admin/verification/[caseId]/score

---

## Publishing

### /api/admin/verification/[caseId]/publish
Purpose:
Publish approved case to registry

Source:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3 / V4

Frontend consumers:
• /admin/verification/[caseId]/publish

Important:
This is the only valid publish path

---

### /api/admin/publish
Purpose:
General publish entry point / compatibility layer

Source:
registry publish procedure

Frontend consumers:
• admin publishing actions

---

## Summaries

### /api/admin/verification/[caseId]/summaries
Purpose:
Return case summary content

Source:
verification summary layer

Frontend consumers:
• admin verification UI

---

## Assignments

### /api/admin/verification/assignments
Purpose:
Case assignment operations

Frontend consumers:
• /admin/verification/[caseId]/assignments

---

### /api/admin/verification/[caseId]/assignments
Purpose:
Case-level assignment access

Frontend consumers:
• assignment UI

---

## AI Systems

### /api/admin/verification/[caseId]/ai-systems
Purpose:
Manage AI systems linked to case

Source:
CORE.REGISTRY_AI_SYSTEMS or related case-level AI systems layer

Frontend consumers:
• /admin/verification/[caseId]/ai-systems

---

# SUPPORT / DEBUG ROUTES

These are operational helpers, not core public trust surfaces.

### /api/admin/debug/snowflake
Purpose:
Snowflake connectivity / admin diagnostics

---

### /api/debug/sf
Purpose:
Snowflake connectivity diagnostics

---

### /api/admin/email-test
Purpose:
Email testing

---

### /api/admin/demo-login
Purpose:
Demo admin access

---

### /api/admin/metrics
Purpose:
Admin dashboard metrics

---

# OTHER PUBLIC UTILITY ROUTES

### /api/apply
Purpose:
Application submission entry

---

### /api/submit
Purpose:
Submission handling

---

### /api/renewal
Purpose:
Renewal workflow entry

---

### /api/ask
Purpose:
Question / intake endpoint

---

### /api/participants
Purpose:
Public participant-related access

---

### /api/participants/[slug]
Purpose:
Single participant public access

---

# MOST CRITICAL ROUTES

If only a few matter, they are:

1. /api/registry
2. /api/verify/[registryId]
3. /api/badge/[registryId]
4. /api/explorer
5. /api/admin/verification/[caseId]/publish

---

# FILE OWNERSHIP MAP

## Public trust routes

/app/api/registry/*
/app/api/verify/*
/app/api/badge/*
/app/api/explorer/*
/app/api/public/metrics

---

## Admin workflow routes

/app/api/admin/verification/*
/app/api/admin/applications/*
/app/api/admin/login
/app/api/admin/logout
/app/api/admin/status

---

# FINAL RULE

If an API route appears to contain business logic:

→ it is wrong  
→ trace logic back into Snowflake  

---

# END STATE

A fully controlled API surface where:

• Snowflake determines truth  
• API transports truth  
• UI displays truth  

--- 