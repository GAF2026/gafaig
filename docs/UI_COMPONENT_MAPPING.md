# GAFAIG — UI COMPONENT MAPPING
Canonical UI Layer Map
Last Updated: 2026-03-29

---

# PRINCIPLE

UI IS PRESENTATION ONLY

UI MUST:
• display data from API
• reflect Snowflake truth
• remain stateless (no business logic)

UI MUST NOT:
• compute certification
• derive scoring
• perform data transformations beyond formatting

ALL LOGIC EXISTS IN SNOWFLAKE

---

# COMPONENT DIRECTORY

app/_components/

---

# CORE COMPONENTS

---

## 1. PublicPageHero.tsx

Purpose:
→ Standard page header across public pages

Props:
• eyebrow (string)
• title (string)
• description (string, optional)
• secondaryDescription (string, optional)
• actions (ReactNode, optional)

Used in:
• /registry
• /explorer
• /demo
• /mission
• /framework

Design:
• consistent typography
• consistent spacing
• unified visual identity

---

## 2. PublicButtonLink.tsx

Purpose:
→ Standard button for navigation links

Props:
• href
• children
• variant (primary / secondary)

Used in:
• hero actions
• navigation sections
• registry/explorer pages

Variants:

Primary:
• black background
• white text

Secondary:
• bordered
• subtle hover background

Rule:
→ ALL buttons across GAFAIG must use this component

---

## 3. RegistryCard.tsx

Purpose:
→ Display registry record summary

Data Source:
→ /api/registry

Displays:
• entityName
• country
• certifiedTier
• certifiedBand
• certifiedScore
• decisionStatus
• certificationStatus

Used in:
• /registry page

---

## 4. ExplorerCard.tsx

Purpose:
→ Generic card for explorer metrics

Displays:
• counts
• labels
• distribution summaries

Used in:
• /explorer
• /explorer/organizations
• /explorer/systems
• /explorer/countries

---

## 5. PublishCertificationButton.tsx

Purpose:
→ Admin action to trigger certification publish

Location:
• admin verification score page

Behavior:
• calls publish endpoint
• triggers SP_PUBLISH_CASE_TO_REGISTRY_V3 indirectly

Rule:
→ must not compute certification
→ only trigger backend flow

---

## 6. Badge Rendering (Route-Based)

Path:
app/badge/[registryId]/route.ts

Purpose:
→ Generate certification badge

Uses:
• /api/verify/[registryId]

Displays:
• entityName
• certifiedTier
• certifiedBand
• certification status

Future:
→ unify with visual badge system

---

# PAGE → COMPONENT MAPPING

---

## /registry

Components:
• PublicPageHero
• PublicButtonLink
• RegistryCard

Data:
→ /api/registry

---

## /registry/[registryId]

Components:
• PublicPageHero
• PublicButtonLink

Displays:
• full registry record
• AI systems list

Data:
→ /api/registry
→ /api/registry/[registryId]/ai-systems

---

## /registry/ai-systems

Components:
• PublicPageHero
• ExplorerCard (optional reuse)

Data:
→ /api/registry/[registryId]/ai-systems

---

## /explorer

Components:
• PublicPageHero
• ExplorerCard
• PublicButtonLink

Data:
→ /api/registry

---

## /explorer/organizations

Components:
• PublicPageHero
• ExplorerCard

Data:
→ aggregated registry data

---

## /explorer/systems

Components:
• PublicPageHero
• ExplorerCard

Data:
→ V_REGISTRY_AI_SYSTEMS_PUBLIC

---

## /explorer/countries

Components:
• PublicPageHero
• ExplorerCard

Data:
→ country aggregation from registry

---

## /explorer/map

Components:
• PublicPageHero

Data:
→ country distribution

---

## /verify/[registryId]

Components:
• PublicPageHero
• structured JSON display

Data:
→ /api/verify/[registryId]

---

## /demo

Components:
• PublicPageHero
• PublicButtonLink

Purpose:
→ walkthrough of GAFAIG system

---

## /demo-script

Components:
• PublicPageHero

Purpose:
→ narrative explanation of platform

---

# DESIGN SYSTEM RULES

---

## Buttons

ALL buttons must:

• use PublicButtonLink
• maintain consistent padding and radius
• follow primary/secondary variants

---

## Layout

• max-width containers
• consistent spacing (mt-*, p-*)
• responsive grid usage

---

## Typography

• consistent font sizes
• controlled line heights
• no ad-hoc styling

---

## Cards

• rounded-3xl
• border border-black/10
• white background

---

# DATA FLOW (UI PERSPECTIVE)

UI Component
→ API Route
→ Query Layer
→ Snowflake View
→ Snowflake Tables

UI MUST NOT SKIP LAYERS

---

# ANTI-PATTERNS (DO NOT DO)

DO NOT:

• compute score in UI
• compute tier/band in UI
• hardcode certification values
• join datasets in UI
• duplicate Snowflake logic

---

# FUTURE COMPONENTS (PLANNED)

• CertificationBadge (unified visual system)
• TierIndicator (A / B / C / Certified)
• ScoreGauge (visual score representation)
• LifecycleStatusBadge (Active / Expiring / Expired)
• CountryDistributionChart

---

# PURPOSE

This file ensures:

• UI remains consistent
• components are reusable
• no logic leaks into frontend
• clean separation of concerns
• stable visual system across GAFAIG

---