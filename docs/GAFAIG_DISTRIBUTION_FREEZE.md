# GAFAIG_DISTRIBUTION_FREEZE.md

Last Updated: 2026-05-11

## PURPOSE

This document defines the canonical distribution freeze contract for GAFAIG.

GAFAIG is deterministic global AI governance infrastructure.

This file governs the public trust distribution layer across:

- SDK
- widgets
- badges
- verification modal
- public proof surfaces
- external embeds
- public key verification
- developer integrations
- browser-side verification
- future enterprise distribution
- future regulator distribution
- future federation surfaces

The purpose of this freeze is to prevent drift between GAFAIG’s deterministic Snowflake trust core and the external distribution surfaces that expose, verify, render, and explain public certification records.

Distribution does not create trust.

Distribution carries trust.

---

# NON-NEGOTIABLE RULES

Snowflake is the source of truth.

API is pass-through only.

UI is display only.

Registry is append-only.

Certification is private.

Publication is explicit.

Verification uses `proof.messageString` only.

AI is advisory only.

Humans approve.

Snowflake decides.

Registry publishes.

Proof verifies.

Widgets are not proof.

Badges are not proof.

Screenshots are not proof.

Distribution is not authority.

---

# CORE DISTRIBUTION PRINCIPLE

GAFAIG public trust distribution must preserve one canonical trust hierarchy:

Snowflake
→ Public Registry View
→ Verify API
→ proof.messageString
→ Signature
→ Public Key
→ External Verification
→ SDK / Widget / Badge / UI Rendering

No distribution layer may compute, infer, override, reconstruct, or mutate trust.

---

# DISTRIBUTION FREEZE OBJECTIVE

The distribution layer must be frozen so that:

- public trust semantics remain stable
- external integrations remain backward compatible
- widgets fail closed
- SDK behavior remains deterministic
- verification modal language remains aligned
- proof terminology remains consistent
- public key verification remains portable
- future versions can be introduced without breaking historical trust

This freeze is required before broad enterprise, regulator, developer, and external ecosystem distribution.

---

# CANONICAL DISTRIBUTION SURFACES

The canonical distribution surfaces are:

- `public/sdk/gafaig.js`
- `public/sdk/gafaig.v1.js`
- `public/widget/gafaig-widget.js`
- `public/widget/gafaig-widget.v1.js`
- `public/widget/gafaig-verify.js`
- `public/widget/gafaig-verify.v1.js`
- `/api/verify/[registryId]`
- `/api/.well-known/gafaig-public-key`
- `/verify/[registryId]`
- `/registry/[registryId]`
- `/developers`
- `/public-key`

---

# VERSIONED FILE RULE

Versioned files are stable public contracts.

The following files must not receive breaking changes:

- `/sdk/gafaig.v1.js`
- `/widget/gafaig-widget.v1.js`
- `/widget/gafaig-verify.v1.js`

Breaking changes require new files:

- `/sdk/gafaig.v2.js`
- `/widget/gafaig-widget.v2.js`
- `/widget/gafaig-verify.v2.js`

Latest aliases may point to the current production version:

- `/sdk/gafaig.js`
- `/widget/gafaig-widget.js`
- `/widget/gafaig-verify.js`

But latest aliases must remain backward compatible unless clearly migrated.

---

# SDK OWNERSHIP RULE

The SDK should own reusable verification primitives.

The SDK may:

- call `/api/verify/[registryId]`
- expose `gafaig.verify()`
- expose `gafaig.getPublicKey()`
- expose widget helpers
- expose badge helpers
- expose verification modal helpers
- normalize fail-closed behavior
- expose public integration helpers

The SDK must not:

- compute certification truth
- compute lifecycle truth
- compute badge eligibility
- compute verification eligibility
- reconstruct `proof.messageString`
- verify from parsed JSON fields
- mutate proof payloads
- override API output

---

# WIDGET OWNERSHIP RULE

Widgets are rendering surfaces.

Widgets may:

- render certification status
- render lifecycle status
- render eligibility status
- render proof availability
- render signature validity
- link to `/verify/[registryId]`
- link to Proof JSON
- fail closed when verification fails

Widgets must not:

- create trust
- compute trust
- infer trust
- override the verify API
- reconstruct signed payloads
- verify from display fields
- expose private governance data
- expose findings
- expose evidence
- expose scoring internals
- expose reviewer materials
- expose governance execution telemetry
- expose private workflow state

---

# VERIFICATION MODAL OWNERSHIP RULE

The verification modal is an explanation and interaction layer.

The modal may:

- display public verification state
- display signature status
- display payload integrity status
- display proof metadata
- display public key URL
- display canonical signed message string
- allow copying signed payload
- allow copying signature
- allow copying full Proof JSON
- link to certification record
- link to proof page
- link to public key endpoint

The modal must not:

- reconstruct trust
- recompute certification
- recompute lifecycle
- mutate proof
- hide verification failure
- treat UI rendering as proof
- treat copied JSON fields as verification authority

---

