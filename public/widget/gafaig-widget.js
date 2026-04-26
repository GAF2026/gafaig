(function () {
  var VERSION = "1.3.2";

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

  function escapeHtml(v) {
    return String(v || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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

  function renderError(el) {
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
        "font-size:12px",
        "font-weight:700",
        "color:#be123c",
      ].join(";") +
      '">' +
      "Verification unavailable" +
      "</div>";
  }

  function renderVerified(el, registryId, options, record) {
    var baseUrl = resolveBaseUrl(options);

    var verifyUrl =
      baseUrl + "/verify/" + encodeURIComponent(registryId);

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
      escapeHtml("GAFAIG Verified") +
      "</a>";
  }

  async function fetchVerify(id, options) {
    try {
      var res = await fetch(
        resolveBaseUrl(options) +
          "/api/verify/" +
          encodeURIComponent(id),
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
      if (node.getAttribute("data-init")) return;

      node.setAttribute("data-init", "true");

      var id = node.getAttribute("data-gafaig-id");

      if (!id) {
        renderError(node);
        return;
      }

      initWidget(node, id, options);
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