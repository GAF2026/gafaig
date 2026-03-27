# GAFAIG — UI Component Mapping
Frontend Component Architecture & Responsibilities
Last Updated: 2026-03-25

---

# PURPOSE

This document maps UI components to:

• location in codebase  
• responsibility  
• data source  
• consuming pages  

This prevents:

• UI inconsistency  
• duplicated logic  
• misuse of components  
• business logic leaking into UI  

---

# CORE RULE

UI is a DISPLAY LAYER ONLY.

Components may:

• render data  
• format values  
• display status  

Components may NOT:

• compute certification  
• derive score / tier / band  
• override API values  
• fetch directly from Snowflake  
• contain business logic  

---

# ARCHITECTURE

Snowflake
→ Views
→ Query Layer
→ API
→ UI Components
→ Pages

---

# GLOBAL LAYOUT COMPONENTS

## PublicPageHero

Location:
app/_components/PublicPageHero.tsx

Purpose:
Primary hero section across all public pages

Used in:
• homepage (/)
• mission
• framework
• demo
• registry
• explorer

Features:
• eyebrow text (system identity)
• title
• description
• secondary description
• CTA buttons

Rules:
• no data fetching
• purely presentational

---

## PublicPageSection

Location:
app/_components/PublicPageSection.tsx

Purpose:
Standardized section wrapper for all pages

Used in:
• all public pages

Features:
• consistent spacing
• consistent typography
• unified container styling

Rules:
• must wrap all major sections
• enforces layout consistency

---

# REGISTRY COMPONENTS

## RegistryVerificationPanel

Location:
components/registry/RegistryVerificationPanel.tsx

Purpose:
Display verification status and proof

Used in:
• /registry/[registryId]

Data Source:
→ /api/verify/[registryId]

Displays:
• verification status
• registry ID
• entity
• certification status
• score / tier / band
• proof payload

Rules:
• does NOT compute verification
• consumes API output only

---

# HOMEPAGE COMPONENTS

## PillarCard

Location:
app/page.tsx

Purpose:
Display system pillars

Used in:
• homepage

Displays:
• pillar title
• description
• bullet points
• CTA

---

## MetricCard

Location:
app/page.tsx

Purpose:
Display homepage trust metrics

Used in:
• homepage

Data Source:
→ /api/public/metrics (fallback to /api/registry)

Displays:
• certified organizations
• AI systems
• countries

Rules:
• fallback allowed (UI resilience)
• no computation of certification

---

## StatementCard

Location:
app/page.tsx

Purpose:
Explain system concepts

Used in:
• homepage

---

## PathCard

Location:
app/page.tsx

Purpose:
Show system flow

Used in:
• homepage

Displays:
CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → REGISTRY

---

## FeatureCard

Location:
app/page.tsx

Purpose:
Navigation cards

Used in:
• homepage

---

# REGISTRY PAGE COMPONENTS

## Registry Table (inline)

Location:
app/registry/page.tsx

Purpose:
Display registry records

Data Source:
→ /api/registry

Displays:
• entity
• country
• certification status
• tier
• band
• score

Rules:
• no computation
• direct API mapping

---

## StatusBadge (inline)

Purpose:
Visual status indicator

Displays:
• Certified
• Not Certified
• Published

Rules:
• purely visual mapping

---

# REGISTRY DETAIL COMPONENTS

## Metric (inline)

Purpose:
Display key metrics

Displays:
• score
• certifiedAt
• country
• entity type

---

## Info (inline)

Purpose:
Display metadata fields

Displays:
• decision status
• validFrom
• validTo
• applicationId
• caseId

---

# EXPLORER COMPONENTS

## StatCard

Location:
app/explorer/page.tsx

Purpose:
Top-level metrics

Displays:
• total records
• entities
• countries
• certified
• not certified

Data Source:
→ explorer queries

---

## TierLadder

Purpose:
Display certification tiers

Displays:
• Tier 3
• Tier 2
• Tier 1

Data Source:
→ explorer aggregation

Rules:
• uses API data
• no tier calculation

---

## FeaturedTierCard

Purpose:
Highlight highest tier

Displays:
• top certification tier

---

## GGIScoreCard

Purpose:
Display Global Governance Index

Displays:
• score
• classification
• breakdown

Rules:
• uses precomputed values

---

## MetricBar

Purpose:
Visual metric contribution

Displays:
• coverage
• depth
• reach

---

## BarCard

Purpose:
Distribution charts

Displays:
• country distribution
• certification status
• tier distribution
• band distribution

---

## MiniTableCard

Purpose:
Compact tables

---

## DataTable

Purpose:
Full table display

Used in:
• explorer sections

---

# BADGE SYSTEM

## Badge Rendering (API-driven)

Route:
→ /api/badge/[registryId]

Assets:
public/images/

• gafaig-badge-tier-1.png  
• gafaig-badge-tier-2.png  
• gafaig-badge-tier-3.png  

Used in:
• registry detail page
• external embeds

Rules:
• tier → image mapping only
• no logic beyond mapping

---

# NAVIGATION / LAYOUT

## app/layout.tsx

Purpose:
Global layout

Controls:
• header
• footer
• global spacing
• branding (gafaig-lockup.png)

---

# AUTH COMPONENTS

## middleware.ts

Purpose:
Protect admin routes

Applies to:
• /admin/*
• /api/admin/*

---

## Auth utilities

Location:
lib/auth/

Purpose:
• session handling
• cookie validation

---

# DESIGN SYSTEM

## Layout Rules

• max width: 1280px  
• padding: px-6 md:px-8  
• spacing: space-y-8  
• cards: rounded-3xl border bg-white  

---

## Typography

• eyebrow: uppercase tracking  
• titles: large, bold  
• body: readable spacing  
• labels: subdued  

---

# DATA FLOW (UI LEVEL)

API Response
→ Component Props
→ UI Rendering

No transformations beyond formatting.

---

# COMPONENT RESPONSIBILITY MODEL

Each component must:

• have a single responsibility  
• consume API data  
• not introduce logic  
• remain reusable  

---

# ANTI-PATTERNS (FORBIDDEN)

DO NOT:

• compute certification in UI  
• infer missing fields  
• override API results  
• hardcode values  
• duplicate components unnecessarily  

---

# DEBUGGING RULE

If UI is incorrect:

TRACE:

Component
→ API
→ Query
→ View
→ Snowflake

Fix at the SOURCE.

---

# MOST CRITICAL COMPONENTS

If only a few matter:

1. PublicPageHero  
2. PublicPageSection  
3. RegistryVerificationPanel  
4. TierLadder  
5. StatCard  

---

# END STATE

A clean, unified UI system where:

• components are reusable  
• layout is consistent  
• data is accurate  
• no business logic leaks into UI  

---