# BADGE OWNERSHIP RULE

Badges are visual indicators only.

Badges may:

- show certified state
- show expired state
- show revoked state
- show unavailable state
- link to `/verify/[registryId]`

Badges must not:

- serve as proof
- replace the verify API
- replace signature validation
- override lifecycle state
- display trust when proof is incomplete
- display trust when lifecycle is invalid

---

# FAIL-CLOSED DISTRIBUTION RULE

Every distribution surface must fail closed.

Failure states include:

- missing registry record
- unpublished record
- missing proof
- missing `proof.messageString`
- missing signature
- invalid signature
- unsupported algorithm
- missing public key
- invalid lifecycle
- revoked record
- expired record
- malformed response
- network failure
- invalid JSON response

Failure must render as:

- unavailable
- invalid
- expired
- revoked
- not trusted

Never render failed verification as trusted.

---

# PROOF.MESSAGESTRING RULE

All verification must use:

`proof.messageString`

exactly as returned.

Distribution layers must never verify using:

- reconstructed JSON
- sorted client objects
- display fields
- parsed record fields
- UI text
- copied card values
- normalized object output

The only valid verification input is:

- exact `proof.messageString`
- exact `proof.signature`
- matching public key

---

# PUBLIC TERMINOLOGY FREEZE

Use:

- Public Certification Record
- Public Proof Record
- Verify This Record
- Open Certification Record
- Open Full Proof Page
- View Proof JSON
- Signature Valid
- Signature Invalid
- Payload Integrity: Verified
- Payload Invalid
- Certification
- Lifecycle
- Publication-safe
- Public trust surface
- Deterministic global AI governance infrastructure

Avoid:

- Raw Verification JSON
- Registry Record when referring to public certification detail pages
- Open JSON
- Trust score
- AI-certified
- AI-approved
- AI-verified
- Application ID in public UI
- Case ID in public UI

---

# PUBLIC DATA BOUNDARY

Distribution surfaces must never expose:

- findings
- evidence
- scoring internals
- reviewer materials
- recommendation systems
- governance execution telemetry
- private workflow state
- unpublished certification records
- internal governance state
- private AI governance outputs
- simulation outputs as trust authority

---

# PUBLIC CERTIFICATION RECORD BOUNDARY

Public certification records may expose publication-safe metadata only.

Allowed public trust fields include:

- registry ID
- entity name
- entity type
- country
- certification status
- certified date
- valid from
- valid to
- published date
- renewal status
- lifecycle status
- visibility status
- verification eligibility
- badge eligibility

Application ID and Case ID may remain in machine-readable proof contracts only when required for deterministic signature continuity.

They must not be displayed as public UI labels.

---

# DISTRIBUTION CONTRACT HIERARCHY

The canonical hierarchy is:

1. Snowflake public registry contract
2. Verify API
3. Proof object
4. Public key endpoint
5. SDK verification primitives
6. Widget rendering
7. Badge rendering
8. Verification modal
9. Public UI pages
10. External integrations

Lower layers must never override higher layers.

---

# BROWSER-SIDE VERIFICATION RULE

Browser-side verification may validate Ed25519 signatures when supported.

Browser-side verification must:

- use WebCrypto where available
- use `proof.messageString`
- use `proof.signature`
- fetch GAFAIG public key
- fail closed on unsupported or failed verification
- preserve lifecycle separation

Browser-side verification must not:

- reconstruct message strings
- trust host page data
- trust copied JSON fields
- trust widget-rendered values
- bypass the verify endpoint

---

# SDK PUBLIC API FREEZE

The SDK public surface should preserve:

- `gafaig.version`
- `gafaig.init()`
- `gafaig.scan()`
- `gafaig.verify(registryId, options)`
- `gafaig.getBadge(registryId, options)`
- `gafaig.getPublicKey(options)`
- `gafaig.badge(target, config)`
- `gafaig.widget(target, config)`
- `gafaig.openVerify(registryId, options)`
- `gafaig.ensureWidget(options)`
- `gafaig.ensureVerifyModal(options)`

Breaking changes to this surface require a new SDK major version.

---

# WIDGET PUBLIC API FREEZE

The widget must support:

- `data-gafaig-id`
- `data-registry-id`
- optional `data-mode="badge"`
- automatic scan on page load
- manual mount through `window.GAFAIGWidget.mount`

The widget must link to:

- `/verify/[registryId]`
- `/registry/[registryId]`
- `/api/verify/[registryId]`

The widget must display proof state without claiming to be proof.

---

# VERIFY MODAL PUBLIC API FREEZE

The verification modal must support:

- `window.verifyGAFAIG(registryId, options)`
- `window.GAFAIG_VERIFY.open(registryId, options)`

The modal must allow users to:

- open certification record
- open verify page
- view Proof JSON
- view public key
- copy signed payload
- copy signature
- copy full JSON

The modal must explain that verification depends on:

- Snowflake-originated public record
- `proof.messageString`
- Ed25519 signature
- public key endpoint

---

