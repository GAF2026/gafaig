(function () {
  if (window.GAFAIG) return;

  const VERSION = "1.0.0";
  const BASE = "https://www.gafaig.com";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function fetchVerify(registryId) {
    const res = await fetch(`${BASE}/api/verify/${encodeURIComponent(registryId)}`);
    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error("Verification failed");
    }

    return data;
  }

  function render(el, registryId, data) {
    const record = data.record || {};
    const entity = record.entityName || "Unknown Entity";

    el.innerHTML = `
      <div style="font-family:Inter,Arial;padding:20px;border:1px solid #e5e7eb;border-radius:20px;">
        <div style="font-weight:800;font-size:20px;">${escapeHtml(entity)}</div>
        <div style="margin-top:8px;font-size:13px;color:#555;">
          Verified via GAFAIG
        </div>

        <div style="margin-top:12px;">
          <img src="${BASE}/badge/${registryId}" style="max-width:100%;border-radius:10px;" />
        </div>

        <div style="margin-top:14px;display:flex;gap:8px;">
          <a href="${BASE}/registry/${registryId}" target="_blank"
             style="padding:8px 12px;border-radius:999px;background:#111;color:#fff;text-decoration:none;">
            View
          </a>

          <a href="${BASE}/api/verify/${registryId}" target="_blank"
             style="padding:8px 12px;border-radius:999px;border:1px solid #111;text-decoration:none;">
            Verify
          </a>
        </div>
      </div>
    `;
  }

  function renderError(el, registryId) {
    el.innerHTML = `
      <div style="padding:16px;border:1px solid #fca5a5;border-radius:16px;">
        Verification unavailable<br/>
        <a href="${BASE}/registry/${registryId}" target="_blank">Open record</a>
      </div>
    `;
  }

  async function renderOne(el) {
    const id = el.getAttribute("data-gafaig-id");
    if (!id) return;

    try {
      const data = await fetchVerify(id);
      render(el, id, data);
    } catch {
      renderError(el, id);
    }
  }

  function scan() {
    document.querySelectorAll("[data-gafaig-id]").forEach(renderOne);
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scan);
    } else {
      scan();
    }
  }

  async function verify(registryId) {
    return fetchVerify(registryId);
  }

  window.GAFAIG = {
    version: VERSION,
    init,
    scan,
    render: renderOne,
    verify,
  };

  init();
})();