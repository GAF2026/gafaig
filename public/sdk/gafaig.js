(function () {
  var VERSION = "0.1.0";

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
    } catch (error) {
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

  function buildVerifyUrl(registryId, options) {
    var baseUrl = resolveBaseUrl(options);
    return baseUrl + "/api/verify/" + encodeURIComponent(registryId);
  }

  function buildPublicKeyUrl(options) {
    var baseUrl = resolveBaseUrl(options);
    return baseUrl + "/api/.well-known/gafaig-public-key";
  }

  async function verify(registryId, options) {
    var id = assertRegistryId(registryId);
    var url = buildVerifyUrl(id, options);
    return fetchJson(url);
  }

  function getPublicKey(options) {
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

        existing.addEventListener("load", function handleLoad() {
          existing.setAttribute("data-gafaig-loaded", "true");
          resolve();
        });

        existing.addEventListener("error", function handleError() {
          reject(new Error("GAFAIG SDK: failed to load script " + src));
        });

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

  async function render(target, config) {
    var cfg = config || {};
    var registryId = assertRegistryId(cfg.registryId);
    var el = resolveElement(target);
    var baseUrl = resolveBaseUrl(cfg);
    var widgetScriptUrl = baseUrl + "/widget/gafaig-widget.js";

    el.setAttribute("data-gafaig-id", registryId);

    if (cfg.mode && String(cfg.mode).trim()) {
      el.setAttribute("data-mode", String(cfg.mode).trim());
    }

    await loadScript(widgetScriptUrl);

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
    var widgetScriptUrl = baseUrl + "/widget/gafaig-widget.js";
    var verifyScriptUrl = baseUrl + "/widget/gafaig-verify.js";

    await loadScript(widgetScriptUrl);
    await loadScript(verifyScriptUrl);

    if (typeof window.verifyGAFAIG === "function") {
      return window.verifyGAFAIG(id, { baseUrl: baseUrl });
    }

    throw new Error("GAFAIG SDK: verify modal runtime not available after load");
  }

  function getVerifyUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    return buildVerifyUrl(id, options);
  }

  function getRegistryUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    var baseUrl = resolveBaseUrl(options);
    return baseUrl + "/registry/" + encodeURIComponent(id);
  }

  function getVerifyPageUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    var baseUrl = resolveBaseUrl(options);
    return baseUrl + "/verify/" + encodeURIComponent(id);
  }

  function getWidgetPreviewUrl(registryId, options) {
    var id = assertRegistryId(registryId);
    var baseUrl = resolveBaseUrl(options);
    return baseUrl + "/widget-preview/" + encodeURIComponent(id);
  }

  var api = {
    version: VERSION,
    verify: verify,
    getPublicKey: getPublicKey,
    render: render,
    openVerify: openVerify,
    getVerifyUrl: getVerifyUrl,
    getRegistryUrl: getRegistryUrl,
    getVerifyPageUrl: getVerifyPageUrl,
    getWidgetPreviewUrl: getWidgetPreviewUrl,
  };

  window.gafaig = api;
  window.GAFAIGSDK = api;
})();