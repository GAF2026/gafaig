# GAFAIG — UI_COMPONENT_MAPPING.md
UI System + Component Mapping
Last Updated: 2026-03-31

---

# 🚨 SYSTEM RULE

UI is a **pure presentation layer**.

UI must NOT:

• Compute scores  
• Modify certification  
• Contain business logic  
• Query Snowflake directly  

ALL UI must consume:

Query Layer → API → UI

---

# 🌍 UI SYSTEM OVERVIEW

GAFAIG UI consists of:

• Public Pages (Trust + Narrative)  
• Registry Pages (Certification Records)  
• Badge Surface (Portable Trust Artifact)  
• Explorer (Discovery Layer)  
• Admin (Internal Workflow)  

---

# 🏠 PUBLIC PAGES

## 1. Home

File:

app/page.tsx

Purpose:

• Introduce GAFAIG  
• Position as trust infrastructure  
• Explain what GAFAIG is and why it exists  

---

## 2. Mission

File:

app/mission/page.tsx

Purpose:

• Define purpose of GAFAIG  
• Global governance narrative  

---

## 3. Framework

File:

app/framework/page.tsx

Purpose:

• Explain verification model  
• Explain deterministic scoring  
• Explain public/private separation  

---

## 4. Demo

File:

app/demo/page.tsx

Purpose:

• Walkthrough of system  
• Example use cases  

---

# 📊 REGISTRY SYSTEM UI

## 5. Registry List

File:

app/registry/page.tsx

Purpose:

• Display all certified records  
• Provide entry into registry  

Data Source:

/api/registry → V_REGISTRY_PUBLIC  

---

## 6. Registry Detail Page

File:

app/registry/[registryId]/page.tsx

Purpose:

• Show certification record  
• Display trust panel  
• Link badge + verification  

---

### Sections

### Header

• Entity name  
• Certification status  
• Tier / Band  

---

### Certification Summary

• Registry ID  
• Country  
• Certified at  
• Valid to  

---

### Trust Panel (CRITICAL)

Purpose:

• Expose verification surface  

Includes:

• Copyable registry ID  
• Verification endpoint  
• Badge link  
• Proof access  

---

### Linked Systems

• List of AI systems under certification  
• Links to system detail pages  

---

## 7. AI Systems List

File:

app/registry/ai-systems/page.tsx

Purpose:

• Show all certified AI systems  

---

## 8. AI System Detail

File:

app/registry/ai-systems/[systemId]/page.tsx

Purpose:

• Show system metadata  
• Link back to registry certification  

---

# 🖼️ BADGE SURFACE

## 9. Badge Render

File:

app/badge/[registryId]/route.ts

Purpose:

• Render SVG certification badge  

---

### Badge Includes

• Entity name  
• Certification status  
• Registry ID  
• Country  
• Tier / Band  
• Valid to  
• Verification endpoint  

---

### Design Requirements

• Must match registry data  
• Must not overflow  
• Must scale properly  
• Must be embeddable  

---

# 🔐 VERIFICATION UI

## 10. Verification API Surface

File:

app/api/verify/[registryId]/route.ts

UI Usage:

• Triggered from registry page  
• Opens proof JSON  

---

## 11. Public Key Endpoint

File:

app/api/.well-known/gafaig-public-key/route.ts

UI Usage:

• Referenced in verification instructions  
• Not directly visible to end users  

---

# 🔍 EXPLORER SYSTEM

## 12. Explorer Landing

File:

app/explorer/page.tsx

Purpose:

• Entry point into discovery layer  

---

## 13. Explorer Countries

File:

app/explorer/countries/page.tsx

Purpose:

• Group certifications by country  

---

## 14. Explorer Organizations

File:

app/explorer/organizations/page.tsx

Purpose:

• Group by entity/organization  

---

## 15. Explorer Systems

File:

app/explorer/systems/page.tsx

Purpose:

• Display system cards  
• Link to system detail  

---

## 16. Explorer Map

File:

app/explorer/map/page.tsx

Purpose:

• Geographic visualization  

---

# 🔐 ADMIN UI

## 17. Admin Login

File:

app/admin/login/page.tsx

Purpose:

• Authentication  

---

## 18. Applications

File:

app/admin/applications/page.tsx

Purpose:

• Intake of applications  

---

## 19. Verification Workflow

Files:

app/admin/verification/*

Includes:

• findings  
• evidence  
• scoring  
• decisions  
• publish  

---

# 🧩 SHARED UI COMPONENTS

Location:

app/_components/
components/registry/

---

## Common Components

### PublicPageHero

• Page headers  
• Titles + descriptions  

---

### PublicButtonLink

• Consistent CTA buttons  

---

### RegistryCertificationSummary

• Summary panel on registry detail  

---

### RegistryHeaderPanel

• Header layout  

---

### RegistryVerificationPanel

• Trust panel UI  

---

# 🎨 DESIGN PRINCIPLES

## 1. Trust First

Every page must answer:

"Can I trust this certification?"

---

## 2. Clarity Over Decoration

• No visual noise  
• No unnecessary UI  

---

## 3. Consistency

• Same spacing system  
• Same typography  
• Same card layout  

---

## 4. Data Integrity

UI must reflect:

• Snowflake views  
• Exact certification values  

---

## 5. Public vs Private Separation

UI must NEVER:

• Show evidence  
• Show findings  
• Show internal scoring details  

---

# ⚠️ CURRENT UI GAPS

## 1. Verification UX

Missing:

• “Verify this certification” interactive UI  
• Step-by-step verification explanation  
• Developer verification guidance  

---

## 2. Trust Panel Enhancements

Needed:

• Signature explanation  
• Public key reference  
• Copyable verification payload  

---

## 3. Explorer Phase 2

Missing:

• Filters (country, tier, band)  
• Aggregations  
• Metrics  

---

## 4. Badge UX

Future:

• Embed code snippet  
• Copy badge link  
• Integration instructions  

---

# 🚀 NEXT UI WORK

## Phase: Verification UX

### Build:

• Verification panel expansion  
• External verification instructions  
• Developer examples  

---

## Phase: Trust Standardization

### Align:

• Registry page  
• Badge  
• Proof  
• API  

---

# 🧠 DESIGN PRINCIPLE

UI is:

A **trust surface**

NOT:

• A dashboard  
• A data explorer  

---

# END OF UI COMPONENT MAPPING