(function () {
  async function renderWidget(el, registryId) {
    const endpoint = `https://www.gafaig.com/api/verify/${registryId}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!data.ok || !data.verified) {
        el.innerHTML = `<div style="color:red">Verification failed</div>`;
        return;
      }

      const r = data.record || {};

      el.innerHTML = `
        <div style="
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:16px;
          font-family:sans-serif;
          max-width:400px;
        ">
          <div style="font-weight:600;margin-bottom:8px;">
            ${r.entityName}
          </div>
          <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">
            GAFAIG Certified
          </div>
          <div style="font-size:14px;">
            Tier: ${r.certifiedTier} ${r.certifiedBand}
          </div>
          <div style="font-size:14px;">
            Status: ${r.decisionStatus}
          </div>
          <div style="font-size:12px;color:#6b7280;margin-top:8px;">
            Valid to: ${r.validTo}
          </div>
        </div>
      `;
    } catch {
      el.innerHTML = `<div>Verification error</div>`;
    }
  }

  document.querySelectorAll("[data-gafaig-id]").forEach((el) => {
    const id = el.getAttribute("data-gafaig-id");
    if (id) renderWidget(el, id);
  });
})();