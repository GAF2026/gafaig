"use client";

import { useEffect, useState } from "react";
import AdminShell from "../../../_components/AdminShell";
import CaseTabs from "../_components/CaseTabs";

type AISystemRow = {
  SYSTEM_ID?: string;
  REGISTRY_ID?: string | null;
  CASE_ID?: string | null;
  SYSTEM_NAME?: string | null;
  SYSTEM_TYPE?: string | null;
  INTENDED_USE?: string | null;
  DEPLOYMENT_STATUS?: string | null;
  OVERSIGHT_LEVEL?: string | null;
  RISK_TIER?: string | null;
  PUBLIC_SUMMARY?: string | null;
  IS_PUBLIC?: boolean | null;
  DISPLAY_ORDER?: number | null;
  CREATED_AT?: string | null;
  UPDATED_AT?: string | null;
};

export default function AISystemsPage({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId;

  const [rows, setRows] = useState<AISystemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const [registryId, setRegistryId] = useState("");
  const [systemName, setSystemName] = useState("");
  const [systemType, setSystemType] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [deploymentStatus, setDeploymentStatus] = useState("");
  const [oversightLevel, setOversightLevel] = useState("");
  const [riskTier, setRiskTier] = useState("");
  const [publicSummary, setPublicSummary] = useState("");

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/verification/${encodeURIComponent(caseId)}/ai-systems`, {
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to load AI systems (${res.status})`);
      }

      setRows(Array.isArray(data.rows) ? data.rows : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load AI systems");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function createSystem() {
    setSaving(true);
    setErr(null);
    setOkMsg(null);

    try {
      if (!systemName.trim()) {
        throw new Error("System name is required.");
      }

      const res = await fetch(`/api/admin/verification/${encodeURIComponent(caseId)}/ai-systems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          registryId: registryId.trim() || null,
          systemName: systemName.trim(),
          systemType: systemType.trim() || null,
          intendedUse: intendedUse.trim() || null,
          deploymentStatus: deploymentStatus.trim() || null,
          oversightLevel: oversightLevel.trim() || null,
          riskTier: riskTier.trim() || null,
          publicSummary: publicSummary.trim() || null,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to create AI system (${res.status})`);
      }

      setRegistryId("");
      setSystemName("");
      setSystemType("");
      setIntendedUse("");
      setDeploymentStatus("");
      setOversightLevel("");
      setRiskTier("");
      setPublicSummary("");

      setOkMsg("AI system created.");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to create AI system");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  return (
    <AdminShell title={`Admin • Verification • AI Systems • ${caseId}`}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">AI Systems Covered by Certification</h1>

        <p className="mt-2 text-gray-600">
          Define which AI systems are included in the scope of this certification. Only approved public
          fields will appear in the registry.
        </p>

        <div className="mt-6">
          <CaseTabs caseId={caseId} />
        </div>

        {err ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {err}
          </div>
        ) : null}

        {okMsg ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
            {okMsg}
          </div>
        ) : null}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold">Add AI System</div>
          <p className="mt-1 text-sm text-gray-600">
            Create an AI system disclosure record for this certification case.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Registry ID</label>
              <input
                value={registryId}
                onChange={(e) => setRegistryId(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4"
                placeholder="Optional until publish"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">System name *</label>
              <input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4"
                placeholder="Oxford AI Tutor"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">System type</label>
              <input
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4"
                placeholder="LLM / classifier / decision support"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Deployment status</label>
              <input
                value={deploymentStatus}
                onChange={(e) => setDeploymentStatus(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4"
                placeholder="pilot / production / internal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Oversight level</label>
              <input
                value={oversightLevel}
                onChange={(e) => setOversightLevel(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4"
                placeholder="human-in-the-loop"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Risk tier</label>
              <input
                value={riskTier}
                onChange={(e) => setRiskTier(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4"
                placeholder="low / medium / high"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Intended use</label>
              <input
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4"
                placeholder="Educational tutoring for students"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Public summary</label>
              <textarea
                value={publicSummary}
                onChange={(e) => setPublicSummary(e.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-xl border border-gray-200 px-4 py-3"
                placeholder="Short public description suitable for the registry"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={createSystem}
              disabled={saving}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Add AI System"}
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold">AI Systems ({rows.length})</div>
          <p className="mt-1 text-sm text-gray-600">
            Systems currently attached to this certification case.
          </p>

          <div className="mt-5 overflow-auto rounded-2xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3">System</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Deployment</th>
                  <th className="px-4 py-3">Oversight</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-gray-600">
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-gray-600">
                      No AI systems added yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={r.SYSTEM_ID || i} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{r.SYSTEM_NAME || "—"}</div>
                        {r.PUBLIC_SUMMARY ? (
                          <div className="mt-1 text-xs text-gray-600">{r.PUBLIC_SUMMARY}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{r.SYSTEM_TYPE || "—"}</td>
                      <td className="px-4 py-3">{r.DEPLOYMENT_STATUS || "—"}</td>
                      <td className="px-4 py-3">{r.OVERSIGHT_LEVEL || "—"}</td>
                      <td className="px-4 py-3">{r.RISK_TIER || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}