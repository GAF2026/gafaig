(function () {
  var VERSION = "1.2.0";

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
      var data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    } catch (err) {
      return {
        ok: false,
        error: err && err.message ? err.message : "Network failure",
      };
    }
  }

  function escapeHtml(v) {
    return String(v || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normalizeStatus(v) {
    return String(v || "").toLowerCase().trim();
  }

  function safeBadgeState(data) {
    var lifecycle = normalizeStatus(data.lifecycleStatus);
    var eligible = String(data.badgeEligible).toLowerCase();

    if (eligible !== "true") return "unavailable";
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

  function buildBadgeUrl(id, opts) {
    return resolveBaseUrl(opts) + "/api/badge/" + encodeURIComponent(id);
  }

  function buildVerifyUrl(id, opts) {
    return resolveBaseUrl(opts) + "/verify/" + encodeURIComponent(id);
  }

  async function getBadge(registryId, options) {
    var id = assertRegistryId(registryId);
    return fetchJson(buildBadgeUrl(id, options));
  }

  async function badge(target, config) {
    var cfg = config || {};
    var id = assertRegistryId(cfg.registryId);
    var el = resolveElement(target);

    var data = await getBadge(id, cfg);

    var status = safeBadgeState(data || {});
    var label = fallbackLabel(status);

    var verifyUrl = buildVerifyUrl(id, cfg);

    el.innerHTML =
      '<a href="' +
      verifyUrl +
      '" target="_blank" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "padding:8px 14px",
        "border-radius:999px",
        "border:1px solid #ccc",
        "background:#fff",
        "font-size:12px",
        "font-weight:700",
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
          window.verifyGAFAIG(node.getAttribute("data-gafaig-open-verify"), options);
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