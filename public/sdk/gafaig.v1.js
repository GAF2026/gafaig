(function () {
  var VERSION = "1.2.1";

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

  function assertRegistryId(registryId) {
    var value = String(registryId || "").trim();
    if (!value) throw new Error("GAFAIG SDK: registryId is required");
    return value;
  }

  function resolveElement(target) {
    if (!target) throw new Error("GAFAIG SDK: target is required");

    if (typeof target === "string") {
      var el = document.querySelector(target);
      if (!el) throw new Error("GAFAIG SDK: selector not found");
      return el;
    }

    if (target instanceof HTMLElement) return target;

    throw new Error("GAFAIG SDK: invalid target");
  }

  async function fetchJson(url) {
    try {
      var res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
      });

      var text = await res.text();
      var data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (_jsonError) {
        return {
          ok: false,
          verified: false,
          error: "Invalid JSON response",
        };
      }

      if (!res.ok) {
        return {
          ok: false,
          verified: false,
          registryId: data && data.registryId ? data.registryId : undefined,
          error: data && data.error ? data.error : "Request failed",
        };
      }

      return data;
    } catch (err) {
      return {
        ok: false,
        verified: false,
        error: err && err.message ? err.message : "Network failure",
      };
    }
  }

  function escapeHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeStatus(v) {
    return String(v || "").toLowerCase().trim();
  }

  function isTrue(value) {
    if (value === true) return true;
    var normalized = String(value == null ? "" : value).trim().toLowerCase();
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
      hasSignature(data)
    );
  }

  function safeBadgeState(verifyData) {
    if (!isStructurallyVerified(verifyData)) return "unavailable";

    var record = verifyData.record || {};
    var lifecycle = normalizeStatus(record.lifecycleStatus);
    var eligible = isTrue(record.badgeEligible);

    if (!eligible) return "unavailable";
    if (lifecycle === "revoked") return "revoked";
    if (lifecycle === "expired") return "expired";
    if (lifecycle === "active") return "certified";

    return "unavailable";
  }

  function fallbackLabel(status) {
    if (status === "certified") return "GAFAIG Certified";
    if (status === "expired") return "Certification Expired";
    if (status === "revoked") return "Certification Revoked";
    return "Verification Unavailable";
  }

  function buildVerifyApiUrl(id, opts) {
    return resolveBaseUrl(opts) + "/api/verify/" + encodeURIComponent(id);
  }

  function buildBadgeUrl(id, opts) {
    return resolveBaseUrl(opts) + "/api/badge/" + encodeURIComponent(id);
  }

  function buildVerifyUrl(id, opts) {
    return resolveBaseUrl(opts) + "/verify/" + encodeURIComponent(id);
  }

  async function verify(registryId, options) {
    var id = assertRegistryId(registryId);
    var data = await fetchJson(buildVerifyApiUrl(id, options));

    if (!isStructurallyVerified(data)) {
      return {
        ok: false,
        verified: false,
        registryId: id,
        error:
          data && data.error
            ? data.error
            : "Verification unavailable",
        record: data && data.record ? data.record : undefined,
        proof: data && data.proof ? data.proof : undefined,
      };
    }

    return data;
  }

  async function getBadge(registryId, options) {
    var id = assertRegistryId(registryId);
    var data = await fetchJson(buildBadgeUrl(id, options));

    if (!data || data.ok !== true) {
      return {
        ok: false,
        registryId: id,
        error:
          data && data.error
            ? data.error
            : "Badge unavailable",
      };
    }

    return data;
  }

  async function badge(target, config) {
    var cfg = config || {};
    var id = assertRegistryId(cfg.registryId);
    var el = resolveElement(target);

    var verifyData = await verify(id, cfg);
    var status = safeBadgeState(verifyData);
    var label = fallbackLabel(status);
    var verifyUrl = buildVerifyUrl(id, cfg);

    el.innerHTML =
      '<a href="' +
      escapeHtml(verifyUrl) +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "padding:8px 14px",
        "border-radius:999px",
        "border:1px solid #ccc",
        "background:#fff",
        "color:#111",
        "font-size:12px",
        "font-weight:700",
        "line-height:1",
        "text-decoration:none",
        "cursor:pointer",
      ].join(";") +
      '">' +
      escapeHtml(label) +
      "</a>";

    return el;
  }

  function scan(options) {
    var nodes = document.querySelectorAll("[data-gafaig-badge]");
    nodes.forEach(function (node) {
      if (node.getAttribute("data-init")) return;
      node.setAttribute("data-init", "true");

      badge(node, {
        registryId: node.getAttribute("data-gafaig-badge"),
        baseUrl: options && options.baseUrl,
      });
    });

    var modalNodes = document.querySelectorAll("[data-gafaig-open-verify]");
    modalNodes.forEach(function (node) {
      if (node.getAttribute("data-bound")) return;
      node.setAttribute("data-bound", "true");

      node.addEventListener("click", function () {
        if (window.verifyGAFAIG) {
          window.verifyGAFAIG(
            node.getAttribute("data-gafaig-open-verify"),
            options
          );
        }
      });
    });
  }

  function init(options) {
    scan(options || {});
  }

  window.gafaig = {
    version: VERSION,
    init: init,
    scan: scan,
    verify: verify,
    badge: badge,
    getBadge: getBadge,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      scan({});
    });
  } else {
    scan({});
  }
})();