(function () {
  var VERSION = "1.1.1";

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

    if (!value) {
      throw new Error("GAFAIG SDK: registryId is required");
    }

    return value;
  }

  function resolveElement(target) {
    if (!target) {
      throw new Error("GAFAIG SDK: target is required");
    }

    if (typeof target === "string") {
      var el = document.querySelector(target);

      if (!el) {
        throw new Error('GAFAIG SDK: target selector not found: "' + target + '"');
      }

      return el;
    }

    if (target instanceof HTMLElement) {
      return target;
    }

    throw new Error("GAFAIG SDK: target must be a selector or HTMLElement");
  }

  async function fetchJson(url) {
    var res = await fetch(url, {
      method: "GET",
      credentials: "omit",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    var text = await res.text();
    var data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch (_error) {
      throw new Error("GAFAIG SDK: invalid JSON response");
    }

    if (!res.ok) {
      var message =
        data && typeof data.error === "string"
          ? data.error
          : "Request failed with status " + res.status;

      throw new Error("GAFAIG SDK: " + message);
    }

    return data;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildVerifyUrl(registryId, options) {
    return resolveBaseUrl(options) + "/api/verify/" + encodeURIComponent(registryId);
  }

  function buildBadgeUrl(registryId, options) {
    return resolveBaseUrl(options) + "/api/badge/" + encodeURIComponent(registryId);
  }

  function buildPublicKeyUrl(options) {
    return resolveBaseUrl(options) + "/api/.well-known/gafaig-public-key";
  }

  function buildWidgetScriptUrl(options) {
    return resolveBaseUrl(options) + "/widget/gafaig-widget.js";
  }

  function buildVerifyScriptUrl(options) {
    return resolveBaseUrl(options) + "/widget/gafaig-verify.js";
  }

  function normalizeStatus(value) {
    return String(value || "").trim().toLowerCase();
  }

  function fallbackBadgeLabel(status) {
    if (status === "certified") return "GAFAIG Certified";
    if (status === "expired") return "GAFAIG Certification Expired";
    if (status === "revoked") return "GAFAIG Certification Revoked";
    return "GAFAIG Verification Unavailable";
  }

  async function verify(registryId, options) {
    var id = assertRegistryId(registryId);
    return fetchJson(buildVerifyUrl(id, options));
  }

  async function getBadge(registryId, options) {
    var id = assertRegistryId(registryId);
    return fetchJson(buildBadgeUrl(id, options));
  }

  async function getPublicKey(options) {
    return fetchJson(buildPublicKeyUrl(options));
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');

      if (existing) {
        if (existing.getAttribute("data-gafaig-loaded") === "true") {
          resolve();
          return;
        }

        existing.addEventListener(
          "load",
          function () {
            existing.setAttribute("data-gafaig-loaded", "true");
            resolve();
          },
          { once: true }
        );

        existing.addEventListener(
          "error",
          function () {
            reject(new Error("GAFAIG SDK: failed to load script " + src));
          },
          { once: true }
        );

        return;
      }

      var script = document.createElement("script");
      script.src = src;
      script.async = true;

      script.onload = function () {
        script.setAttribute("data-gafaig-loaded", "true");
        resolve();
      };

      script.onerror = function () {
        reject(new Error("GAFAIG SDK: failed to load script " + src));
      };

      document.head.appendChild(script);
    });
  }

  async function render(target, config) {
    var cfg = config || {};
    var registryId = assertRegistryId(cfg.registryId);
    var el = resolveElement(target);

    el.setAttribute("data-gafaig-id", registryId);

    if (cfg.mode && String(cfg.mode).trim()) {
      el.setAttribute("data-mode", String(cfg.mode).trim());
    } else {
      el.removeAttribute("data-mode");
    }

    await loadScript(buildWidgetScriptUrl(cfg));

    if (
      window.GAFAIGWidget &&
      typeof window.GAFAIGWidget.mount === "function"
    ) {
      window.GAFAIGWidget.mount();
      return el;
    }

    throw new Error("GAFAIG SDK: widget runtime not available after load");
  }

  async function openVerify(registryId, options) {
    var id = assertRegistryId(registryId);
    var cfg = options || {};
    var baseUrl = resolveBaseUrl(cfg);

    await loadScript(buildWidgetScriptUrl(cfg));
    await loadScript(buildVerifyScriptUrl(cfg));

    if (typeof window.verifyGAFAIG === "function") {
      return window.verifyGAFAIG(id, { baseUrl: baseUrl });
    }

    throw new Error("GAFAIG SDK: verify modal runtime not available after load");
  }

  async function badge(target, config) {
    var cfg = config || {};
    var registryId = assertRegistryId(cfg.registryId);
    var el = resolveElement(target);
    var data = await getBadge(registryId, cfg);

    if (!data || data.ok !== true) {
      throw new Error("GAFAIG SDK: invalid badge response");
    }

    var badgeStatus =
      data.badge && typeof data.badge.status === "string"
        ? normalizeStatus(data.badge.status)
        : "unavailable";

    var badgeLabel =
      data.badge && typeof data.badge.label === "string" && data.badge.label
        ? data.badge.label
        : fallbackBadgeLabel(badgeStatus);

    var imageUrl =
      data.badge && typeof data.badge.imageUrl === "string"
        ? data.badge.imageUrl
        : "";

    var verifyUrl =
      typeof data.verifyUrl === "string" && data.verifyUrl
        ? data.verifyUrl
        : "/verify/" + encodeURIComponent(registryId);

    var baseUrl = resolveBaseUrl(cfg);

    var resolvedVerifyUrl =
      verifyUrl.indexOf("http://") === 0 || verifyUrl.indexOf("https://") === 0
        ? verifyUrl
        : baseUrl + verifyUrl;

    el.setAttribute("data-gafaig-badge-status", badgeStatus);

    if (typeof data.lifecycleStatus === "string") {
      el.setAttribute("data-gafaig-lifecycle-status", data.lifecycleStatus);
    }

    if (data.badgeEligible !== undefined && data.badgeEligible !== null) {
      el.setAttribute("data-gafaig-badge-eligible", String(data.badgeEligible));
    }

    if (data.verificationEligible !== undefined && data.verificationEligible !== null) {
      el.setAttribute(
        "data-gafaig-verification-eligible",
        String(data.verificationEligible)
      );
    }

    if (imageUrl) {
      var resolvedImageUrl =
        imageUrl.indexOf("http://") === 0 || imageUrl.indexOf("https://") === 0
          ? imageUrl
          : baseUrl + imageUrl;

      el.innerHTML =
        '<a href="' +
        resolvedVerifyUrl +
        '" target="_blank" rel="noopener noreferrer" aria-label="' +
        escapeHtml(badgeLabel) +
        '" title="Click to verify this GAFAIG certification" style="' +
        [
          "display:inline-block",
          "cursor:pointer",
          "transition:opacity 0.2s ease",
        ].join(";") +
        '">' +
        '<img src="' +
        resolvedImageUrl +
        '" alt="' +
        escapeHtml(badgeLabel) +
        '" style="max-width:100%;height:auto;display:block;" />' +
        "</a>";

      var imageAnchor = el.querySelector("a");
      if (imageAnchor) {
        imageAnchor.addEventListener("mouseenter", function () {
          imageAnchor.style.opacity = "0.85";
        });

        imageAnchor.addEventListener("mouseleave", function () {
          imageAnchor.style.opacity = "1";
        });
      }

      return el;
    }

    el.innerHTML =
      '<a href="' +
      resolvedVerifyUrl +
      '" target="_blank" rel="noopener noreferrer" title="Click to verify this GAFAIG certification" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:40px",
        "padding:0 14px",
        "border-radius:9999px",
        "border:1px solid rgba(0,0,0,0.12)",
        "background:#ffffff",
        "color:#111111",
        "text-decoration:none",
        "font-family:Inter,Arial,sans-serif",
        "font-size:12px",
        "font-weight:700",
        "letter-spacing:0.01em",
        "cursor:pointer",
        "transition:all 0.2s ease",
        "box-shadow:0 1px 2px rgba(0,0,0,0.06)",
      ].join(";") +
      '">' +
      escapeHtml(badgeLabel) +
      "</a>";

    var textAnchor = el.querySelector("a");
    if (textAnchor) {
      textAnchor.addEventListener("mouseenter", function () {
        textAnchor.style.background = "#f5f5f5";
        textAnchor.style.borderColor = "rgba(0,0,0,0.22)";
        textAnchor.style.boxShadow = "0 3px 10px rgba(0,0,0,0.10)";
      });

      textAnchor.addEventListener("mouseleave", function () {
        textAnchor.style.background = "#ffffff";
        textAnchor.style.borderColor = "rgba(0,0,0,0.12)";
        textAnchor.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)";
      });
    }

    return el;
  }

  function getVerifyUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    return buildVerifyUrl(id, options);
  }

  function getBadgeUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    return buildBadgeUrl(id, options);
  }

  function getRegistryUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    return resolveBaseUrl(options) + "/registry/" + encodeURIComponent(id);
  }

  function getVerifyPageUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    return resolveBaseUrl(options) + "/verify/" + encodeURIComponent(id);
  }

  function getWidgetPreviewUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    return resolveBaseUrl(options) + "/widget-preview/" + encodeURIComponent(id);
  }

  function scan(options) {
    var cfg = options || {};

    var widgetNodes = document.querySelectorAll("[data-gafaig-widget]");
    widgetNodes.forEach(function (node) {
      if (!(node instanceof HTMLElement)) return;
      if (node.getAttribute("data-gafaig-initialized") === "true") return;

      var registryId = node.getAttribute("data-gafaig-widget");
      var mode = node.getAttribute("data-mode") || "";

      if (!registryId) return;

      node.setAttribute("data-gafaig-initialized", "true");

      render(node, {
        registryId: registryId,
        mode: mode,
        baseUrl: cfg.baseUrl,
      }).catch(function (error) {
        console.error(error);
      });
    });

    var badgeNodes = document.querySelectorAll("[data-gafaig-badge]");
    badgeNodes.forEach(function (node) {
      if (!(node instanceof HTMLElement)) return;
      if (node.getAttribute("data-gafaig-badge-initialized") === "true") return;

      var registryId = node.getAttribute("data-gafaig-badge");

      if (!registryId) return;

      node.setAttribute("data-gafaig-badge-initialized", "true");

      badge(node, {
        registryId: registryId,
        baseUrl: cfg.baseUrl,
      }).catch(function (error) {
        console.error(error);
      });
    });

    var modalNodes = document.querySelectorAll("[data-gafaig-open-verify]");
    modalNodes.forEach(function (node) {
      if (!(node instanceof HTMLElement)) return;
      if (node.getAttribute("data-gafaig-modal-bound") === "true") return;

      var registryId = node.getAttribute("data-gafaig-open-verify");

      if (!registryId) return;

      node.setAttribute("data-gafaig-modal-bound", "true");

      node.addEventListener("click", function () {
        openVerify(registryId, {
          baseUrl: cfg.baseUrl,
        }).catch(function (error) {
          console.error(error);
        });
      });
    });
  }

  function autoInit(options) {
    scan(options || {});
  }

  function init(options) {
    scan(options || {});
  }

  var api = {
    version: VERSION,
    verify: verify,
    getBadge: getBadge,
    getPublicKey: getPublicKey,
    render: render,
    badge: badge,
    openVerify: openVerify,
    scan: scan,
    autoInit: autoInit,
    init: init,
    getVerifyUrl: getVerifyUrl,
    getBadgeUrl: getBadgeUrl,
    getRegistryUrl: getRegistryUrl,
    getVerifyPageUrl: getVerifyPageUrl,
    getWidgetPreviewUrl: getWidgetPreviewUrl,
  };

  window.gafaig = api;
  window.GAFAIGSDK = api;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        scan({});
      },
      { once: true }
    );
  } else {
    scan({});
  }
})();