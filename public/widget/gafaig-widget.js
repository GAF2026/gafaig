(function () {
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildStyles() {
    return [
      "font-family:Inter,Arial,Helvetica,sans-serif",
      "color:#0f172a",
      "max-width:520px",
    ].join(";");
  }

  function pill(text, options) {
    var filled = options && options.filled;
    var border = (options && options.border) || "#111111";
    var background = filled ? border : "#ffffff";
    var color = filled ? "#ffffff" : border;

    return (
      '<span style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "height:30px",
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
      ].join(";") +
      '">' +
      escapeHtml(text) +
      "</span>"
    );
  }

  function fieldCard(label, value, emphasis) {
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
        emphasis ? "font-weight:700" : "font-weight:600",
        "line-height:1.45",
        "color:#111827",
      ].join(";") +
      '">' +
      escapeHtml(value || "—") +
      "</div>" +
      "</div>"
    );
  }

  function renderError(el, message, registryId) {
    var recordUrl =
      "https://www.gafaig.com/registry/" + encodeURIComponent(registryId || "");

    el.innerHTML =
      '<div style="' +
      [
        buildStyles(),
        "border:1px solid #d4d4d8",
        "border-radius:24px",
        "padding:20px",
        "background:#ffffff",
        "box-shadow:0 1px 2px rgba(0,0,0,.04)",
      ].join(";") +
      '">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      pill("Unavailable", { filled: false, border: "#b91c1c" }) +
      pill("GAFAIG", { filled: false, border: "#111111" }) +
      "</div>" +
      '<div style="margin-top:14px;font-size:22px;line-height:1.15;font-weight:800;color:#111827;">' +
      "GAFAIG verification unavailable" +
      "</div>" +
      '<div style="margin-top:10px;font-size:14px;line-height:1.75;color:#52525b;">' +
      escapeHtml(message) +
      "</div>" +
      '<a href="' +
      recordUrl +
      '" target="_blank" rel="noopener noreferrer" style="' +
      [
        "margin-top:18px",
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "min-height:44px",
        "border-radius:9999px",
        "border:1px solid #111111",
        "padding:0 16px",
        "font-size:14px",
        "font-weight:700",
        "text-decoration:none",
        "background:#ffffff",
        "color:#111111",
      ].join(";") +
      '">' +
      "Open GAFAIG record" +
      "</a>' +
      "</div>";
  }

  function formatTierBand(record) {
    var tier = record.certifiedTier || "—";
    var band = record.certifiedBand || "—";
    return tier + " · " + band;
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

  function renderWidget(el, registryId, data) {
    var record = data.record || {};
    var entityName = record.entityName || "Unknown Entity";
    var registryUrl =
      "https://www.gafaig.com/registry/" + encodeURIComponent(registryId);
    var badgeUrl =
      "https://www.gafaig.com/badge/" + encodeURIComponent(registryId);
    var verifyUrl =
      "https://www.gafaig.com/api/verify/" + encodeURIComponent(registryId);

    el.innerHTML =
      '<div style="' +
      [
        buildStyles(),
        "border:1px solid #d4d4d8",
        "border-radius:28px",
        "padding:22px",
        "background:#ffffff",
        "box-shadow:0 1px 2px rgba(0,0,0,.04)",
      ].join(";") +
      '">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      pill("Verified", { filled: true, border: "#111111" }) +
      pill("GAFAIG", { filled: false, border: "#111111" }) +
      "</div>" +
      '<div style="margin-top:14px;font-size:30px;line-height:1.05;font-weight:800;color:#0f172a;">' +
      escapeHtml(entityName) +
      "</div>" +
      '<div style="margin-top:10px;max-width:420px;font-size:14px;line-height:1.75;color:#52525b;">' +
      "Public certification record independently verifiable through GAFAIG trust infrastructure." +
      "</div>" +
      '<div style="' +
      [
        "margin-top:18px",
        "border:1px solid #e5e7eb",
        "border-radius:20px",
        "padding:14px",
        "background:#fafafa",
      ].join(";") +
      '">' +
      '<img src="' +
      badgeUrl +
      '" alt="' +
      escapeHtml(entityName) +
      ' GAFAIG badge" style="display:block;max-width:100%;height:auto;border-radius:12px;" />' +
      "</div>" +
      '<div style="' +
      [
        "margin-top:16px",
        "display:grid",
        "grid-template-columns:repeat(2,minmax(0,1fr))",
        "gap:12px",
      ].join(";") +
      '">' +
      fieldCard("Tier / Band", formatTierBand(record), true) +
      fieldCard("Decision", record.decisionStatus || "—", true) +
      fieldCard("Valid To", formatDate(record.validTo), false) +
      fieldCard("Registry ID", record.registryId || registryId, false) +
      "</div>" +
      '<div style="' +
      [
        "margin-top:18px",
        "display:flex",
        "gap:10px",
        "flex-wrap:wrap",
      ].join(";") +
      '">' +
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
      '">' +
      "Open GAFAIG record" +
      "</a>" +
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
      '">' +
      "Open verify JSON" +
      "</a>" +
      "</div>" +
      '<div style="' +
      [
        "margin-top:16px",
        "font-size:12px",
        "line-height:1.7",
        "color:#71717a",
      ].join(";") +
      '">' +
      "Verified by GAFAIG public registry infrastructure." +
      "</div>" +
      "</div>";
  }

  async function fetchVerification(registryId) {
    var endpoint =
      "https://www.gafaig.com/api/verify/" + encodeURIComponent(registryId);

    var res = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    var data = await res.json();

    if (!res.ok || !data.ok || !data.verified) {
      throw new Error("Verification failed");
    }

    return data;
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-gafaig-id]");

    nodes.forEach(function (el) {
      var registryId = el.getAttribute("data-gafaig-id");
      if (!registryId) return;

      fetchVerification(registryId)
        .then(function (data) {
          renderWidget(el, registryId, data);
        })
        .catch(function () {
          renderError(
            el,
            "The certification record could not be verified at this time.",
            registryId
          );
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();