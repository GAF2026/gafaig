"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../_components/AdminNav";
import AdminPageHeader from "../_components/AdminPageHeader";
import PublicButton from "../../_components/PublicButton";
import PublicButtonLink from "../../_components/PublicButtonLink";

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
  }, [query]);

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
          verificationStatus: newVerification,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Failed to create participant`);
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

      <main className="mx-auto max-w-[1180px] px-6 py-10">
        <AdminPageHeader
          title="Participants"
          description="Manage organizations and institutions used in verification workflow and registry publishing."
          meta={loading ? "Loading…" : `Showing ${rows.length} of ${total}`}
        />

        {/* CREATE */}
        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Create participant
          </h2>

          {createError && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {createError}
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            />

            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            >
              {TYPE_OPTIONS.filter((v) => v !== "all").map((t) => (
                <option key={t}>{prettify(t)}</option>
              ))}
            </select>

            <input
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              placeholder="Country"
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            />

            <input
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              placeholder="Website"
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            />

            <select
              value={newVerification}
              onChange={(e) => setNewVerification(e.target.value)}
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            >
              {VERIFICATION_OPTIONS.filter((v) => v !== "all").map((v) => (
                <option key={v}>{prettify(v)}</option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <PublicButton onClick={createParticipant} disabled={creating}>
              {creating ? "Creating…" : "Create participant"}
            </PublicButton>
          </div>
        </section>

        {/* FILTERS */}
        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            FILTERS
          </div>

          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Filter participants
          </h2>

          <p className="mt-4 text-[14px] text-black/70">
            Narrow down participant records by search, verification status, or participant type.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 items-end">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search..."
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            />

            <select
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            >
              {VERIFICATION_OPTIONS.map((v) => (
                <option key={v}>{prettify(v)}</option>
              ))}
            </select>

            <select
              value={participantType}
              onChange={(e) => setParticipantType(e.target.value)}
              className="rounded-xl border border-black/15 px-4 py-3 text-sm"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t}>{prettify(t)}</option>
              ))}
            </select>

            <div className="ml-auto flex gap-3">
              <PublicButton variant="secondary" onClick={clearFilters}>
                Clear
              </PublicButton>
              <PublicButton variant="secondary" onClick={load}>
                Refresh
              </PublicButton>
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6">
          <table className="w-full text-sm">
            <thead className="text-left text-black/60">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Country</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.participantId}
                  className="cursor-pointer border-t hover:bg-black/[0.02]"
                  onClick={() =>
                    (window.location.href = `/admin/participants/${r.participantId}`)
                  }
                >
                  <td className="py-3 font-semibold">{r.name}</td>
                  <td>{prettify(r.participantType)}</td>
                  <td>{prettify(r.verificationStatus)}</td>
                  <td>{r.country}</td>
                  <td>{r.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between">
            <div>Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <PublicButton
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </PublicButton>
              <PublicButton
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </PublicButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}