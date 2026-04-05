(function () {
  if (!window.GAFAIG) {
    console.warn("GAFAIG SDK not loaded");
    return;
  }

  window.verifyGAFAIG = async function (registryId) {
    try {
      const data = await window.GAFAIG.verify(registryId);

      const modal = document.createElement("div");
      modal.style = `
        position:fixed;inset:0;background:rgba(0,0,0,.4);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;
      `;

      modal.innerHTML = `
        <div style="background:#fff;padding:20px;border-radius:16px;max-width:420px;width:100%;">
          <div style="font-weight:800;font-size:18px;">Verification Result</div>

          <div style="margin-top:10px;">
            ${data.verified ? "✅ Verified" : "❌ Not Verified"}
          </div>

          <div style="margin-top:10px;font-size:12px;color:#555;">
            ${data.registryId}
          </div>

          <div style="margin-top:16px;">
            <button onclick="this.closest('div[style]').parentNode.remove()"
              style="padding:8px 12px;border-radius:999px;background:#111;color:#fff;border:none;">
              Close
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
    } catch (e) {
      alert("Verification failed");
    }
  };
})();