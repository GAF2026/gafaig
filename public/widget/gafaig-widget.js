(function () {
  if (window.GAFAIG && window.GAFAIG.__sdkLoaded) return;

  var VERSION = "1.1.0";
  var DEFAULT_BASE_URL = "https://www.gafaig.com";
  var DEFAULT_TIMEOUT_MS = 12000;
  var DEFAULT_RETRY_COUNT = 1;

  var DEFAULTS = {
    baseUrl: DEFAULT_BASE_URL,
    theme: "light",
    size: "md",
    showBadgeImage: true,
    showFooter: true,
    showActions: true,
    showVerifyJson: true,
    showRegistryLink: true,
    showStatus: true,
    showDecision: true,
    showValidity: true,
    showTierBand: true,
    autoInit: true,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    retryCount: DEFAULT_RETRY_COUNT,
    verifyGuidePath: "/verify",
    registryPath: "/registry",
    verifyPath: "/api/verify",
    badgePath: "/badge",
    selectors: "[data-gafaig-id]",
    onBeforeRender: null,
    onRendered: null,
    onError: null,
  };

  var state = {
    config: assign({}, DEFAULTS),
    instanceMap: new WeakMap(),
  };

  function assign(target) {
    target = target || {};
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] || {};
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isElement(value) {
    return value && value.nodeType === 1;
  }

  function getConfig(override) {
    return assign({}, state.config, override || {});
  }

  function getBaseUrl(config) {
    return String(config.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  }

  function joinUrl(base, path) {
    return String(base).replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = window.setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error("Request timed out"));
      }, ms);

      promise.then(
        function (value) {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve(value);
        },
        function (error) {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          reject(error);
        }
      );
    });
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  async function fetchJsonWithRetry(url, options, retryCount, timeoutMs) {
    var lastError = null;

    for (var attempt = 0; attempt <= retryCount; attempt++) {
      try {
        var res = await withTimeout(fetch(url, options || {}), timeoutMs);
        var data = await res.json().catch(function () {
          return null;
        });

        if (!res.ok || !data || data.ok === false) {
          throw new Error(
            (data && (data.error || data.message)) ||
              ("Request failed with status " + res.status)
          );
        }

        return data;
      } catch (error) {
        lastError = error;
        if (attempt < retryCount) {
          await sleep(350 * (attempt + 1));
        }
      }
    }

    throw lastError || new Error("Request failed");
  }

  function formatDate(value) {
    if (!value) return "—";
    var date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function normalizeStatusText(data, record) {
    if (record && record.certificationStatus) return String(record.certificationStatus);
    return data && data.verified ? "Certified" : "Not Certified";
  }

  function formatTierBand(record) {
    var tier = record && record.certifiedTier ? record.certifiedTier : "—";
    var band = record && record.certifiedBand ? record.certifiedBand : "—";
    return tier + " · " + band;
  }

  function getThemeTokens(theme) {
    if (theme === "dark") {
      return {
        bg: "#0b1020",
        surface: "#121a31",
        mutedSurface: "#18213e",
        border: "#25304f",
        text: "#f8fafc",
        subtext: "#cbd5e1",
        accent: "#ffffff",
        accentText: "#111111",
        ghostBorder: "#475569",
        ghostText: "#f8fafc",
        successBorder: "#10b981",
        successBg: "#052e24",
        successText: "#a7f3d0",
        warningBorder: "#f59e0b",
        warningBg: "#3b2500",
        warningText: "#fde68a",
        shadow: "0 1px 2px rgba(0,0,0,.25)",
      };
    }

    return {
      bg: "#ffffff",
      surface: "#ffffff",
      mutedSurface: "#fafafa",
      border: "#d4d4d8",
      text: "#111827",
      subtext: "#52525b",
      accent: "#111111",
      accentText: "#ffffff",
      ghostBorder: "#111111",
      ghostText: "#111111",
      successBorder: "#111111",
      successBg: "#111111",
      successText: "#ffffff",
      warningBorder: "#92400e",
      warningBg: "#ffffff",
      warningText: "#92400e",
      shadow: "0 1px 2px rgba(0,0,0,.04)",
    };
  }

  function getSizeTokens(size) {
    if (size === "sm") {
      return {
        maxWidth: "420px",
        radius: "24px",
        padding: "18px",
        title: "24px",
        body: "13px",
        buttonHeight: "40px",
        buttonPadding: "0 14px",
        badgeHeight: "28px",
        gridColumns: "repeat(1,minmax(0,1fr))",
      };
    }

    if (size === "lg") {
      return {
        maxWidth: "640px",
        radius: "32px",
        padding: "26px",
        title: "34px",
        body: "15px",
        buttonHeight: "46px",
        buttonPadding: "0 18px",
        badgeHeight: "32px",
        gridColumns: "repeat(2,minmax(0,1fr))",
      };
    }

    return {
      maxWidth: "520px",
      radius: "28px",
      padding: "22px",
      title: "30px",
      body: "14px",
      buttonHeight: "44px",
      buttonPadding: "0 16px",
      badgeHeight: "30px",
      gridColumns: "repeat(2,minmax(0,1fr))",
    };
  }

  function styleText(parts) {
    return parts.join(";");
  }

  function pill(text, options, tokens, sizeTokens) {
    var filled = options && options.filled;
    var border = (options && options.border) || tokens.ghostBorder;
    var background = filled ? border : tokens.surface;
    var color = filled ? tokens.accentText : (options && options.color) || border;

    return (
      '<span style="' +
      styleText([
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "height:" + sizeTokens.badgeHeight,
        "padding:0 12px",
        "border-radius:9999px",
        "border:1px solid " + border,
        "background:" + background,
        "color:" + color,
        "font-size:11px",
        "font-weight:700",
        "letter-spacing:.08em",
        "text-transform:uppercase",
        "white-space:nowrap",
      ]) +
      '">' +
      escapeHtml(text) +
      "</span>"
    );
  }

  function fieldCard(label, value, emphasis, tokens) {
    return (
      '<div style="' +
      styleText([
        "border:1px solid " + tokens.border,
        "border-radius:16px",
        "padding:12px 14px",
        "background:" + tokens.surface,
        "min-width:0",
      ]) +
      '">' +
      '<div style="' +
      styleText([
        "font-size:11px",
        "font-weight:700",
        "letter-spacing:.08em",
        "text-transform:uppercase",
        "color:" + tokens.subtext,
      ]) +
      '">' +
      escapeHtml(label) +
      "</div>" +
      '<div style="' +
      styleText([
        "margin-top:8px",
        "font-size:14px",
        emphasis ? "font-weight:700" : "font-weight:600",
        "line-height:1.45",
        "color:" + tokens.text,
        "word-break:break-word",
        "overflow-wrap:anywhere",
        "white-space:normal",
      ]) +
      '">' +
      escapeHtml(value || "—") +
      "</div>" +
      "</div>"
    );
  }

  function renderError(el, registryId, message, config) {
    var tokens = getThemeTokens(config.theme);
    var sizeTokens = getSizeTokens(config.size);
    var base = getBaseUrl(config);
    var recordUrl = joinUrl(base, config.registryPath) + "/" + encodeURIComponent(registryId || "");

    el.innerHTML =
      '<div style="' +
      styleText([
        "font-family:Inter,Arial,Helvetica,sans-serif",
        "color:" + tokens.text,
        "max-width:" + sizeTokens.maxWidth,
        "border:1px solid " + tokens.border,
        "border-radius:" + sizeTokens.radius,
        "padding:" + sizeTokens.padding,
        "background:" + tokens.bg,
        "box-shadow:" + tokens.shadow,
      ]) +
      '">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      pill("Unavailable", { filled: false, border: "#b91c1c" }, tokens, sizeTokens) +
      pill("GAFAIG", { filled: false, border: tokens.ghostBorder }, tokens, sizeTokens) +
      "</div>" +
      '<div style="margin-top:14px;font-size:22px;font-weight:800;color:' +
      tokens.text +
      ';">GAFAIG verification unavailable</div>' +
      '<div style="margin-top:10px;font-size:14px;color:' +
      tokens.subtext +
      ';">' +
      escapeHtml(message || "The certification record could not be verified.") +
      "</div>" +
      '<a href="' +
      recordUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      styleText([
        "margin-top:18px",
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:" + sizeTokens.buttonHeight,
        "border-radius:9999px",
        "border:1px solid " + tokens.ghostBorder,
        "padding:" + sizeTokens.buttonPadding,
        "font-size:14px",
        "font-weight:700",
        "text-decoration:none",
        "background:" + tokens.surface,
        "color:" + tokens.ghostText,
      ]) +
      '">' +
      "Open GAFAIG record" +
      "</a>" +
      "</div>";
  }

  function renderWidgetMarkup(registryId, data, config) {
    var record = data.record || {};
    var entityName = record.entityName || "Unknown Entity";
    var statusText = normalizeStatusText(data, record);
    var tokens = getThemeTokens(config.theme);
    var sizeTokens = getSizeTokens(config.size);
    var base = getBaseUrl(config);

    var registryUrl =
      joinUrl(base, config.registryPath) + "/" + encodeURIComponent(registryId);
    var verifyUrl =
      joinUrl(base, config.verifyPath) + "/" + encodeURIComponent(registryId);
    var verifyGuideUrl = joinUrl(base, config.verifyGuidePath);
    var badgeUrl =
      joinUrl(base, config.badgePath) + "/" + encodeURIComponent(registryId);

    var normalizedStatus = String(statusText || "").trim().toLowerCase();
    var isCertified = normalizedStatus === "certified";
    var primaryStatusPill = isCertified
      ? pill("Verified", { filled: true, border: tokens.successBorder }, tokens, sizeTokens)
      : pill(statusText || "Not Certified", { filled: false, border: tokens.warningBorder, color: tokens.warningText }, tokens, sizeTokens);

    var fields = [];

    if (config.showStatus) {
      fields.push(fieldCard("Status", statusText, true, tokens));
    }
    if (config.showTierBand) {
      fields.push(fieldCard("Tier / Band", formatTierBand(record), true, tokens));
    }
    if (config.showDecision) {
      fields.push(fieldCard("Decision", record.decisionStatus || "—", true, tokens));
    }
    if (config.showValidity) {
      fields.push(fieldCard("Valid To", formatDate(record.validTo), false, tokens));
    }
    fields.push(fieldCard("Registry ID", record.registryId || registryId, false, tokens));

    var actions = [];
    if (config.showRegistryLink) {
      actions.push(
        '<a href="' +
          registryUrl +
          '" target="_blank" rel="noopener noreferrer" style="' +
          styleText([
            "padding:10px 16px",
            "border-radius:9999px",
            "background:" + tokens.accent,
            "color:" + tokens.accentText,
            "text-decoration:none",
            "font-weight:700",
            "display:inline-flex",
            "align-items:center",
            "justify-content:center",
            "min-height:" + sizeTokens.buttonHeight,
          ]) +
          '">' +
          "Open record" +
          "</a>"
      );
    }

    if (config.showVerifyJson) {
      actions.push(
        '<a href="' +
          verifyUrl +
          '" target="_blank" rel="noopener noreferrer" style="' +
          styleText([
            "padding:10px 16px",
            "border-radius:9999px",
            "border:1px solid " + tokens.ghostBorder,
            "text-decoration:none",
            "font-weight:700",
            "display:inline-flex",
            "align-items:center",
            "justify-content:center",
            "min-height:" + sizeTokens.buttonHeight,
            "color:" + tokens.ghostText,
            "background:" + tokens.surface,
          ]) +
          '">' +
          "Verify JSON" +
          "</a>"
      );
    }

    return (
      '<div style="' +
      styleText([
        "font-family:Inter,Arial,Helvetica,sans-serif",
        "color:" + tokens.text,
        "max-width:" + sizeTokens.maxWidth,
        "border:1px solid " + tokens.border,
        "border-radius:" + sizeTokens.radius,
        "padding:" + sizeTokens.padding,
        "background:" + tokens.bg,
        "box-shadow:" + tokens.shadow,
      ]) +
      '">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      primaryStatusPill +
      pill("GAFAIG", { filled: false, border: tokens.ghostBorder }, tokens, sizeTokens) +
      "</div>" +
      '<div style="margin-top:14px;font-size:' +
      sizeTokens.title +
      ";font-weight:800;line-height:1.15;word-break:break-word;overflow-wrap:anywhere;color:" +
      tokens.text +
      ';">' +
      escapeHtml(entityName) +
      "</div>" +
      '<div style="margin-top:10px;font-size:' +
      sizeTokens.body +
      ";color:" +
      tokens.subtext +
      ';line-height:1.7;">Public certification record independently verifiable through GAFAIG.</div>' +
      (config.showBadgeImage
        ? '<div style="' +
          styleText([
            "margin-top:18px",
            "border:1px solid " + tokens.border,
            "border-radius:20px",
            "padding:14px",
            "background:" + tokens.mutedSurface,
          ]) +
          '">' +
          '<img src="' +
          badgeUrl +
          '" alt="' +
          escapeHtml(entityName) +
          ' badge" style="max-width:100%;border-radius:12px;" />' +
          "</div>"
        : "") +
      '<div style="' +
      styleText([
        "margin-top:16px",
        "display:grid",
        "grid-template-columns:" + sizeTokens.gridColumns,
        "gap:12px",
      ]) +
      '">' +
      fields.join("") +
      "</div>" +
      (config.showActions
        ? '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">' +
          actions.join("") +
          "</div>"
        : "") +
      (config.showFooter
        ? '<div style="margin-top:16px;font-size:12px;color:' +
          tokens.subtext +
          ';line-height:1.7;">Verified via GAFAIG public trust infrastructure · <a href="' +
          verifyGuideUrl +
          '" target="_blank" rel="noopener noreferrer" style="text-decoration:underline;color:' +
          tokens.subtext +
          ';">How verification works</a></div>'
        : "") +
      "</div>"
    );
  }

  async function verify(registryId, options) {
    var config = getConfig(options);
    var base = getBaseUrl(config);
    var endpoint =
      joinUrl(base, config.verifyPath) + "/" + encodeURIComponent(registryId);

    return fetchJsonWithRetry(
      endpoint,
      { credentials: "omit" },
      Number(config.retryCount || 0),
      Number(config.timeoutMs || DEFAULT_TIMEOUT_MS)
    );
  }

  function resolveElement(target) {
    if (isElement(target)) return target;
    if (typeof target === "string") return document.querySelector(target);
    return null;
  }

  async function render(target, registryId, options) {
    var el = resolveElement(target);
    if (!el) throw new Error("Target element not found");

    var id = registryId || el.getAttribute("data-gafaig-id");
    if (!id) throw new Error("Missing registryId");

    var config = getConfig(options);

    state.instanceMap.set(el, {
      registryId: id,
      config: config,
      renderedAt: Date.now(),
    });

    if (typeof config.onBeforeRender === "function") {
      try {
        config.onBeforeRender({ element: el, registryId: id, config: config });
      } catch (_) {}
    }

    try {
      var data = await verify(id, config);
      el.innerHTML = renderWidgetMarkup(id, data, config);

      if (typeof config.onRendered === "function") {
        try {
          config.onRendered({
            element: el,
            registryId: id,
            config: config,
            data: data,
          });
        } catch (_) {}
      }

      return data;
    } catch (error) {
      renderError(el, id, error && error.message ? error.message : "Verification failed", config);

      if (typeof config.onError === "function") {
        try {
          config.onError({
            element: el,
            registryId: id,
            config: config,
            error: error,
          });
        } catch (_) {}
      }

      throw error;
    }
  }

  function scan(options) {
    var config = getConfig(options);
    var nodes = document.querySelectorAll(config.selectors || DEFAULTS.selectors);
    var promises = [];

    nodes.forEach(function (el) {
      promises.push(
        render(el, el.getAttribute("data-gafaig-id"), config).catch(function () {
          return null;
        })
      );
    });

    return Promise.all(promises);
  }

  function destroy(target) {
    var el = resolveElement(target);
    if (!el) return false;
    el.innerHTML = "";
    state.instanceMap.delete(el);
    return true;
  }

  function init(options) {
    if (options) {
      state.config = getConfig(options);
    }

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        function () {
          scan();
        },
        { once: true }
      );
    } else {
      scan();
    }

    return window.GAFAIG;
  }

  window.GAFAIG = {
    __sdkLoaded: true,
    version: VERSION,
    defaults: assign({}, DEFAULTS),
    configure: function (options) {
      state.config = getConfig(options);
      return assign({}, state.config);
    },
    getConfig: function () {
      return assign({}, state.config);
    },
    init: init,
    scan: scan,
    render: render,
    verify: verify,
    destroy: destroy,
  };

  if (state.config.autoInit) {
    init();
  }
})();