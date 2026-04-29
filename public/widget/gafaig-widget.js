(function () {
  var VERSION = "1.4.0";

  function normalizeBaseUrl(baseUrl) {
    var raw =
      typeof baseUrl === "string" && baseUrl.trim()
        ? baseUrl.trim()
        : "https://www.gafaig.com";
    return raw.replace(/\/+$/, "");
  }

  function resolveBaseUrl(options) {
    return normalizeBaseUrl(options && options.baseUrl);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function isTrue(value) {
    if (value === true) return true;
    var normalized = normalize(value);
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }

  function hasCanonicalMessageString(data) {
    return !!(
      data &&
      data.proof &&
      typeof data.proof.messageString === "string" &&
      data.proof.messageString.trim()
    );
  }

  function hasSignature(data) {
    return !!(
      data &&
      data.proof &&
      typeof data.proof.signature === "string" &&
      data.proof.signature.trim()
    );
  }

  function isStructurallyVerified(data) {
    return !!(
      data &&
      data.ok === true &&
      data.verified === true &&
      data.record &&
      data.proof &&
      hasCanonicalMessageString(data) &&
      hasSignature(data) &&
      normalize(data.record.certificationStatus) === "certified" &&
      normalize(data.record.lifecycleStatus) === "active" &&
      normalize(data.record.visibilityStatus) === "public" &&
      isTrue(data.record.verificationEligible) &&
      isTrue(data.record.badgeEligible)
    );
  }

  function pillStyle(color) {
    return [
      "display:inline-flex",
      "align-items:center",
      "gap:6px",
      "padding:5px 9px",
      "border-radius:999px",
      "border:1px solid " + color,
      "font-size:11px",
      "font-weight:700",
      "line-height:1",
      "white-space:nowrap",
    ].join(";");
  }

  function renderError(el) {
    el.innerHTML =
      '<div style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "padding:8px 14px",
        "border-radius:999px",
        "border:1px solid #e5e7eb",
        "background:#fff",
        "font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
        "font-size:12px",
        "font-weight:700",
        "color:#be123c",
      ].join(";") +
      '">Verification unavailable</div>';
  }

  function renderVerified(el, registryId, options, record) {
    var baseUrl = resolveBaseUrl(options);
    var verifyUrl = baseUrl + "/verify/" + encodeURIComponent(registryId);
    var entityName = record && record.entityName ? record.entityName : "Certified record";
    var certificationStatus = record && record.certificationStatus ? record.certificationStatus : "CERTIFIED";
    var lifecycleStatus = record && record.lifecycleStatus ? record.lifecycleStatus : "active";

    el.innerHTML =
      '<div style="' +
      [
        "display:inline-flex",
        "flex-direction:column",
        "gap:10px",
        "max-width:360px",
        "padding:14px",
        "border-radius:18px",
        "border:1px solid #d1d5db",
        "background:#fff",
        "box-shadow:0 8px 24px rgba(0,0,0,0.06)",
        "font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
        "color:#111827",
      ].join(";") +
      '">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">' +
      '<div>' +
      '<div style="font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#2563eb;">GAFAIG</div>' +
      '<div style="margin-top:4px;font-size:15px;font-weight:800;line-height:1.2;">' +
      escapeHtml(entityName) +
      "</div>" +
      "</div>" +
      '<div style="' +
      pillStyle("#86efac") +
      'background:#f0fdf4;color:#166534;">✓ ' +
      escapeHtml(certificationStatus) +
      "</div>" +
      "</div>" +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
      '<span style="' +
      pillStyle("#d1d5db") +
      'background:#f9fafb;color:#374151;">Lifecycle: ' +
      escapeHtml(lifecycleStatus) +
      "</span>" +
      '<span style="' +
      pillStyle("#bfdbfe") +
      'background:#eff6ff;color:#1d4ed8;">Payload Integrity: Verified</span>' +
      "</div>" +
      '<a href="' +
      verifyUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "padding:8px 12px",
        "border-radius:999px",
        "border:1px solid #111827",
        "background:#111827",
        "color:#fff",
        "font-size:12px",
        "font-weight:800",
        "text-decoration:none",
      ].join(";") +
      '">View verification →</a>' +
      "</div>";
  }

  async function fetchVerify(id, options) {
    try {
      var res = await fetch(
        resolveBaseUrl(options) + "/api/verify/" + encodeURIComponent(id),
        {
          method: "GET",
          cache: "no-store",
        }
      );

      var text = await res.text();

      try {
        return text ? JSON.parse(text) : {};
      } catch (_e) {
        return { ok: false };
      }
    } catch (_err) {
      return { ok: false };
    }
  }

  async function initWidget(el, registryId, options) {
    var data = await fetchVerify(registryId, options);

    if (!isStructurallyVerified(data)) {
      renderError(el);
      return;
    }

    renderVerified(el, registryId, options, data.record);
  }

  function scan(options) {
    var nodes = document.querySelectorAll("[data-gafaig-id]");

    nodes.forEach(function (node) {
      if (node.getAttribute("data-gafaig-init")) return;

      node.setAttribute("data-gafaig-init", "true");

      var id = node.getAttribute("data-gafaig-id");

      if (!id) {
        renderError(node);
        return;
      }

      initWidget(node, id, options || {});
    });
  }

  function init(options) {
    scan(options || {});
  }

  window.gafaigWidget = {
    version: VERSION,
    init: init,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      scan({});
    });
  } else {
    scan({});
  }
})();