# GAFAIG_VS_CODE_File_Tree.md
Last Updated: 2026-04-16

---

## PURPOSE

This document defines the canonical VS Code file structure for the GAFAIG platform.

It ensures:
- Clean separation of concerns
- Deterministic architecture alignment with Snowflake
- Zero file drift
- Consistent developer workflow

This file is the source of truth for the application structure.

---

## ROOT PROJECT STRUCTURE

gafaig/
├── app/
├── components/
├── lib/
├── docs/
├── public/
├── styles/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json

---

## APP DIRECTORY (NEXT.JS APP ROUTER)

app/
├── layout.tsx
├── page.tsx

---

## CORE PUBLIC PAGES

app/
├── page.tsx                         # Homepage
├── mission/
│   └── page.tsx
├── framework/
│   └── page.tsx
├── explorer/
│   ├── page.tsx
│   ├── organizations/
│   │   └── page.tsx
│   ├── countries/
│   │   └── page.tsx
│   └── systems/
│       └── page.tsx
├── registry/
│   ├── page.tsx
│   ├── [registryId]/
│   │   └── page.tsx
│   ├── ai-systems/
│   │   ├── page.tsx
│   │   └── [systemId]/
│   │       └── page.tsx
├── verify/
│   └── page.tsx
├── developers/
│   └── page.tsx
├── widget-preview/
│   └── [registryId]/
│       └── page.tsx

---

## API ROUTES

app/api/
├── explorer/
│   └── route.ts
├── registry/
│   ├── route.ts
│   ├── search/
│   │   └── route.ts
│   ├── [registryId]/
│   │   ├── route.ts
│   │   └── ai-systems/
│   │       └── route.ts
├── verify/
│   └── [registryId]/
│       └── route.ts
├── badge/
│   └── [registryId]/
│       └── route.ts
├── .well-known/
│   └── gafaig-public-key/
│       └── route.ts

---

## SHARED UI COMPONENTS

app/_components/
├── PublicPageHero.tsx              # Canonical layout system
├── PublicButtonLink.tsx            # Button system
├── PublicButton.tsx
├── SiteHeader.tsx
├── SiteNav.tsx

---

## FEATURE COMPONENTS

components/
├── registry/
│   ├── RegistryVerificationPanel.tsx
│   ├── RegistryHeader.tsx
│   ├── RegistryMetaGrid.tsx
│   └── RegistryActions.tsx
├── explorer/
│   ├── ExplorerCard.tsx
│   ├── ExplorerStats.tsx
│   └── ExplorerFilters.tsx
├── ui/
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── MetricCard.tsx
│   └── Pill.tsx

---

## QUERY LAYER (CRITICAL)

lib/queries/
├── explorer.ts
├── registry.ts
├── registry-ai-systems.ts

Responsibilities:
- Fetch data from Snowflake
- No business logic
- No trust-state computation
- Must reflect Snowflake views exactly

---

## SNOWFLAKE CONNECTION

lib/
├── snowflake.ts                    # sfQuery + connection layer

Responsibilities:
- Secure connection to Snowflake
- Query execution
- No transformation logic

---

## CRYPTO / TRUST

lib/crypto/
├── verify-signing.ts

Responsibilities:
- Signing payloads (Ed25519)
- Generating proof objects
- Key ID management

---

## DOCUMENTATION

docs/
├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── ENGINEERING_RULES.md
├── GAFAIG_ACTIVE_FILE_MAP.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md
├── PAGE_LAYOUT_SYSTEM.md
├── VERIFIED_DEFINITION.md
├── VERSIONING.md
├── VERIFICATION_SIGNATURE_CONTRACT.md

---

## PUBLIC ASSETS

public/
├── images/
├── icons/
├── badges/

---

## STYLES

styles/
├── globals.css

---

## ENVIRONMENT

.env.local

Must include:
- Snowflake credentials
- Signing key
- NEXT_PUBLIC_BASE_URL

---

## ARCHITECTURE RULES

- Snowflake is the source of truth
- UI must not compute trust logic
- API must not compute trust logic
- Views are projections only
- Queries must map directly to Snowflake views

---

## LAYOUT RULES (MANDATORY)

All pages must:
- Use PublicPageHero
- Use max-w-[1180px]
- Use px-6 padding
- Use space-y-8 spacing
- Use rounded-3xl containers
- Use border-black/10
- Use bg-white

No custom layout systems allowed.

---

## DATA FLOW (APPLICATION SIDE)

API → Query Layer → Snowflake Views → Snowflake Tables

NO reverse computation.

---

## CURRENT ACTIVE WORK

- Snowflake canonicalization
- Registry contract correction
- Explorer stats alignment
- Seed system consolidation
- UI alignment to data truth

---

## DO NOT BREAK

- File structure hierarchy
- Query layer contracts
- Snowflake → API → UI flow
- Component reuse system
- Layout system (PublicPageHero)

---

END OF FILE