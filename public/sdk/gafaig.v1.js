(function () {
  var VERSION = "1.2.2";
  var DEFAULT_BASE_URL = "https://www.gafaig.com";
  var LOADED_SCRIPTS = {};

  function normalizeBaseUrl(baseUrl) {
    var raw =
      typeof baseUrl === "string" && baseUrl.trim()
        ? baseUrl.trim()
        : DEFAULT_BASE_URL;
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

  function buildWidgetScriptUrl(options) {
    return resolveBaseUrl(options) + "/widget/gafaig-widget.v1.js";
  }

  function buildVerifyScriptUrl(options) {
    return resolveBaseUrl(options) + "/widget/gafaig-verify.v1.js";
  }

  function loadScriptOnce(src) {
    return new Promise(function (resolve) {
      var url = String(src || "").trim();

      if (!url) {
        resolve({
          ok: false,
          error: "Missing script URL",
        });
        return;
      }

      if (LOADED_SCRIPTS[url]) {
        LOADED_SCRIPTS[url].then(resolve);
        return;
      }

      var existing = document.querySelector('script[src="' + url + '"]');

      if (existing) {
        LOADED_SCRIPTS[url] = Promise.resolve({
          ok: true,
          src: url,
          existing: true,
        });
        LOADED_SCRIPTS[url].then(resolve);
        return;
      }

      LOADED_SCRIPTS[url] = new Promise(function (scriptResolve) {
        var script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.crossOrigin = "anonymous";

        script.onload = function () {
          scriptResolve({
            ok: true,
            src: url,
          });
        };

        script.onerror = function () {
          scriptResolve({
            ok: false,
            src: url,
            error: "Script failed to load",
          });
        };

        document.head.appendChild(script);
      });

      LOADED_SCRIPTS[url].then(resolve);
    });
  }

  async function ensureWidget(options) {
    if (window.GAFAIGWidget && typeof window.GAFAIGWidget.mount === "function") {
      return {
        ok: true,
        widget: window.GAFAIGWidget,
      };
    }

    var loaded = await loadScriptOnce(buildWidgetScriptUrl(options));

    if (!loaded.ok) {
      return {
        ok: false,
        error: loaded.error || "GAFAIG widget failed to load",
      };
    }

    if (window.GAFAIGWidget && typeof window.GAFAIGWidget.mount === "function") {
      return {
        ok: true,
        widget: window.GAFAIGWidget,
      };
    }

    return {
      ok: false,
      error: "GAFAIG widget unavailable after load",
    };
  }

  async function ensureVerifyModal(options) {
    if (typeof window.verifyGAFAIG === "function") {
      return {
        ok: true,
        verifyGAFAIG: window.verifyGAFAIG,
      };
    }

    var loaded = await loadScriptOnce(buildVerifyScriptUrl(options));

    if (!loaded.ok) {
      return {
        ok: false,
        error: loaded.error || "GAFAIG verification modal failed to load",
      };
    }

    if (typeof window.verifyGAFAIG === "function") {
      return {
        ok: true,
        verifyGAFAIG: window.verifyGAFAIG,
      };
    }

    return {
      ok: false,
      error: "GAFAIG verification modal unavailable after load",
    };
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

  async function widget(target, config) {
    var cfg = config || {};
    var el = resolveElement(target);
    var id = assertRegistryId(cfg.registryId || el.getAttribute("data-gafaig-id"));

    el.setAttribute("data-gafaig-id", id);

    if (cfg.mode) {
      el.setAttribute("data-mode", cfg.mode);
    }

    var loaded = await ensureWidget(cfg);

    if (!loaded.ok) {
      el.innerHTML =
        '<div style="' +
        [
          "display:inline-flex",
          "align-items:center",
          "justify-content:center",
          "padding:8px 14px",
          "border-radius:999px",
          "border:1px solid #ccc",
          "background:#fff",
          "color:#be123c",
          "font-size:12px",
          "font-weight:700",
        ].join(";") +
        '">Verification unavailable</div>';

      return {
        ok: false,
        registryId: id,
        error: loaded.error || "Widget unavailable",
      };
    }

    loaded.widget.mount({
      baseUrl: resolveBaseUrl(cfg),
    });

    return {
      ok: true,
      registryId: id,
    };
  }

  async function openVerify(registryId, options) {
    var id = assertRegistryId(registryId);
    var loaded = await ensureVerifyModal(options || {});

    if (!loaded.ok) {
      return {
        ok: false,
        verified: false,
        registryId: id,
        error: loaded.error || "Verification modal unavailable",
      };
    }

    return loaded.verifyGAFAIG(id, options || {});
  }

  function scan(options) {
    var opts = options || {};

    var badgeNodes = document.querySelectorAll("[data-gafaig-badge]");
    badgeNodes.forEach(function (node) {
      if (node.getAttribute("data-init")) return;
      node.setAttribute("data-init", "true");

      badge(node, {
        registryId: node.getAttribute("data-gafaig-badge"),
        baseUrl: opts.baseUrl,
      });
    });

    var widgetNodes = document.querySelectorAll("[data-gafaig-id]");
    if (widgetNodes.length) {
      ensureWidget(opts).then(function (loaded) {
        if (!loaded.ok) {
          widgetNodes.forEach(function (node) {
            if (node.getAttribute("data-widget-init")) return;
            node.setAttribute("data-widget-init", "true");
            node.innerHTML =
              '<div style="' +
              [
                "display:inline-flex",
                "align-items:center",
                "justify-content:center",
                "padding:8px 14px",
                "border-radius:999px",
                "border:1px solid #ccc",
                "background:#fff",
                "color:#be123c",
                "font-size:12px",
                "font-weight:700",
              ].join(";") +
              '">Verification unavailable</div>';
          });
          return;
        }

        loaded.widget.mount({
          baseUrl: resolveBaseUrl(opts),
        });
      });
    }

    var modalNodes = document.querySelectorAll("[data-gafaig-open-verify]");
    if (modalNodes.length) {
      ensureVerifyModal(opts).then(function (loaded) {
        modalNodes.forEach(function (node) {
          if (node.getAttribute("data-bound")) return;
          node.setAttribute("data-bound", "true");

          node.addEventListener("click", function () {
            var id = node.getAttribute("data-gafaig-open-verify");

            if (loaded.ok && typeof loaded.verifyGAFAIG === "function") {
              loaded.verifyGAFAIG(id, opts);
            }
          });
        });
      });
    }
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
    widget: widget,
    getBadge: getBadge,
    openVerify: openVerify,
    ensureWidget: ensureWidget,
    ensureVerifyModal: ensureVerifyModal,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      scan({});
    });
  } else {
    scan({});
  }
})();