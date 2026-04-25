(function () {
  var VERSION = "1.3.1";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeBaseUrl(baseUrl) {
    var raw =
      typeof baseUrl === "string" && baseUrl.trim()
        ? baseUrl.trim()
        : "https://www.gafaig.com";

    return raw.replace(/\/+$/, "");
  }

  function resolveUrl(url, baseUrl) {
    var raw = String(url || "").trim();
    var base = normalizeBaseUrl(baseUrl);

    if (!raw) return "";
    if (raw.indexOf("http://") === 0 || raw.indexOf("https://") === 0) return raw;
    if (raw.indexOf("/") === 0) return base + raw;
    return base + "/" + raw;
  }

  function formatDate(value) {
    if (!value) return "—";
    var d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function normalizeStatus(value) {
    return String(value || "").trim().toLowerCase();
  }

  function badgeTone(status) {
    var s = normalizeStatus(status);

    if (s === "certified" || s === "active" || s === "signature valid" || s === "payload verified") {
      return {
        border: "#9fe0bb",
        background: "#e9f8ef",
        color: "#138a52"
      };
    }

    if (s === "expired") {
      return {
        border: "#fde68a",
        background: "#fffbeb",
        color: "#92400e"
      };
    }

    if (s === "revoked" || s === "signature invalid") {
      return {
        border: "#fecdd3",
        background: "#fff1f2",
        color: "#be123c"
      };
    }

    return {
      border: "#d4d4d8",
      background: "#ffffff",
      color: "#111827"
    };
  }

  function statusPill(label, status) {
    var tone = badgeTone(status || label);

    return (
      '<span style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "height:30px",
        "padding:0 12px",
        "border-radius:9999px",
        "border:1px solid " + tone.border,
        "background:" + tone.background,
        "color:" + tone.color,
        "font-size:11px",
        "font-weight:800",
        "letter-spacing:.08em",
        "text-transform:uppercase",
        "white-space:nowrap"
      ].join(";") +
      '">' +
      escapeHtml(label) +
      "</span>"
    );
  }

  function metric(label, value) {
    return (
      '<div style="border:1px solid #e5e7eb;border-radius:16px;padding:12px 14px;background:#ffffff;">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">' +
      escapeHtml(label) +
      "</div>" +
      '<div style="margin-top:8px;font-size:14px;font-weight:700;line-height:1.45;word-break:break-word;color:#111827;">' +
      escapeHtml(value || "—") +
      "</div>" +
      "</div>"
    );
  }

  function linkButton(href, label, primary) {
    return (
      '<a href="' +
      escapeHtml(href) +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "padding:10px 16px",
        "border-radius:9999px",
        primary ? "background:#111111" : "background:#ffffff",
        primary ? "color:#ffffff" : "color:#111111",
        "border:1px solid #111111",
        "text-decoration:none",
        "font-weight:800",
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:44px",
        "font-size:13px",
        "cursor:pointer"
      ].join(";") +
      '">' +
      escapeHtml(label) +
      "</a>"
    );
  }

  function copyButton(label, value) {
    return (
      '<button type="button" data-gafaig-copy="' +
      escapeHtml(value || "") +
      '" style="' +
      [
        "padding:10px 16px",
        "border-radius:9999px",
        "background:#ffffff",
        "color:#111111",
        "border:1px solid #d4d4d8",
        "font-weight:800",
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:44px",
        "font-size:13px",
        "cursor:pointer"
      ].join(";") +
      '">' +
      escapeHtml(label) +
      "</button>"
    );
  }

  function buildModal(data, registryId, options) {
    var record = (data && data.record) || {};
    var proof = (data && data.proof) || {};
    var baseUrl = normalizeBaseUrl(options && options.baseUrl);
    var registryUrl = resolveUrl(data && data.registryUrl ? data.registryUrl : "/registry/" + encodeURIComponent(registryId), baseUrl);
    var verifyPageUrl = resolveUrl(data && data.verifyUrl ? data.verifyUrl : "/verify/" + encodeURIComponent(registryId), baseUrl);
    var verifyJsonUrl = baseUrl + "/api/verify/" + encodeURIComponent(registryId);
    var keyUrl = resolveUrl(proof.verificationKeyUrl || "/api/.well-known/gafaig-public-key", baseUrl);

    var overlay = document.createElement("div");
    overlay.setAttribute("data-gafaig-verify-overlay", "true");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "GAFAIG verification modal");
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "background:rgba(0,0,0,.46)",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "padding:24px",
      "z-index:999999",
      "box-sizing:border-box"
    ].join(";");

    var panel = document.createElement("div");
    panel.style.cssText = [
      "width:100%",
      "max-width:720px",
      "background:#ffffff",
      "border:1px solid #e5e7eb",
      "border-radius:28px",
      "padding:24px",
      "box-shadow:0 18px 60px rgba(0,0,0,.24)",
      "font-family:Inter,Arial,Helvetica,sans-serif",
      "color:#111827",
      "max-height:calc(100vh - 48px)",
      "overflow:auto",
      "box-sizing:border-box"
    ].join(";");

    var verified = !!(data && data.verified);
    var entityName = record.entityName || record.recordName || "GAFAIG Record";
    var certificationStatus = record.certificationStatus || "—";
    var lifecycleStatus = record.lifecycleStatus || "—";
    var recordType = record.recordType || "—";
    var visibilityStatus = record.visibilityStatus || "—";
    var verificationEligible = record.verificationEligible == null ? "—" : String(record.verificationEligible);
    var badgeEligible = record.badgeEligible == null ? "—" : String(record.badgeEligible);
    var signatureStatus = verified ? "Signature Valid" : "Signature Invalid";
    var integrityStatus = proof.messageString && proof.signature ? "Payload Verified" : "Payload Unavailable";

    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;">' +
      '<div>' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#6b7280;">GAFAIG Verification</div>' +
      '<div style="margin-top:10px;font-size:30px;font-weight:850;line-height:1.1;letter-spacing:-.03em;color:#111827;">' +
      escapeHtml(entityName) +
      "</div>" +
      '<div style="margin-top:8px;font-size:14px;color:#52525b;">Registry ID: ' +
      escapeHtml(registryId) +
      "</div>" +
      "</div>" +
      '<button type="button" data-gafaig-close="true" aria-label="Close verification modal" style="' +
      [
        "border:1px solid #d4d4d8",
        "background:#ffffff",
        "border-radius:9999px",
        "min-width:42px",
        "height:42px",
        "cursor:pointer",
        "font-size:20px",
        "font-weight:800",
        "line-height:1"
      ].join(";") +
      '">×</button>' +
      "</div>" +
      '<div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap;">' +
      statusPill(signatureStatus, signatureStatus) +
      statusPill(integrityStatus, integrityStatus) +
      statusPill(certificationStatus, certificationStatus) +
      statusPill(lifecycleStatus, lifecycleStatus) +
      (proof.alg ? statusPill(proof.alg, proof.alg) : "") +
      "</div>" +
      '<div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:18px;padding:16px;background:#fafafa;">' +
      '<div style="font-size:13px;font-weight:800;color:#111827;">Verification result</div>' +
      '<p style="margin:8px 0 0;font-size:14px;line-height:1.7;color:#52525b;">' +
      (verified
        ? "This GAFAIG record is backed by a signed public verification payload. The record can be independently reviewed using the signature, message string, and public key endpoint."
        : "This GAFAIG record could not be confirmed as verified by the returned verification response.") +
      "</p>" +
      "</div>" +
      '<div style="margin-top:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">' +
      metric("Certification Status", certificationStatus) +
      metric("Lifecycle", lifecycleStatus) +
      metric("Record Type", recordType) +
      metric("Visibility", visibilityStatus) +
      metric("Certified At", formatDate(record.certifiedAt || null)) +
      metric("Valid To", formatDate(record.validTo || null)) +
      metric("Signed At", formatDate(proof.signedAt || null)) +
      metric("Key ID", proof.kid || "—") +
      metric("Verification Eligible", verificationEligible) +
      metric("Badge Eligible", badgeEligible) +
      "</div>" +
      '<div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:16px;padding:14px;background:#fafafa;">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Public key URL</div>' +
      '<div style="margin-top:8px;font-size:13px;line-height:1.6;word-break:break-all;color:#111827;">' +
      escapeHtml(keyUrl) +
      "</div>" +
      "</div>" +
      '<div style="margin-top:12px;border:1px solid #e5e7eb;border-radius:16px;padding:14px;background:#fafafa;">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Message string</div>' +
      '<pre style="margin:8px 0 0;white-space:pre-wrap;word-break:break-all;font-size:12px;line-height:1.6;color:#111827;">' +
      escapeHtml(proof.messageString || "—") +
      "</pre>" +
      "</div>" +
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">' +
      linkButton(registryUrl, "Open record", true) +
      linkButton(verifyPageUrl, "Open verify page", false) +
      linkButton(verifyJsonUrl, "Verify JSON", false) +
      linkButton(keyUrl, "Public key", false) +
      copyButton("Copy signed payload", proof.messageString || "") +
      copyButton("Copy signature", proof.signature || "") +
      "</div>" +
      '<div style="margin-top:16px;font-size:12px;line-height:1.6;color:#71717a;">' +
      "Powered by GAFAIG public trust infrastructure. Verification is based on a Snowflake-originated public record and a signed verification payload." +
      "</div>";

    overlay.appendChild(panel);

    return overlay;
  }

  function closeModal(overlay) {
    if (!overlay || !overlay.parentNode) return;
    overlay.parentNode.removeChild(overlay);
  }

  function ensureCoreSdk() {
    if (window.gafaig && typeof window.gafaig.verify === "function") {
      return window.gafaig;
    }

    if (window.GAFAIGSDK && typeof window.GAFAIGSDK.verify === "function") {
      return window.GAFAIGSDK;
    }

    if (window.GAFAIG && typeof window.GAFAIG.verify === "function") {
      return window.GAFAIG;
    }

    throw new Error("GAFAIG SDK not loaded");
  }

  async function copyText(text) {
    var value = String(text || "");
    if (!value) return false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (_error) {}

    try {
      var textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch (_error2) {
      return false;
    }
  }

  async function verifyGAFAIG(registryId, options) {
    var sdk = ensureCoreSdk();
    var cfg = options || {};
    var data = await sdk.verify(registryId, cfg);
    var overlay = buildModal(data, registryId, cfg);
    var priorFocus = document.activeElement;

    function handleClick(event) {
      var target = event.target;

      if (target === overlay || target.getAttribute("data-gafaig-close") === "true") {
        close();
        return;
      }

      var copyValue = target.getAttribute && target.getAttribute("data-gafaig-copy");
      if (copyValue != null) {
        var originalText = target.textContent || "Copy";
        copyText(copyValue).then(function (ok) {
          target.textContent = ok ? "Copied" : "Copy failed";
          setTimeout(function () {
            target.textContent = originalText;
          }, 1400);
        });
      }
    }

    function handleKeydown(event) {
      if (event.key === "Escape") {
        close();
      }
    }

    function close() {
      overlay.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
      closeModal(overlay);

      if (priorFocus && typeof priorFocus.focus === "function") {
        try {
          priorFocus.focus();
        } catch (_error) {}
      }
    }

    overlay.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);

    document.body.appendChild(overlay);

    var closeButton = overlay.querySelector("[data-gafaig-close='true']");
    if (closeButton && typeof closeButton.focus === "function") {
      closeButton.focus();
    }

    return data;
  }

  window.GAFAIG_VERIFY = {
    version: VERSION,
    open: verifyGAFAIG
  };

  window.verifyGAFAIG = verifyGAFAIG;
})();