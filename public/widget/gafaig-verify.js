(function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatDate(value) {
    if (!value) return "—";
    var d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function ensureModal() {
    var existing = document.getElementById("gafaig-verify-modal-root");
    if (existing) return existing;

    var root = document.createElement("div");
    root.id = "gafaig-verify-modal-root";
    root.style.position = "fixed";
    root.style.inset = "0";
    root.style.zIndex = "999999";
    root.style.display = "none";
    root.style.alignItems = "center";
    root.style.justifyContent = "center";
    root.style.padding = "24px";
    root.style.background = "rgba(15, 23, 42, 0.42)";
    root.innerHTML =
      '<div data-gafaig-backdrop="true" style="position:absolute;inset:0;"></div>' +
      '<div role="dialog" aria-modal="true" aria-label="GAFAIG verification" style="' +
      [
        "position:relative",
        "width:min(100%,560px)",
        "max-height:calc(100vh - 48px)",
        "overflow:auto",
        "border:1px solid #d4d4d8",
        "border-radius:28px",
        "background:#ffffff",
        "box-shadow:0 24px 80px rgba(0,0,0,.18)",
        "padding:24px",
        "font-family:Inter,Arial,Helvetica,sans-serif",
        "color:#0f172a",
      ].join(";") +
      '">' +
      '<button type="button" data-gafaig-close="true" aria-label="Close verification" style="' +
      [
        "position:absolute",
        "top:16px",
        "right:16px",
        "height:36px",
        "width:36px",
        "border-radius:9999px",
        "border:1px solid #e5e7eb",
        "background:#ffffff",
        "cursor:pointer",
        "font-size:18px",
        "line-height:1",
      ].join(";") +
      '">×</button>' +
      '<div id="gafaig-verify-modal-content"></div>' +
      "</div>";

    root.addEventListener("click", function (event) {
      var target = event.target;
      if (
        target &&
        ((target.getAttribute && target.getAttribute("data-gafaig-backdrop") === "true") ||
          (target.getAttribute && target.getAttribute("data-gafaig-close") === "true"))
      ) {
        hideModal();
      }
    });

    document.body.appendChild(root);
    return root;
  }

  function showModal(html) {
    var root = ensureModal();
    var content = root.querySelector("#gafaig-verify-modal-content");
    if (content) content.innerHTML = html;
    root.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function hideModal() {
    var root = document.getElementById("gafaig-verify-modal-root");
    if (root) root.style.display = "none";
    document.body.style.overflow = "";
  }

  function pill(text, filled) {
    return (
      '<span style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "height:30px",
        "padding:0 12px",
        "border-radius:9999px",
        "border:1px solid #111111",
        filled ? "background:#111111" : "background:#ffffff",
        filled ? "color:#ffffff" : "color:#111111",
        "font-size:11px",
        "font-weight:700",
        "letter-spacing:.08em",
        "text-transform:uppercase",
        "white-space:nowrap",
      ].join(";") +
      '">' +
      escapeHtml(text) +
      "</span>"
    );
  }

  function infoCard(label, value) {
    return (
      '<div style="' +
      [
        "border:1px solid #e5e7eb",
        "border-radius:16px",
        "padding:12px 14px",
        "background:#ffffff",
      ].join(";") +
      '">' +
      '<div style="' +
      [
        "font-size:11px",
        "font-weight:700",
        "letter-spacing:.08em",
        "text-transform:uppercase",
        "color:#6b7280",
      ].join(";") +
      '">' +
      escapeHtml(label) +
      "</div>" +
      '<div style="' +
      [
        "margin-top:8px",
        "font-size:14px",
        "font-weight:600",
        "line-height:1.45",
        "color:#111827",
      ].join(";") +
      '">' +
      escapeHtml(value || "—") +
      "</div>" +
      "</div>"
    );
  }

  function renderLoading(registryId) {
    return (
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      pill("Verifying", true) +
      pill("GAFAIG", false) +
      "</div>" +
      '<div style="margin-top:14px;font-size:28px;line-height:1.08;font-weight:800;">' +
      "Checking certification record" +
      "</div>" +
      '<div style="margin-top:10px;font-size:14px;line-height:1.8;color:#52525b;">' +
      "Fetching GAFAIG verification data for " +
      escapeHtml(registryId) +
      "." +
      "</div>"
    );
  }

  function renderError(registryId, message) {
    var registryUrl =
      "https://www.gafaig.com/registry/" + encodeURIComponent(registryId);
    var verifyGuideUrl = "https://www.gafaig.com/verify";

    return (
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      pill("Unavailable", false) +
      pill("GAFAIG", false) +
      "</div>" +
      '<div style="margin-top:14px;font-size:28px;line-height:1.08;font-weight:800;">' +
      "Verification unavailable" +
      "</div>" +
      '<div style="margin-top:10px;font-size:14px;line-height:1.8;color:#52525b;">' +
      escapeHtml(message) +
      "</div>" +
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">' +
      '<a href="' +
      registryUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:46px",
        "padding:0 16px",
        "border-radius:9999px",
        "border:1px solid #111111",
        "background:#111111",
        "color:#ffffff",
        "font-size:14px",
        "font-weight:700",
        "text-decoration:none",
      ].join(";") +
      '">Open record</a>' +
      '<a href="' +
      verifyGuideUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:46px",
        "padding:0 16px",
        "border-radius:9999px",
        "border:1px solid #111111",
        "background:#ffffff",
        "color:#111111",
        "font-size:14px",
        "font-weight:700",
        "text-decoration:none",
      ].join(";") +
      '">How verification works</a>' +
      "</div>" +
      '<div style="margin-top:16px;font-size:12px;line-height:1.7;color:#71717a;">' +
      "Verified via GAFAIG public trust infrastructure." +
      "</div>"
    );
  }

  function renderVerified(registryId, data) {
    var record = data.record || {};
    var registryUrl =
      "https://www.gafaig.com/registry/" + encodeURIComponent(registryId);
    var verifyUrl =
      "https://www.gafaig.com/api/verify/" + encodeURIComponent(registryId);
    var verifyGuideUrl = "https://www.gafaig.com/verify";

    return (
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      pill("Verified", true) +
      pill("GAFAIG", false) +
      "</div>" +
      '<div style="margin-top:14px;font-size:28px;line-height:1.08;font-weight:800;">' +
      "GAFAIG Verification: Verified" +
      "</div>" +
      '<div style="margin-top:10px;font-size:14px;line-height:1.8;color:#52525b;">' +
      "This certification has been independently resolved through the GAFAIG public trust infrastructure." +
      "</div>" +
      '<div style="margin-top:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">' +
      infoCard("Entity", record.entityName || "Unknown") +
      infoCard("Registry ID", record.registryId || registryId) +
      infoCard("Tier", record.certifiedTier || "—") +
      infoCard("Band", record.certifiedBand || "—") +
      infoCard("Decision", record.decisionStatus || "—") +
      infoCard("Valid To", formatDate(record.validTo)) +
      "</div>" +
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">' +
      '<a href="' +
      registryUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:46px",
        "padding:0 16px",
        "border-radius:9999px",
        "border:1px solid #111111",
        "background:#111111",
        "color:#ffffff",
        "font-size:14px",
        "font-weight:700",
        "text-decoration:none",
      ].join(";") +
      '">Open record</a>' +
      '<a href="' +
      verifyUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:46px",
        "padding:0 16px",
        "border-radius:9999px",
        "border:1px solid #111111",
        "background:#ffffff",
        "color:#111111",
        "font-size:14px",
        "font-weight:700",
        "text-decoration:none",
      ].join(";") +
      '">Verify JSON</a>' +
      '<a href="' +
      verifyGuideUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:46px",
        "padding:0 16px",
        "border-radius:9999px",
        "border:1px solid #111111",
        "background:#ffffff",
        "color:#111111",
        "font-size:14px",
        "font-weight:700",
        "text-decoration:none",
      ].join(";") +
      '">How verification works</a>' +
      "</div>" +
      '<div style="margin-top:16px;font-size:12px;line-height:1.7;color:#71717a;">' +
      "Verified via GAFAIG public trust infrastructure." +
      "</div>"
    );
  }

  async function verifyGAFAIG(registryId) {
    if (!registryId) {
      showModal(renderError("unknown", "Missing GAFAIG registry ID."));
      return;
    }

    showModal(renderLoading(registryId));

    var endpoint =
      "https://www.gafaig.com/api/verify/" + encodeURIComponent(registryId);

    try {
      var res = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      var data = await res.json();

      if (!res.ok || !data.ok || !data.verified) {
        showModal(
          renderError(
            registryId,
            "The certification record could not be verified for this registry ID."
          )
        );
        return;
      }

      showModal(renderVerified(registryId, data));
    } catch (err) {
      showModal(
        renderError(
          registryId,
          "Verification error. Please try again."
        )
      );
    }
  }

  window.verifyGAFAIG = verifyGAFAIG;
})();