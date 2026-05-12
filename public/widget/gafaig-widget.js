(function () {
  var SCRIPT = document.currentScript;
  var SCRIPT_SRC = SCRIPT && SCRIPT.src ? SCRIPT.src : "";
  var SCRIPT_URL = null;

  try {
    SCRIPT_URL = new URL(SCRIPT_SRC, window.location.href);
  } catch (error) {
    SCRIPT_URL = null;
  }

  function resolveOrigin() {
    if (SCRIPT_URL && SCRIPT_URL.origin) return SCRIPT_URL.origin;
    return window.location.origin;
  }

  var ORIGIN = resolveOrigin();
  var STYLE_ID = "gafaig-widget-styles-v10";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .gafaig-widget-root,
      .gafaig-widget-root * {
        box-sizing: border-box;
      }

      .gafaig-widget-root {
        width: 100%;
        color: #0b0b0c;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .gafaig-widget-loading {
        width: 100%;
        max-width: 460px;
        border: 1px solid rgba(0, 0, 0, 0.10);
        border-radius: 18px;
        background: #ffffff;
        padding: 14px;
        font-size: 12px;
        line-height: 1.6;
        font-weight: 600;
        color: rgba(11, 11, 12, 0.62);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.05);
      }

      .gafaig-widget-card {
        width: 100%;
        max-width: 460px;
        border: 1px solid rgba(0, 0, 0, 0.10);
        border-radius: 24px;
        background: #ffffff;
        padding: 18px;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.05);
      }

      .gafaig-widget-card-badge {
        max-width: 320px;
        padding: 14px;
        border-radius: 18px;
      }

      .gafaig-widget-topline {
        height: 4px;
        border-radius: 999px;
        background: #16a34a;
        margin-bottom: 14px;
      }

      .gafaig-widget-topline-error {
        background: #dc2626;
      }

      .gafaig-widget-topline-warning {
        background: #f59e0b;
      }

      .gafaig-widget-eyebrow {
        font-size: 10px;
        line-height: 1.2;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(11, 11, 12, 0.48);
      }

      .gafaig-widget-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }

      .gafaig-widget-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 24px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid rgba(0, 0, 0, 0.10);
        font-size: 10px;
        line-height: 1;
        font-weight: 700;
        letter-spacing: 0.10em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .gafaig-widget-chip-certified {
        background: #e9f8ef;
        color: #138a52;
        border-color: #9fe0bb;
      }

      .gafaig-widget-chip-expired {
        background: #fef3c7;
        color: #92400e;
        border-color: #fde68a;
      }

      .gafaig-widget-chip-revoked {
        background: #fee2e2;
        color: #991b1b;
        border-color: #fecaca;
      }

      .gafaig-widget-chip-verified {
        background: #eef4ff;
        color: #2457d6;
        border-color: #c9d9ff;
      }

      .gafaig-widget-chip-neutral {
        background: #f5f5f5;
        color: rgba(11, 11, 12, 0.62);
      }

      .gafaig-widget-chip-invalid {
        background: #fff1f2;
        color: #be123c;
        border-color: #fecdd3;
      }

      .gafaig-widget-chip-warning {
        background: #fffbeb;
        color: #92400e;
        border-color: #fde68a;
      }

      .gafaig-widget-chip-integrity {
        background: #f3e8ff;
        color: #7c3aed;
        border-color: #d8b4fe;
      }

      .gafaig-widget-title {
        margin: 14px 0 0;
        font-size: 20px;
        line-height: 1.1;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #0c1838;
      }

      .gafaig-widget-copy {
        margin-top: 8px;
        font-size: 13px;
        line-height: 1.65;
        color: rgba(11, 11, 12, 0.64);
      }

      .gafaig-widget-trust-panel {
        margin-top: 14px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 18px;
        background: rgba(0, 0, 0, 0.02);
        padding: 14px;
      }

      .gafaig-widget-trust-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .gafaig-widget-trust-title {
        font-size: 11px;
        line-height: 1.2;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(11, 11, 12, 0.48);
      }

      .gafaig-widget-trust-mark {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        background: #d8f3e2;
        border: 2px solid #91dfb2;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      .gafaig-widget-trust-mark-invalid {
        background: #fff1f2;
        border-color: #fecdd3;
      }

      .gafaig-widget-trust-mark-warning {
        background: #fffbeb;
        border-color: #fde68a;
      }

      .gafaig-widget-trust-mark svg {
        width: 20px;
        height: 20px;
        color: #0f9d58;
      }

      .gafaig-widget-trust-mark-invalid svg {
        color: #be123c;
      }

      .gafaig-widget-trust-mark-warning svg {
        color: #92400e;
      }

      .gafaig-widget-trust-copy {
        margin-top: 10px;
        font-size: 12px;
        line-height: 1.65;
        color: rgba(11, 11, 12, 0.68);
      }

      .gafaig-widget-grid {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .gafaig-widget-metric {
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 14px;
        background: #ffffff;
        padding: 10px 12px;
        min-height: 66px;
      }

      .gafaig-widget-metric-label {
        font-size: 9px;
        line-height: 1.2;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(11, 11, 12, 0.48);
      }

      .gafaig-widget-metric-value {
        margin-top: 6px;
        font-size: 13px;
        line-height: 1.35;
        font-weight: 700;
        color: #0b0b0c;
        word-break: break-word;
      }

      .gafaig-widget-id {
        margin-top: 10px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 14px;
        background: #ffffff;
        padding: 10px 12px;
      }

      .gafaig-widget-id .gafaig-widget-metric-value {
        font-size: 12px;
      }

      .gafaig-widget-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 14px;
      }

      .gafaig-widget-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 38px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid rgba(0, 0, 0, 0.10);
        text-decoration: none;
        font-size: 12px;
        line-height: 1;
        font-weight: 700;
        transition: background 120ms ease, color 120ms ease, border-color 120ms ease, opacity 120ms ease;
        cursor: pointer;
      }

      .gafaig-widget-btn-primary {
        background: #0b0b0c;
        border-color: #0b0b0c;
        color: #ffffff;
      }

      .gafaig-widget-btn-secondary {
        background: #ffffff;
        color: #0b0b0c;
      }

      .gafaig-widget-btn:hover {
        opacity: 0.92;
      }

      .gafaig-widget-footer {
        margin-top: 12px;
        font-size: 11px;
        line-height: 1.5;
        color: rgba(11, 11, 12, 0.46);
      }

      .gafaig-widget-footer a {
        color: inherit;
      }

      @media (max-width: 480px) {
        .gafaig-widget-card {
          max-width: 100%;
          padding: 16px;
          border-radius: 20px;
        }

        .gafaig-widget-grid {
          grid-template-columns: 1fr;
        }

        .gafaig-widget-title {
          font-size: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(value) {
    return String(value == null ? "" : value).trim().toLowerCase();
  }

  function isTrue(value) {
    if (value === true) return true;
    var normalized = normalize(value);
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }

  function isContractValid(record) {
    if (!record) return false;

    return (
      normalize(record.certificationStatus) === "certified" &&
      normalize(record.lifecycleStatus) === "active" &&
      normalize(record.visibilityStatus) === "public" &&
      isTrue(record.verificationEligible) &&
      isTrue(record.badgeEligible)
    );
  }

  function formatDate(value) {
    return value ? String(value) : "—";
  }

  function safeText() {
    for (var i = 0; i < arguments.length; i += 1) {
      var s = String(arguments[i] || "").trim();
      if (s) return s;
    }
    return "—";
  }

  function hasCanonicalMessageString(verifyData) {
    var proof = verifyData && verifyData.proof ? verifyData.proof : null;
    return !!(
      proof &&
      typeof proof.messageString === "string" &&
      proof.messageString.trim()
    );
  }

  function hasSignature(verifyData) {
    var proof = verifyData && verifyData.proof ? verifyData.proof : null;
    return !!(
      proof &&
      typeof proof.signature === "string" &&
      proof.signature.trim()
    );
  }

  function resolveTrustState(record) {
    if (!record) return "Unavailable";

    var certification = normalize(record.certificationStatus);
    var lifecycle = normalize(record.lifecycleStatus);

    if (certification !== "certified") {
      return "Not Certified";
    }

    if (lifecycle === "active") {
      return "Certified";
    }

    if (lifecycle === "expired") {
      return "Expired";
    }

    if (lifecycle === "revoked") {
      return "Revoked";
    }

    return "Unavailable";
  }

  function canonicalize(value) {
    if (value === null || value === undefined) return null;

    if (typeof value === "string") return value;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "boolean") return value;

    if (Array.isArray(value)) {
      return value.map(function (item) {
        return canonicalize(item);
      });
    }

    if (typeof value === "object") {
      var output = {};
      Object.keys(value)
        .sort()
        .forEach(function (key) {
          output[key] = canonicalize(value[key]);
        });
      return output;
    }

    return String(value);
  }

  function canonicalJsonStringify(value) {
    return JSON.stringify(canonicalize(value));
  }

  function base64ToBytes(value) {
    var clean = String(value || "")
      .trim()
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/\s+/g, "");

    while (clean.length % 4) {
      clean += "=";
    }

    var binary = window.atob(clean);
    var bytes = new Uint8Array(binary.length);

    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  function pemToArrayBuffer(pem) {
    var clean = String(pem || "")
      .replace(/-----BEGIN PUBLIC KEY-----/g, "")
      .replace(/-----END PUBLIC KEY-----/g, "")
      .replace(/\s+/g, "");

    return base64ToBytes(clean).buffer;
  }

  function extractPublicKeyPem(keyData) {
    if (!keyData || typeof keyData !== "object") return "";

    return (
      keyData.publicKeyPem ||
      keyData.public_key_pem ||
      keyData.pem ||
      keyData.publicKey ||
      keyData.public_key ||
      keyData.key ||
      ""
    );
  }

  function extractPublicJwk(keyData) {
    if (!keyData || typeof keyData !== "object") return null;

    if (keyData.kty === "OKP" && keyData.crv === "Ed25519" && keyData.x) {
      return keyData;
    }

    if (
      keyData.jwk &&
      keyData.jwk.kty === "OKP" &&
      keyData.jwk.crv === "Ed25519" &&
      keyData.jwk.x
    ) {
      return keyData.jwk;
    }

    if (keyData.x) {
      return {
        kty: "OKP",
        crv: "Ed25519",
        x: keyData.x,
        ext: true,
      };
    }

    return null;
  }

  async function importEd25519PublicKey(keyData) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("WebCrypto is unavailable");
    }

    var jwk = extractPublicJwk(keyData);

    if (jwk) {
      return window.crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "Ed25519" },
        false,
        ["verify"]
      );
    }

    var pem = extractPublicKeyPem(keyData);

    if (!pem) {
      throw new Error("Public key material unavailable");
    }

    return window.crypto.subtle.importKey(
      "spki",
      pemToArrayBuffer(pem),
      { name: "Ed25519" },
      false,
      ["verify"]
    );
  }

  async function verifyEd25519Signature(messageString, signature, keyData) {
    if (
      typeof messageString !== "string" ||
      !messageString.trim() ||
      typeof signature !== "string" ||
      !signature.trim()
    ) {
      return false;
    }

    var publicKey = await importEd25519PublicKey(keyData);
    var encodedMessage = new TextEncoder().encode(messageString);
    var signatureBytes = base64ToBytes(signature);

    return window.crypto.subtle.verify(
      { name: "Ed25519" },
      publicKey,
      signatureBytes,
      encodedMessage
    );
  }

  function resolveVerificationState(verifyData) {
    if (!verifyData) return "Unavailable";

    if (verifyData.__signatureVerified === true) {
      return "Signature Valid";
    }

    if (verifyData.__signatureVerified === false) {
      return "Signature Invalid";
    }

    return "Unavailable";
  }

  function resolveIntegrityState(verifyData) {
    if (!verifyData) return "Unavailable";

    if (verifyData.__payloadIntegrityVerified === true) {
      return "Payload Integrity: Verified";
    }

    if (verifyData.__payloadIntegrityVerified === false) {
      return "Payload Invalid";
    }

    return "Unavailable";
  }

  function resolveTrustCopy(entityName, validation, integrity) {
    if (
      validation === "Signature Valid" &&
      integrity === "Payload Integrity: Verified"
    ) {
      return (
        entityName +
        " is listed in the GAFAIG registry with independently verified signed data. The widget verified the Ed25519 signature against the public GAFAIG verification key."
      );
    }

    if (validation === "Signature Invalid" || integrity === "Payload Invalid") {
      return (
        entityName +
        " has an incomplete or invalid public verification proof. External systems must not reconstruct the canonical signed payload from display fields."
      );
    }

    return (
      entityName +
      " has a public GAFAIG record, but browser-side cryptographic verification is currently unavailable or incomplete."
    );
  }

  function metric(label, value) {
    return (
      '<div class="gafaig-widget-metric">' +
      '<div class="gafaig-widget-metric-label">' +
      esc(label) +
      "</div>" +
      '<div class="gafaig-widget-metric-value">' +
      esc(value) +
      "</div>" +
      "</div>"
    );
  }

  function renderError(el, registryId, message) {
    var safeRegistryId = registryId || "";
    var recordUrl = ORIGIN + "/registry/" + encodeURIComponent(safeRegistryId);
    var verifyApiUrl =
      ORIGIN + "/api/verify/" + encodeURIComponent(safeRegistryId);

    el.className = "gafaig-widget-root";
    el.innerHTML =
      '<div class="gafaig-widget-card">' +
      '<div class="gafaig-widget-topline gafaig-widget-topline-error"></div>' +
      '<div class="gafaig-widget-chip-row">' +
      '<span class="gafaig-widget-chip gafaig-widget-chip-invalid">Unavailable</span>' +
      '<span class="gafaig-widget-chip gafaig-widget-chip-neutral">GAFAIG</span>' +
      "</div>" +
      '<h3 class="gafaig-widget-title">GAFAIG verification unavailable</h3>' +
      '<p class="gafaig-widget-copy">' +
      esc(message || "Failed to fetch") +
      "</p>" +
      '<div class="gafaig-widget-actions">' +
      '<a class="gafaig-widget-btn gafaig-widget-btn-secondary" href="' +
      recordUrl +
      '" target="_blank" rel="noopener noreferrer">Open GAFAIG record</a>' +
      '<a class="gafaig-widget-btn gafaig-widget-btn-secondary" href="' +
      verifyApiUrl +
      '" target="_blank" rel="noopener noreferrer">View Proof JSON</a>' +
      "</div>" +
      "</div>";
  }

  function renderLoading(el) {
    el.className = "gafaig-widget-root";
    el.innerHTML =
      '<div class="gafaig-widget-loading">Loading GAFAIG verification…</div>';
  }

  function renderBadgeWidget(el, registryId, verifyData) {
    var record = verifyData && verifyData.record ? verifyData.record : null;
    var status = resolveTrustState(record);
    var eligibility = isContractValid(record) ? "Eligible" : "Not Eligible";
    var validation = resolveVerificationState(verifyData);
    var integrity = resolveIntegrityState(verifyData);
    var verifyPageUrl = ORIGIN + "/verify/" + encodeURIComponent(registryId);
    var verifyApiUrl = ORIGIN + "/api/verify/" + encodeURIComponent(registryId);
    var entityName = safeText(record && record.entityName, registryId);

    var statusChipClass =
      status === "Certified"
        ? "gafaig-widget-chip-certified"
        : status === "Expired"
          ? "gafaig-widget-chip-expired"
          : status === "Revoked"
            ? "gafaig-widget-chip-revoked"
            : "gafaig-widget-chip-neutral";

    var validationChipClass =
      validation === "Signature Valid"
        ? "gafaig-widget-chip-verified"
        : validation === "Signature Invalid"
          ? "gafaig-widget-chip-invalid"
          : "gafaig-widget-chip-neutral";

    var integrityChipClass =
      integrity === "Payload Integrity: Verified"
        ? "gafaig-widget-chip-integrity"
        : integrity === "Payload Invalid"
          ? "gafaig-widget-chip-invalid"
          : "gafaig-widget-chip-neutral";

    el.className = "gafaig-widget-root";
    el.innerHTML =
      '<div class="gafaig-widget-card gafaig-widget-card-badge">' +
      '<div class="gafaig-widget-topline' +
      (validation === "Signature Invalid" || integrity === "Payload Invalid"
        ? " gafaig-widget-topline-error"
        : "") +
      '"></div>' +
      '<div class="gafaig-widget-eyebrow">GAFAIG Trust Badge</div>' +
      '<div class="gafaig-widget-chip-row">' +
      '<span class="gafaig-widget-chip ' +
      statusChipClass +
      '">' +
      esc(status) +
      "</span>" +
      '<span class="gafaig-widget-chip gafaig-widget-chip-neutral">' +
      esc(eligibility) +
      "</span>" +
      '<span class="gafaig-widget-chip ' +
      validationChipClass +
      '">' +
      esc(validation) +
      "</span>" +
      '<span class="gafaig-widget-chip ' +
      integrityChipClass +
      '">' +
      esc(integrity) +
      "</span>" +
      "</div>" +
      '<h3 class="gafaig-widget-title">' +
      esc(entityName) +
      "</h3>" +
      '<p class="gafaig-widget-copy">Certified by GAFAIG and independently verifiable using cryptographic proof.</p>' +
      '<div class="gafaig-widget-actions">' +
      '<a class="gafaig-widget-btn gafaig-widget-btn-primary" href="' +
      verifyPageUrl +
      '" target="_blank" rel="noopener noreferrer">Verify This Record</a>' +
      '<a class="gafaig-widget-btn gafaig-widget-btn-secondary" href="' +
      verifyApiUrl +
      '" target="_blank" rel="noopener noreferrer">View Proof JSON</a>' +
      "</div>" +
      "</div>";
  }

  function renderWidget(el, registryId, verifyData) {
    var record = verifyData && verifyData.record ? verifyData.record : null;
    var proof = verifyData && verifyData.proof ? verifyData.proof : null;

    var entityName = safeText(record && record.entityName, registryId);
    var country = safeText(record && record.country);
    var status = resolveTrustState(record);
    var eligibility = isContractValid(record) ? "Eligible" : "Not Eligible";
    var validation = resolveVerificationState(verifyData);
    var integrity = resolveIntegrityState(verifyData);
    var validTo = formatDate((record && record.validTo) || null);
    var certifiedAt = formatDate((record && record.certifiedAt) || null);
    var signedAt = formatDate((proof && proof.signedAt) || null);
    var keyId = proof && proof.kid ? proof.kid : "—";
    var messageStringState = hasCanonicalMessageString(verifyData)
      ? "Available"
      : "Missing";
    var signatureState =
      verifyData.__signatureVerified === true
        ? "Verified (Ed25519)"
        : hasSignature(verifyData)
          ? "Available"
          : "Unavailable";

    var verifyPageUrl = ORIGIN + "/verify/" + encodeURIComponent(registryId);
    var verifyApiUrl = ORIGIN + "/api/verify/" + encodeURIComponent(registryId);
    var recordUrl = ORIGIN + "/registry/" + encodeURIComponent(registryId);

    var statusChipClass =
      status === "Certified"
        ? "gafaig-widget-chip-certified"
        : status === "Expired"
          ? "gafaig-widget-chip-expired"
          : status === "Revoked"
            ? "gafaig-widget-chip-revoked"
            : "gafaig-widget-chip-neutral";

    var validationChipClass =
      validation === "Signature Valid"
        ? "gafaig-widget-chip-verified"
        : validation === "Signature Invalid"
          ? "gafaig-widget-chip-invalid"
          : "gafaig-widget-chip-neutral";

    var integrityChipClass =
      integrity === "Payload Integrity: Verified"
        ? "gafaig-widget-chip-integrity"
        : integrity === "Payload Invalid"
          ? "gafaig-widget-chip-invalid"
          : "gafaig-widget-chip-neutral";

    var isFailure =
      validation === "Signature Invalid" || integrity === "Payload Invalid";

    var isUnavailable =
      validation === "Unavailable" || integrity === "Unavailable";

    var trustMarkClass = isFailure
      ? "gafaig-widget-trust-mark gafaig-widget-trust-mark-invalid"
      : isUnavailable
        ? "gafaig-widget-trust-mark gafaig-widget-trust-mark-warning"
        : "gafaig-widget-trust-mark";

    var toplineClass = isFailure
      ? "gafaig-widget-topline gafaig-widget-topline-error"
      : isUnavailable
        ? "gafaig-widget-topline gafaig-widget-topline-warning"
        : "gafaig-widget-topline";

    el.className = "gafaig-widget-root";
    el.innerHTML =
      '<div class="gafaig-widget-card">' +
      '<div class="' +
      toplineClass +
      '"></div>' +
      '<div class="gafaig-widget-eyebrow">GAFAIG Trust Widget</div>' +
      '<div class="gafaig-widget-chip-row">' +
      '<span class="gafaig-widget-chip ' +
      statusChipClass +
      '">' +
      esc(status) +
      "</span>" +
      '<span class="gafaig-widget-chip gafaig-widget-chip-neutral">' +
      esc(eligibility) +
      "</span>" +
      '<span class="gafaig-widget-chip ' +
      validationChipClass +
      '">' +
      esc(validation) +
      "</span>" +
      '<span class="gafaig-widget-chip ' +
      integrityChipClass +
      '">' +
      esc(integrity) +
      "</span>" +
      "</div>" +
      '<h3 class="gafaig-widget-title">' +
      esc(entityName) +
      "</h3>" +
      '<div class="gafaig-widget-copy" style="margin-top:4px;font-size:11px;color:rgba(11,11,12,0.55);">' +
      "Public Certification + Cryptographic Proof" +
      "</div>" +
      '<p class="gafaig-widget-copy">This record is certified by GAFAIG and independently verified using cryptographic proof. Anyone can validate its authenticity using the GAFAIG public key.</p>' +
      '<div class="gafaig-widget-trust-panel">' +
      '<div class="gafaig-widget-trust-header">' +
      '<div class="gafaig-widget-trust-title">Public trust summary</div>' +
      '<div class="' +
      trustMarkClass +
      '" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' +
      (isFailure
        ? '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
        : '<path d="M20 6 9 17l-5-5"></path>') +
      "</svg>" +
      "</div>" +
      "</div>" +
      '<div class="gafaig-widget-trust-copy">' +
      esc(resolveTrustCopy(entityName, validation, integrity)) +
      "</div>" +
      "</div>" +
      '<div class="gafaig-widget-grid">' +
      metric("Status", status) +
      metric("Eligibility", eligibility) +
      metric("Validation", validation) +
      metric("Integrity", integrity) +
      metric("Certified", certifiedAt) +
      metric("Valid To", validTo) +
      metric("Country", country) +
      metric("Signature", signatureState) +
      metric("Key ID", keyId) +
      metric("Signed At", signedAt) +
      metric("messageString", messageStringState) +
      "</div>" +
      '<div class="gafaig-widget-id">' +
      '<div class="gafaig-widget-metric-label">Registry ID</div>' +
      '<div class="gafaig-widget-metric-value">' +
      esc(registryId) +
      "</div>" +
      "</div>" +
      '<div class="gafaig-widget-actions">' +
      '<a class="gafaig-widget-btn gafaig-widget-btn-primary" href="' +
      verifyPageUrl +
      '" target="_blank" rel="noopener noreferrer">Verify This Record</a>' +
      '<a class="gafaig-widget-btn gafaig-widget-btn-secondary" href="' +
      recordUrl +
      '" target="_blank" rel="noopener noreferrer">Open Certification Record</a>' +
      '<a class="gafaig-widget-btn gafaig-widget-btn-secondary" href="' +
      verifyApiUrl +
      '" target="_blank" rel="noopener noreferrer">View Proof JSON</a>' +
      "</div>" +
      '<div class="gafaig-widget-footer">' +
      'Verified using GAFAIG public verification system · <a href="' +
      verifyApiUrl +
      '" target="_blank" rel="noopener noreferrer">View Signed Proof JSON</a>' +
      "</div>" +
      "</div>";
  }

  async function fetchJson(url) {
    var res = await fetch(url, {
      credentials: "omit",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Request failed with status " + res.status);
    }

    return res.json();
  }

  async function lockVerificationProof(verify) {
    var proof = verify && verify.proof ? verify.proof : null;

    verify.__signatureVerified = false;
    verify.__payloadIntegrityVerified = false;

    if (!proof || !hasCanonicalMessageString(verify) || !hasSignature(verify)) {
      return verify;
    }

    if (normalize(proof.alg) !== "ed25519") {
      return verify;
    }
   
    var keyUrl =
      typeof proof.verificationKeyUrl === "string" &&
      proof.verificationKeyUrl.trim()
        ? proof.verificationKeyUrl.trim()
        : ORIGIN + "/api/.well-known/gafaig-public-key";

    var keyData = await fetchJson(keyUrl);
    var verified = await verifyEd25519Signature(
      proof.messageString,
      proof.signature,
      keyData
    );

    verify.__signatureVerified = verified === true;
    verify.__payloadIntegrityVerified = verified === true;

    return verify;
  }

  async function mountOne(el) {
    var registryId =
      el.getAttribute("data-gafaig-id") ||
      el.getAttribute("data-registry-id") ||
      "";
    var mode = String(el.getAttribute("data-mode") || "").trim().toLowerCase();

    if (!registryId) return;

    injectStyles();
    renderLoading(el);

    try {
      var verifyUrl =
        ORIGIN + "/api/verify/" + encodeURIComponent(registryId);

      var verify = await fetchJson(verifyUrl);

      if (!verify || verify.ok !== true) {
        renderError(el, registryId, "Verification unavailable");
        return;
      }

      if (!hasCanonicalMessageString(verify) || !hasSignature(verify)) {
        renderError(el, registryId, "Verification proof incomplete");
        return;
      }

      verify = await lockVerificationProof(verify);

      if (mode === "badge") {
        renderBadgeWidget(el, registryId, verify);
        return;
      }

      renderWidget(el, registryId, verify);
    } catch (error) {
      var message =
        error && typeof error.message === "string"
          ? error.message
          : "Failed to fetch";
      renderError(el, registryId, message);
    }
  }

  function mountAll() {
    var nodes = document.querySelectorAll("[data-gafaig-id], [data-registry-id]");
    nodes.forEach(function (node) {
      if (node instanceof HTMLElement) {
        mountOne(node);
      }
    });
  }

  injectStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll, { once: true });
  } else {
    mountAll();
  }

  window.GAFAIGWidget = {
    mount: mountAll,
    origin: ORIGIN,
  };
})();