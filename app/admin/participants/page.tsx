"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../_components/AdminNav";
import AdminPageHeader from "../_components/AdminPageHeader";

type ParticipantRow = {
  participantId: string;
  participantType: string | null;
  jurisdictionLevel: string | null;
  name: string | null;
  country: string | null;
  website: string | null;
  profileSlug: string | null;
  designationLevel: string | null;
  verificationStatus: string | null;
  contactEmail: string | null;
  publicSummary: string | null;
  logoUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type ApiResp = {
  ok: boolean;
  rows: ParticipantRow[];
  total: number;
  page: number;
  pageSize: number;
  filters: { search: string; verificationStatus: string; participantType: string };
  error?: string;
};

const DESIGNATION_PRESETS = [
  { value: "", label: "— (none)" },
  { value: "observer", label: "Observer" },
  { value: "participant", label: "Participant" },
  { value: "contributor", label: "Contributor" },
  { value: "verified-participant", label: "Verified Participant" },
  { value: "certified-alignment", label: "Certified Alignment" },
  { value: "governance-partner", label: "Governance Partner" },
];

const TYPE_OPTIONS = ["all", "company", "government", "ngo", "university", "research", "other"] as const;
const VERIFICATION_OPTIONS = ["all", "unverified", "pending", "verified", "suspended"] as const;

function prettify(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("-", " ").replaceAll("_", " ");
}

export default function AdminParticipantsPage() {
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("all");
  const [participantType, setParticipantType] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ApiResp | null>(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("company");
  const [newJurisdiction, setNewJurisdiction] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newVerification, setNewVerification] = useState("unverified");

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rows = data?.rows ?? [];

  const query = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("pageSize", String(pageSize));
    qs.set("search", search);
    qs.set("verificationStatus", verificationStatus);
    qs.set("participantType", participantType);
    return qs.toString();
  }, [page, pageSize, search, verificationStatus, participantType]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/participants?${query}`, {
        cache: "no-store",
        credentials: "include",
      });

      const json = (await res.json()) as ApiResp;

      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Failed to load participants (${res.status})`);
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load participants");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  async function createParticipant() {
    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/admin/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantType: newType,
          jurisdictionLevel: newJurisdiction || null,
          name: newName,
          country: newCountry || null,
          website: newWebsite || null,
          designationLevel: newDesignation || null,
          verificationStatus: newVerification || "unverified",
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Failed to create participant (${res.status})`);
      }

      setNewName("");
      setNewJurisdiction("");
      setNewCountry("");
      setNewWebsite("");
      setNewDesignation("");
      setNewVerification("unverified");
      setPage(1);
      await load();
    } catch (e: any) {
      setCreateError(e?.message ?? "Failed to create participant");
    } finally {
      setCreating(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setVerificationStatus("all");
    setParticipantType("all");
    setPage(1);
  }

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <AdminPageHeader
          title="Participants"
          description="Manage organizations and institutions that appear in the private verification workflow and public registry."
          meta={loading ? "Loading…" : `Showing ${rows.length} of ${total}`}
        />

        <section className="rounded-2xl border border-black/10 p-5">
          <h2 className="text-[16px] font-semibold text-black">Create participant</h2>

          <p className="mt-2 max-w-[860px] text-[14px] leading-[1.7] text-black/65">
            Add a participant record to support registry publishing and verification workflow testing.
          </p>

          {createError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="text-[14px] font-semibold text-red-700">Error</div>
              <div className="mt-1 text-[14px] text-black/80">{createError}</div>
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Name *
              </div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., OpenAI / City of Newark"
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Participant type *
              </div>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {TYPE_OPTIONS.filter((v) => v !== "all").map((option) => (
                  <option key={option} value={option}>
                    {prettify(option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Jurisdiction level
              </div>
              <input
                value={newJurisdiction}
                onChange={(e) => setNewJurisdiction(e.target.value)}
                placeholder="country / state / city / agency"
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Country
              </div>
              <input
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder="e.g., United States"
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Website
              </div>
              <input
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Designation level
              </div>
              <select
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {DESIGNATION_PRESETS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Verification status
              </div>
              <select
                value={newVerification}
                onChange={(e) => setNewVerification(e.target.value)}
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {VERIFICATION_OPTIONS.filter((v) => v !== "all").map((option) => (
                  <option key={option} value={option}>
                    {prettify(option)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => createParticipant()}
              disabled={creating || newName.trim().length === 0}
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white hover:bg-black/90 disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create participant"}
            </button>
          </div>
        </section>

        <section className="mt-10 border-t border-black/10 pt-8">
          <div className="flex flex-wrap items-end gap-5">
            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Search
              </div>
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search name, country, website, slug, designation…"
                className="w-[360px] max-w-full rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Verification
              </div>
              <select
                value={verificationStatus}
                onChange={(e) => {
                  setPage(1);
                  setVerificationStatus(e.target.value);
                }}
                className="w-[170px] rounded-xl border borderblack/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {VERIFICATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All verification" : prettify(option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                Type
              </div>
              <select
                value={participantType}
                onChange={(e) => {
                  setPage(1);
                  setParticipantType(e.target.value);
                }}
                className="w-[150px] rounded-xl border border-black/15 px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All types" : prettify(option)}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto flex flex-wrap gap-3">
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-3 text-[14px] font-semibold hover:bg-black/[0.04]"
              >
                Clear
              </button>

              <button
                onClick={() => load()}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-3 text-[14px] font-semibold hover:bg-black/[0.04] disabled:opacity-60"
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          <div className="mt-4 text-[16px] leading-[1.7] text-black/65">
            {loading ? "Loading…" : `Showing ${rows.length} of ${total} — click a row to edit`}
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-[14px] font-semibold text-red-700">Error</div>
            <div className="mt-1 text-[14px] text-black/80">{error}</div>
          </div>
        ) : null}

        <section className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-[14px]">
              <thead className="bg-black/[0.03] text-left text-black">
                <tr>
                  {["Name", "Type", "Verification", "Designation", "Country", "Slug", "Updated"].map((h) => (
                    <th key={h} className="px-4 py-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.participantId}
                    onClick={() =>
                      (window.location.href = `/admin/participants/${encodeURIComponent(r.participantId)}`)
                    }
                    className="cursor-pointer border-t border-black/5 hover:bg-black/[0.02]"
                    title="Click to edit"
                  >
                    <td className="px-4 py-4">
                      <span className="font-semibold underline underline-offset-2">
                        {r.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-black/75">{prettify(r.participantType)}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-[12px] font-semibold text-black/80 bg-black/[0.02]">
                        {prettify(r.verificationStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-black/75">{prettify(r.designationLevel)}</td>
                    <td className="px-4 py-4 text-black/75">{r.country ?? "—"}</td>
                    <td className="px-4 py-4 text-black/65">{r.profileSlug ?? "—"}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-black/65">
                      {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}

                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-black/60">
                      No participants found. Create one above to test.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-black/10 px-4 py-4">
            <div className="text-[14px] text-black/65">
              Page {page} of {totalPages}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold disabled:opacity-40"
              >
                Prev
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}