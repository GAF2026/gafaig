(function () {
  var VERSION = "1.1.0";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildModal(data, registryId, options) {
    var record = (data && data.record) || {};
    var proof = (data && data.proof) || {};
    var baseUrl = (options && options.baseUrl) || "https://www.gafaig.com";
    var registryUrl = baseUrl.replace(/\/+$/, "") + "/registry/" + encodeURIComponent(registryId);
    var verifyUrl = baseUrl.replace(/\/+$/, "") + "/api/verify/" + encodeURIComponent(registryId);
    var keyUrl =
      proof.verificationKeyUrl ||
      baseUrl.replace(/\/+$/, "") + "/api/.well-known/gafaig-public-key";

    var overlay = document.createElement("div");
    overlay.setAttribute("data-gafaig-verify-overlay", "true");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "background:rgba(0,0,0,.42)",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "padding:24px",
      "z-index:999999",
    ].join(";");

    var panel = document.createElement("div");
    panel.style.cssText = [
      "width:100%",
      "max-width:560px",
      "background:#ffffff",
      "border:1px solid #e5e7eb",
      "border-radius:24px",
      "padding:24px",
      "box-shadow:0 10px 40px rgba(0,0,0,.16)",
      "font-family:Inter,Arial,Helvetica,sans-serif",
      "color:#111827",
      "max-height:calc(100vh - 48px)",
      "overflow:auto",
    ].join(";");

    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;">' +
      '<div>' +
      '<div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6b7280;">Verification Result</div>' +
      '<div style="margin-top:10px;font-size:28px;font-weight:800;line-height:1.1;">' +
      escapeHtml(record.entityName || "GAFAIG Record") +
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
        "min-width:40px",
        "height:40px",
        "cursor:pointer",
        "font-size:18px",
        "font-weight:700",
      ].join(";") +
      '">×</button>' +
      "</div>" +
      '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">' +
      '<span style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 12px;border-radius:9999px;border:1px solid ' +
      (data && data.verified ? "#111111" : "#b91c1c") +
      ";background:" +
      (data && data.verified ? "#111111" : "#ffffff") +
      ";color:" +
      (data && data.verified ? "#ffffff" : "#b91c1c") +
      ';font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">' +
      (data && data.verified ? "Verified" : "Unverified") +
      "</span>" +
      (proof.alg
        ? '<span style="display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 12px;border-radius:9999px;border:1px solid #d4d4d8;background:#ffffff;color:#111827;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">' +
          escapeHtml(proof.alg) +
          "</span>"
        : "") +
      "</div>" +
      '<div style="margin-top:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">' +
      metric("Decision", record.decisionStatus || "—") +
      metric("Tier / Band", (record.certifiedTier || "—") + " · " + (record.certifiedBand || "—")) +
      metric("Valid To", record.validTo || "—") +
      metric("Signed At", proof.signedAt || "—") +
      "</div>" +
      '<div style="margin-top:18px;border:1px solid #e5e7eb;border-radius:16px;padding:14px;background:#fafafa;">' +
      '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Verification key URL</div>' +
      '<div style="margin-top:8px;font-size:13px;line-height:1.6;word-break:break-all;">' +
      escapeHtml(keyUrl) +
      "</div>" +
      "</div>" +
      '<div style="margin-top:12px;border:1px solid #e5e7eb;border-radius:16px;padding:14px;background:#fafafa;">' +
      '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Message string</div>' +
      '<pre style="margin-top:8px;white-space:pre-wrap;word-break:break-all;font-size:12px;line-height:1.6;">' +
      escapeHtml(proof.messageString || "—") +
      "</pre>" +
      "</div>" +
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">' +
      linkButton(registryUrl, "Open record", true) +
      linkButton(verifyUrl, "Verify JSON", false) +
      linkButton(keyUrl, "Public key", false) +
      "</div>";

    overlay.appendChild(panel);

    function metric(label, value) {
      return (
        '<div style="border:1px solid #e5e7eb;border-radius:16px;padding:12px 14px;background:#ffffff;">' +
        '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">' +
        escapeHtml(label) +
        "</div>" +
        '<div style="margin-top:8px;font-size:14px;font-weight:600;line-height:1.45;word-break:break-word;">' +
        escapeHtml(value) +
        "</div>" +
        "</div>"
      );
    }

    function linkButton(href, label, primary) {
      return (
        '<a href="' +
        href +
        '" target="_blank" rel="noopener noreferrer" style="' +
        [
          "padding:10px 16px",
          "border-radius:9999px",
          primary ? "background:#111111" : "background:#ffffff",
          primary ? "color:#ffffff" : "color:#111111",
          primary ? "border:1px solid #111111" : "border:1px solid #111111",
          "text-decoration:none",
          "font-weight:700",
          "display:inline-flex",
          "align-items:center",
          "justify-content:center",
          "min-height:44px",
        ].join(";") +
        '">' +
        escapeHtml(label) +
        "</a>"
      );
    }

    return overlay;
  }

  function closeModal(overlay) {
    if (!overlay || !overlay.parentNode) return;
    overlay.parentNode.removeChild(overlay);
  }

  function ensureCoreSdk() {
    if (!window.GAFAIG || typeof window.GAFAIG.verify !== "function") {
      throw new Error("GAFAIG SDK not loaded");
    }
    return window.GAFAIG;
  }

  async function verifyGAFAIG(registryId, options) {
    var sdk = ensureCoreSdk();
    var data = await sdk.verify(registryId, options || {});
    var overlay = buildModal(data, registryId, options || {});
    var priorFocus = document.activeElement;

    function handleClick(event) {
      var target = event.target;
      if (target === overlay || target.getAttribute("data-gafaig-close") === "true") {
        close();
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
        priorFocus.focus();
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
    open: verifyGAFAIG,
  };

  window.verifyGAFAIG = verifyGAFAIG;
})();