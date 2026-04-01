(function () {
  async function verifyGAFAIG(registryId) {
    if (!registryId) {
      alert("Missing GAFAIG registry ID.");
      return;
    }

    const endpoint =
      "https://www.gafaig.com/api/verify/" + encodeURIComponent(registryId);

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.ok || !data.verified) {
        alert("Verification failed for " + registryId + ".");
        return;
      }

      const record = data.record || {};
      const lines = [
        "GAFAIG Verification: VERIFIED",
        "",
        "Entity: " + (record.entityName || "Unknown"),
        "Registry ID: " + (record.registryId || registryId),
        "Tier: " + (record.certifiedTier || "—"),
        "Band: " + (record.certifiedBand || "—"),
        "Decision: " + (record.decisionStatus || "—"),
        "Valid To: " + (record.validTo || "—"),
      ];

      alert(lines.join("\n"));
    } catch (err) {
      alert("Verification error. Please try again.");
    }
  }

  window.verifyGAFAIG = verifyGAFAIG;
})();