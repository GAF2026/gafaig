(function () {
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function badge(text, filled) {
    return (
      '<span style="' +
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "border-radius:9999px",
        "padding:6px 10px",
        "font-size:11px",
        "font-weight:700",
        "letter-spacing:.08em",
        "text-transform:uppercase",
        "border:1px solid #111111",
        filled
          ? "background:#111111;color:#ffffff"
          : "background:#ffffff;color:#111111",
      ].join(";") +
      '">' +
      escapeHtml(text) +
      "</span>"
    );
  }

  function renderError(el, message) {
    el.innerHTML =
      '<div style="' +
      [
        "border:1px solid #d4d4d8",
        "border-radius:20px",
        "padding:16px",
        "font-family:Arial,Helvetica,sans-serif",
        "background:#ffffff",
        "color:#111111",
        "max-width:460px",
      ].join(";") +
      '">' +
      '<div style="font-size:14px;font-weight:700;">GAFAIG verification unavailable</div>' +
      '<div style="margin-top:8px;font-size:13px;line-height:1.6;color:#52525b;">' +
      escapeHtml(message) +
      "</div>" +
      "</div>";
  }

  async function renderWidget(el, registryId) {
    const endpoint =
      "https://www.gafaig.com/api/verify/" + encodeURIComponent(registryId);

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.ok || !data.verified) {
        renderError(el, "The certification record could not be verified.");
        return;
      }

      const record = data.record || {};
      const entityName = record.entityName || "Unknown Entity";
      const registryUrl =
        "https://www.gafaig.com/registry/" + encodeURIComponent(registryId);
      const badgeUrl =
        "https://www.gafaig.com/badge/" + encodeURIComponent(registryId);

      el.innerHTML =
        '<div style="' +
        [
          "border:1px solid #d4d4d8",
          "border-radius:24px",
          "padding:20px",
          "font-family:Arial,Helvetica,sans-serif",
          "background:#ffffff",
          "color:#111111",
          "max-width:460px",
          "box-shadow:0 1px 2px rgba(0,0,0,.04)",
        ].join(";") +
        '">' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        badge("Verified", true) +
        badge("GAFAIG", false) +
        "</div>" +
        '<div style="margin-top:14px;font-size:24px;line-height:1.15;font-weight:800;">' +
        escapeHtml(entityName) +
        "</div>" +
        '<div style="margin-top:8px;font-size:14px;line-height:1.7;color:#52525b;">' +
        "Public certification record independently verifiable through GAFAIG." +
        "</div>" +
        '<div style="margin-top:16px;border:1px solid #e4e4e7;border-radius:18px;padding:12px;background:#fafafa;">' +
        '<img src="' +
        badgeUrl +
        '" alt="' +
        escapeHtml(entityName) +
        ' GAFAIG badge" style="max-width:100%;height:auto;display:block;" />' +
        "</div>" +
        '<div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
        '<div style="border:1px solid #e4e4e7;border-radius:16px;padding:12px;">' +
        '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#71717a;">Tier / Band</div>' +
        '<div style="margin-top:8px;font-size:14px;font-weight:700;">' +
        escapeHtml(
          (record.certifiedTier || "—") +
            " · " +
            (record.certifiedBand || "—")
        ) +
        "</div>" +
        "</div>" +
        '<div style="border:1px solid #e4e4e7;border-radius:16px;padding:12px;">' +
        '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#71717a;">Decision</div>' +
        '<div style="margin-top:8px;font-size:14px;font-weight:700;">' +
        escapeHtml(record.decisionStatus || "—") +
        "</div>" +
        "</div>" +
        "</div>" +
        '<a href="' +
        registryUrl +
        '" target="_blank" rel="noopener noreferrer" style="' +
        [
          "margin-top:18px",
          "display:inline-flex",
          "align-items:center",
          "justify-content:center",
          "border-radius:9999px",
          "border:1px solid #111111",
          "padding:12px 16px",
          "font-size:14px",
          "font-weight:700",
          "text-decoration:none",
          "background:#111111",
          "color:#ffffff",
        ].join(";") +
        '">' +
        "Open GAFAIG record" +
        "</a>" +
        "</div>";
    } catch (err) {
      renderError(el, "A network error prevented verification.");
    }
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-gafaig-id]");
    nodes.forEach(function (el) {
      var registryId = el.getAttribute("data-gafaig-id");
      if (registryId) {
        renderWidget(el, registryId);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();