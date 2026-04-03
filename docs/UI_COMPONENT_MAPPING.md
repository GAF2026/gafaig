# GAFAIG — UI COMPONENT MAPPING
UI Architecture & Component Reference
Last Updated: 2026-04-03

---

# PURPOSE

This document maps:

• all major UI pages  
• reusable components  
• data sources  
• relationships to API + Snowflake  

Use this to:

→ understand UI structure  
→ trace data flow  
→ maintain consistency across pages  

---

# CORE PRINCIPLE

UI layer is:

→ PRESENTATION ONLY

It MUST NOT:

• compute scores  
• determine certification  
• modify data  
• bypass API/query layer  

All data must come from:

→ API  
→ query layer (server-side)  

---

# UI ARCHITECTURE

Next.js App Router

Structure:

app/
├─ page.tsx
├─ registry/
├─ explorer/
├─ verify/
├─ framework/
├─ mission/
├─ demo/
├─ api/
├─ _components/

---

# GLOBAL COMPONENTS

## SiteNav.tsx

Location:
app/_components/SiteNav.tsx

Purpose:
• top navigation  
• route switching  

Routes:
• /mission  
• /framework  
• /registry  
• /explorer  
• /verify  
• /demo  

---

## SiteFooter.tsx

Location:
app/_components/SiteFooter.tsx

Purpose:
• system footer  
• environment indicator  
• trust messaging  

---

## PublicPageHero.tsx

Purpose:
• consistent page header  
• title + subtitle  

Used by:
• homepage  
• framework  
• registry  
• explorer  

---

## PublicButtonLink.tsx

Purpose:
• standardized button UI  
• primary / secondary variants  

Used across:
• registry  
• explorer  
• CTA sections  

---

# CORE PAGES

---

## Homepage

Route:
/app/page.tsx

Purpose:
• introduce GAFAIG  
• position as trust infrastructure  

Components:
• PublicPageHero  
• CTA sections  

---

## Mission Page

Route:
/app/mission/page.tsx

Purpose:
• explain purpose  
• reinforce global governance positioning  

---

## Framework Page

Route:
/app/framework/page.tsx

Purpose:
• explain deterministic model  
• define system as infrastructure  

---

## Registry Page

Route:
/app/registry/page.tsx

---

### Purpose

• registry listing  
• search + filtering  
• trust positioning  

---

### Data Source

CORE.V_REGISTRY_PUBLIC

---

### Key UI Elements

• search input  
• country filter  
• metric cards  
• registry record cards  

---

### Record Card Includes

• entity name  
• registry ID  
• certification status  
• tier / band  
• validity window  
• application ID  
• case ID  

---

### Components Used

• StatusPill  
• MetricCard  
• Info  
• IntroCard  
• StatementCard  
• PathCard  

---

---

## Registry Detail Page

Route:
/app/registry/[registryId]/page.tsx

---

### Purpose

• display single certification record  
• expose trust surfaces  

---

### Data Source

CORE.V_REGISTRY_PUBLIC

---

### Key UI Sections

• entity header  
• certification summary  
• validity  
• identifiers  
• trust surfaces  

---

### Trust Surfaces

• verify API link  
• badge  
• widget  
• proof  
• QR  

---

### Components

• RegistryCertificationSummary  
• RegistryHeaderPanel  
• RegistryVerificationPanel  

---

---

## Explorer Page

Route:
/app/explorer/page.tsx

---

### Purpose

• public intelligence layer  
• aggregate registry data  

---

### Data Source

CORE.V_REGISTRY_PUBLIC

---

### Key UI Sections

• metrics  
• recent certifications  
• top countries  
• feature navigation  

---

### Components

• MetricCard  
• IntroCard  
• StatementCard  
• InfoPanel  
• FeatureCard  

---

---

## Explorer Subpages

---

### Countries

/app/explorer/countries/page.tsx

Purpose:
• group by country  

---

### Organizations

/app/explorer/organizations/page.tsx

Purpose:
• group by entity  

---

### Systems

/app/explorer/systems/page.tsx

Purpose:
• show AI systems  

---

### Map

/app/explorer/map/page.tsx

Purpose:
• geographic visualization  

---

---

## Verify Page

Route:
/app/verify/page.tsx

---

### Purpose

• explain verification system  
• guide users  

---

### Content

• how verification works  
• how to use trust surfaces  
• what is public vs private  

---

---

# TRUST UI COMPONENTS

---

## Widget (External)

Location:
public/widget/gafaig-widget.js

---

### Purpose

• embeddable trust surface  
• fetch verification API  

---

### Displays

• entity  
• tier / band  
• status  
• validity  

---

---

## Verify Button Script

Location:
public/widget/gafaig-verify.js

---

### Purpose

• modal verification UI  
• replaces alert UX  

---

### States

• loading  
• verified  
• error  

---

---

## Badge

Route:
/badge/[registryId]

---

### Purpose

• visual certification signal  
• embeddable  

---

---

# DATA FLOW (UI)

Snowflake  
→ Query Layer (sfQuery)  
→ Page (server component)  
→ JSX render  
→ User  

---

# ERROR HANDLING

## Implemented

• try/catch in pages  
• fallback UI banner  

---

## Behavior

If Snowflake fails:

• page still renders  
• shows “Data temporarily unavailable”  
• prevents crash  

---

# DESIGN SYSTEM

## Visual Style

• clean  
• minimal  
• institutional  

---

## Patterns

• rounded containers  
• subtle borders  
• uppercase labels  
• consistent spacing  

---

## Colors

• black / white base  
• muted grayscale  
• semantic accents:
  - green (certified)  
  - amber (warning)  

---

# COMPONENT RELATIONSHIPS

Registry Page
→ Registry Detail
→ Verify API
→ Widget / Badge

Explorer
→ Registry
→ Countries / Organizations / Systems

Verify Page
→ Verify API
→ Public Key

---

# UI GUARANTEES

UI must always:

• reflect Snowflake truth  
• remain stable during failures  
• expose trust surfaces clearly  
• avoid internal logic  

---

# FUTURE UI EXPANSION

Planned:

• developer/integration page  
• improved badge UI  
• explorer depth  
• system-level trust UI  
• onboarding flows  

---

# SUMMARY

The UI layer is:

→ the public face of trust infrastructure  

It must:

• remain simple  
• remain accurate  
• remain verifiable  
• never introduce logic  

Everything resolves to:

→ the canonical registry record