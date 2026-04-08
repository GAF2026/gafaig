# GAFAIG — UI COMPONENT MAPPING
Canonical UI Structure & Component Responsibilities
Last Updated: 2026-04-06

---

# OVERVIEW

The GAFAIG UI layer is a **presentation layer only**.

STRICT RULE:
→ UI does NOT compute certification, scoring, or trust  
→ UI ONLY renders data from API responses (Snowflake-derived)

---

# CORE UI PRINCIPLES

• Snowflake = source of truth  
• API = transport layer  
• UI = rendering layer  

• No business logic in UI  
• No certification logic in UI  
• No scoring in UI  

---

# GLOBAL COMPONENTS

## 1. PublicPageHero

FILE:
app/_components/PublicPageHero.tsx

PURPOSE:
Standard hero block across public pages

PROPS:
• eyebrow
• title
• description
• secondaryDescription
• actions

USED IN:
• homepage
• mission
• framework
• developers
• apply
• demo

---

## 2. PublicButtonLink

FILE:
app/_components/PublicButtonLink.tsx

PURPOSE:
Global button system

VARIANTS:
• primary (black filled)
• secondary (outlined)
• ghost (minimal)

SIZES:
• sm
• md

RULE:
→ All public CTAs must use this component  
→ No inline button styles allowed  

---

## 3. SiteNav

FILE:
app/_components/SiteNav.tsx

PURPOSE:
Top navigation

CURRENT NAV ITEMS:
• Mission
• Framework
• Registry
• Explorer
• Verify
• Demo
• Developers (to be included)

NOTES:
• Active state = black background  
• Inactive = outlined  
• Hover = subtle background  

---

# HOMEPAGE

FILE:
app/page.tsx

COMPONENTS:

• PublicPageHero  
→ positioning: proof of human oversight  

• MetricCard  
→ public metrics (organizations, systems, countries)

• PillarCard  
→ system architecture (private engine, public layer, explorer)

• StatementCard  
→ conceptual explanations

• PathCard  
→ system workflow (intake → publication)

• FeatureCard  
→ navigation to core pages

PURPOSE:
→ explain GAFAIG clearly  
→ establish authority  
→ direct users into system  

---

# DEVELOPERS PAGE

FILE:
app/developers/page.tsx

PURPOSE:
Integration hub (Stripe-level)

COMPONENTS:

• PublicPageHero  
→ developer positioning  

• StartHereStrip (inline section)  
→ immediate onboarding  

• MetricCard  
→ trust primitives  

• PathCard  
→ integration paths  

• CodeBlock  
→ code examples (SDK, API, embed)

• Card  
→ grouped sections (badge, widget)

• InfoCard  
→ proof metadata  

• BoundaryCard  
→ public vs private separation  

RULES:
• code blocks must have spacing (space-y-*)  
• no stacked black blocks without spacing  
• CTA must not float (always anchored)  

---

# APPLY PAGE

FILE:
app/apply/page.tsx

PURPOSE:
Certification onboarding entry

COMPONENTS:

• PublicPageHero  
→ application framing  

• DarkMetricCard  
→ what you receive  

• AudienceCard  
→ who should apply  

• ChecklistCard  
→ evaluation criteria  

• PathCard  
→ process flow  

• BoundaryCard  
→ private vs public  

• InfoCard  
→ outcomes  

• FeatureCard  
→ entry points (demo, framework, developers)

ROLE:
→ bridge from interest → certification  

---

# REGISTRY

## LIST PAGE

FILE:
app/registry/page.tsx

COMPONENTS:

• filters (search, country, etc.)
• registry list cards
• pagination / limit

DATA SOURCE:
→ /api/registry  

---

## DETAIL PAGE

FILE:
app/registry/[registryId]/page.tsx

COMPONENTS:

• RegistryHeaderPanel  
• RegistryCertificationSummary  
• RegistryVerificationPanel  
• RegistryTrustTools  

PURPOSE:
→ canonical trust record display  

RULE:
→ all fields must map to V_REGISTRY_PUBLIC  

---

# REGISTRY COMPONENTS

## RegistryHeaderPanel

PURPOSE:
• entity name
• registry ID
• top-level metadata  

---

## RegistryCertificationSummary

PURPOSE:
• score
• tier
• band
• decision status  

---

## RegistryVerificationPanel

PURPOSE:
• verification status
• timestamps
• validity  

---

## RegistryTrustTools

PURPOSE:
• verify endpoint link  
• badge  
• widget  
• copy/share tools  

---

# EXPLORER

FILES:
app/explorer/*

PAGES:

• /explorer  
• /explorer/organizations  
• /explorer/systems  
• /explorer/countries  
• /explorer/map  

COMPONENTS:
• list views
• filtering
• navigation links

DATA SOURCE:
→ V_REGISTRY_PUBLIC  
→ V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

# VERIFY PAGE

FILE:
app/verify/page.tsx

PURPOSE:
Manual verification interface

FUNCTION:
• input registryId  
• call /api/verify  
• display result  

---

# DEMO PAGE

FILE:
app/demo/page.tsx

PURPOSE:
Guided GAFAIG experience

ROLE:
• onboarding tool  
• demonstration of trust flow  

---

# ADMIN UI

## AdminNav

FILE:
components/admin/AdminNav.tsx

PURPOSE:
Admin navigation  

---

## AdminPageHeader

FILE:
components/admin/AdminPageHeader.tsx

PURPOSE:
Consistent admin page titles  

---

## ADMIN PAGES

FILES:
app/admin/*

FLOW:

applications  
→ verification  
→ findings  
→ evidence  
→ events  
→ score  
→ publish  

RULE:
→ UI triggers API  
→ API triggers Snowflake  

---

# SHARED UI PATTERNS

## Cards

Used for:
• metrics  
• features  
• info blocks  

STYLE:
• rounded  
• bordered  
• subtle background  

---

## CodeBlock

PURPOSE:
Display developer code

RULES:
• always wrapped in container  
• never stacked without spacing  
• use space-y-* when multiple  

---

## Buttons

SYSTEM:
PublicButtonLink ONLY

NO:
• raw <button> with custom classes  
• duplicated styles  

---

# STATE MANAGEMENT

• minimal client state  
• server-first rendering  
• API-driven data  

---

# CRITICAL UI RULES

DO NOT:

• compute certification in UI  
• derive score in UI  
• modify API data  
• bypass API layer  
• duplicate button styles  

ALWAYS:

• use canonical components  
• use API responses directly  
• maintain visual consistency  

---

# FINAL SUMMARY

The GAFAIG UI layer:

• renders trust  
• explains system  
• enables integration  
• guides users into workflow  

It does NOT:

• compute trust  
• determine certification  
• act as source of truth  

All authority lives in Snowflake.