(function () {
  window.verifyGAFAIG = async function (registryId) {
    const endpoint = `https://www.gafaig.com/api/verify/${registryId}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!data.ok || !data.verified) {
        alert("❌ Verification failed");
        return;
      }

      const record = data.record || {};

      alert(
        `✅ VERIFIED\n\n` +
          `Entity: ${record.entityName}\n` +
          `Tier: ${record.certifiedTier} ${record.certifiedBand}\n` +
          `Status: ${record.decisionStatus}\n` +
          `Valid To: ${record.validTo}`
      );
    } catch (err) {
      alert("Verification error");
    }
  };
})();