"use client";

import Link from "next/link";
import { useState } from "react";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getExplorerSummary,
  getRecentRegistryRecords,
} from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined) return "—";
  if (value <= 1) return `${Math.round(value * 100)}%`;
  return `${Math.round(value)}%`;
}

export default function ExplorerPageWrapper(props: any) {
  return <ExplorerPage {...props} />;
}

async function ExplorerPage() {
  const [summary, recentRecords] = await Promise.all([
    getExplorerSummary(),
    getRecentRegistryRecords(10),
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GLOBAL EXPLORER"
          title="Explore the public GAFAIG trust surface."
          description="Discover public certification records across organizations, countries, and AI systems using the canonical registry views published from Snowflake."
          secondaryDescription="The explorer provides a public discovery layer across the GAFAIG network."
          actions={
            <>
              <PublicButtonLink href="/registry">View Registry</PublicButtonLink>
              <PublicButtonLink href="/explorer/organizations" variant="secondary">
                Organizations
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Systems
              </PublicButtonLink>
              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Registry records" value={String(summary.totalRecords)} />
          <MetricCard label="Organizations" value={String(summary.totalOrganizations)} />
          <MetricCard label="Countries" value={String(summary.totalCountries)} />
          <MetricCard label="AI systems" value={String(summary.totalSystems)} />
        </section>

        <ExplorerTable recentRecords={recentRecords} />
      </div>
    </main>
  );
}

function ExplorerTable({ recentRecords }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, any>>({});

  async function loadBreakdown(registryId: string) {
    if (data[registryId]) {
      setExpanded(expanded === registryId ? null : registryId);
      return;
    }

    const res = await fetch(`/api/registry/${registryId}/score-breakdown`);
    const json = await res.json();

    setData((prev) => ({ ...prev, [registryId]: json }));
    setExpanded(registryId);
  }

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
      <h2 className="text-[32px] font-semibold">Latest public records</h2>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-black/60">
              <th className="py-3">Entity</th>
              <th>Country</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Certified</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {recentRecords.map((row: any) => (
              <>
                <tr key={row.registryId} className="border-b">
                  <td className="py-4">
                    <div className="font-semibold">{row.entityName}</div>
                    <div className="text-xs text-black/60">{row.registryId}</div>
                  </td>

                  <td>{row.country}</td>

                  <td>
                    {[row.certifiedTier, row.certifiedBand].filter(Boolean).join(" · ")}
                  </td>

                  <td>{row.decisionStatus}</td>

                  <td>{formatDate(row.certifiedAt)}</td>

                  <td className="space-x-3">
                    <Link href={`/registry/${row.registryId}`}>Open</Link>

                    <button
                      onClick={() => loadBreakdown(row.registryId)}
                      className="underline"
                    >
                      Explain
                    </button>
                  </td>
                </tr>

                {expanded === row.registryId && data[row.registryId] && (
                  <tr>
                    <td colSpan={6} className="bg-black/[0.02] p-6">
                      <ScoreBreakdown data={data[row.registryId]} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScoreBreakdown({ data }: any) {
  const dimensions = data?.dimensions || [];

  return (
    <div className="space-y-4">
      {dimensions.map((d: any, i: number) => (
        <div key={i} className="border rounded-xl p-4 bg-white">
          <div className="flex justify-between">
            <div className="font-semibold">{d.scoreDimension}</div>
            <div>{formatPercent(d.dimensionScorePct)}</div>
          </div>

          <div className="mt-3 space-y-2">
            {(d.components || []).map((c: any, j: number) => (
              <div key={j} className="flex justify-between text-sm">
                <span>{c.scoreComponent}</span>
                <span>{formatPercent(c.componentScorePct)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value }: any) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="text-xs text-black/60">{label}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}