# EXTERNAL EMBED CONTRACT

External integrations may embed GAFAIG verification using:

```html
<div data-gafaig-id="GAFAIG-00000001"></div>
<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>

Version-pinned embed:

<div data-gafaig-id="GAFAIG-00000001"></div>
<script src="https://www.gafaig.com/widget/gafaig-widget.v1.js"></script>

Badge mode:

<div data-gafaig-id="GAFAIG-00000001" data-mode="badge"></div>
<script src="https://www.gafaig.com/widget/gafaig-widget.v1.js"></script>

SDK usage:

<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>
<script>
  gafaig.verify("GAFAIG-00000001").then(console.log);
</script>
PUBLIC KEY DISTRIBUTION RULE

The canonical public key endpoint is:

/api/.well-known/gafaig-public-key

Distribution surfaces must fetch public key material from this endpoint.

They must not hardcode private key material.

They must not expose private keys.

They must match kid where applicable.

CRYPTOGRAPHIC BREAKING CHANGE RULE

The following are breaking changes:

changing signing algorithm
changing kid without version planning
changing signed payload fields
changing signed field order
changing proof.messageString construction
changing proof object structure
removing proof fields
removing public key endpoint fields
changing verification semantics
changing fail-closed behavior

Breaking cryptographic changes require:

documentation update
SDK update
widget update
verification modal update
public key page update
developers page update
external test update
migration plan
IMMUTABILITY RULE

Distribution must never mutate historical trust records.

Historical records must remain verifiable.

Historical signatures must remain valid.

Historical proof pages must remain accessible.

Historical registry IDs must not be reused.

Versioning must preserve backward verification.

DISTRIBUTION TEST MATRIX

Before broad distribution, test:

/api/verify/GAFAIG-00000001
/verify/GAFAIG-00000001
/registry/GAFAIG-00000001
/registry/ai-systems/GAFAIG-00000001
/api/.well-known/gafaig-public-key
/developers
/public-key
/widget-preview/GAFAIG-00000001
external embed page
SDK console verification
widget badge mode
widget full mode
verification modal open flow
invalid registry ID
expired record
revoked record
unpublished record
malformed response
tampered signature test
tampered messageString test
CANONICAL CONSOLE TESTS

SDK version:

gafaig.version

Verify call:

gafaig.verify("GAFAIG-00000001").then(console.log)

Public key:

gafaig.getPublicKey().then(console.log)

Open modal:

gafaig.openVerify("GAFAIG-00000001").then(console.log)

Expected:

ok: true
verified: true
record present
proof present
proof.messageString present
proof.signature present
public key available
no reconstructed payload required
REQUIRED FAIL-CLOSED TESTS

Invalid ID:

gafaig.verify("INVALID-ID").then(console.log)

Expected:

ok: false
verified: false
not trusted
no trusted badge

Tampered payload test:

modify proof.messageString
keep same signature
verification must fail

Tampered signature test:

keep proof.messageString
modify signature
verification must fail

Missing proof test:

remove proof.messageString
verification must fail
DISTRIBUTION DRIFT RISKS

The primary risks are:

SDK, widget, and modal diverging
latest file behavior drifting from versioned file behavior
terminology drifting between pages
widget showing trust without proof
modal verifying from reconstructed JSON
external consumers misunderstanding proof
breaking v1 without creating v2
exposing internal governance telemetry publicly
treating AI governance observability as certification authority

These risks must be actively prevented.

PHASE 8 STATUS

This document marks:

PHASE 8 — TRUST DISTRIBUTION FREEZE

Primary objectives:

freeze trust distribution semantics
preserve cryptographic verification integrity
prevent SDK/widget/modal drift
align terminology across public trust surfaces
preserve fail-closed behavior
prepare GAFAIG for external enterprise and regulator distribution
NEXT ENGINEERING WORK

After this document is added, perform:

SDK audit
widget audit
verify modal audit
latest vs versioned file comparison
terminology alignment
fail-closed testing
external embed testing
public key verification testing
developer page update if needed
final distribution freeze validation
DO NOT BREAK

Do not:

reconstruct proof.messageString
verify from JSON fields
compute trust in UI
compute trust in SDK
compute trust in widget
expose private key
expose scoring internals
expose findings
expose evidence
expose reviewer materials
expose governance telemetry publicly
mutate registry snapshots
create additional seed files
rename Proof JSON back to Raw Verification JSON
rename Certification Record back to Registry Record
display Application ID publicly
display Case ID publicly
treat widgets as proof
treat badges as proof
treat AI governance intelligence as certification authority
treat observability as verification authority
FINAL PRINCIPLE

GAFAIG distribution is not marketing.

GAFAIG distribution is portable deterministic trust infrastructure.

The public record is Snowflake-originated.

The proof is cryptographic.

The registry is append-only.

The verification endpoint is canonical.

The messageString is authoritative.

The signature verifies.

The public key validates.

The widget renders.

The badge signals.

The modal explains.

The SDK distributes.

Trust remains deterministic.

END OF FILE