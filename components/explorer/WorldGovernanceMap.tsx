"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type MapCountryRow = {
  country: string;
  organizationCount: number;
  systemCount: number;
  highRiskSystemCount: number;
  avgGovernanceMaturityScore: number | null;
};

type Marker = {
  country: string;
  x: number;
  y: number;
};

const MARKERS: Marker[] = [
  { country: "United States", x: 180, y: 170 },
  { country: "Canada", x: 165, y: 125 },
  { country: "United Kingdom", x: 375, y: 110 },
  { country: "Switzerland", x: 398, y: 128 },
  { country: "Germany", x: 410, y: 122 },
  { country: "France", x: 390, y: 132 },
  { country: "Netherlands", x: 394, y: 116 },
  { country: "Australia", x: 705, y: 305 },
  { country: "Singapore", x: 612, y: 222 },
  { country: "China", x: 620, y: 145 },
  { country: "Japan", x: 690, y: 152 },
];

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Math.round(Number(value))} / 100`;
}

function markerSize(row: MapCountryRow | undefined) {
  if (!row) return 6;
  if (row.organizationCount >= 5) return 14;
  if (row.organizationCount >= 3) return 11;
  if (row.organizationCount >= 2) return 9;
  return 7;
}

function markerOpacity(row: MapCountryRow | undefined) {
  if (!row) return 0.35;
  if ((row.highRiskSystemCount ?? 0) >= 2) return 1;
  if ((row.systemCount ?? 0) >= 2) return 0.9;
  return 0.8;
}

export default function WorldGovernanceMap({
  rows,
}: {
  rows?: MapCountryRow[];
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const byCountry = useMemo(() => {
    const map = new Map<string, MapCountryRow>();
    for (const row of safeRows) {
      map.set(row.country, row);
    }
    return map;
  }, [safeRows]);

  const hovered = hoveredCountry ? byCountry.get(hoveredCountry) : null;

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-black">
            Global governance map
          </h2>
          <p className="mt-2 max-w-3xl text-[14px] leading-[1.7] text-black/70">
            Country markers show where GAFAIG-certified organizations and public
            AI system disclosures are currently represented. Click a marker to
            open the country drill-down page.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 px-4 py-3 text-[13px] text-black/70">
          <div>Marker size = organizations</div>
          <div className="mt-1">Marker intensity = system/risk presence</div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
          <svg
            viewBox="0 0 820 420"
            className="h-auto w-full"
            role="img"
            aria-label="Global AI governance map"
          >
            <rect x="0" y="0" width="820" height="420" fill="#fafafa" />

            <g fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1">
              <path d="M78 118l48-28 63 10 19 27-5 26-20 13-8 25-37 8-38-6-24-17-2-28z" />
              <path d="M235 255l36 8 12 18-10 21-40 5-17-18 4-23z" />
              <path d="M343 93l45-10 56 9 34 21-8 31-42 18-49-8-30-15-15-22z" />
              <path d="M395 168l25 5 19 18-5 28-20 14-24-6-16-18 4-24z" />
              <path d="M470 112l61-10 81 24 44 35-7 38-29 31-75 10-54-19-28-37 7-39z" />
              <path d="M632 272l61 6 44 25 15 34-22 19-63 7-43-19-17-37 8-24z" />
            </g>

            {MARKERS.map((marker) => {
              const row = byCountry.get(marker.country);
              const visible = Boolean(row);

              return (
                <g key={marker.country}>
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={markerSize(row)}
                    fill={visible ? "#111111" : "#9ca3af"}
                    opacity={markerOpacity(row)}
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredCountry(marker.country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    className={visible ? "cursor-pointer" : ""}
                  />
                  {visible ? (
                    <foreignObject
                      x={marker.x - 12}
                      y={marker.y - 12}
                      width="24"
                      height="24"
                    >
                      <Link
                        href={`/explorer/countries/${encodeURIComponent(
                          marker.country
                        )}`}
                        aria-label={`Open ${marker.country}`}
                        className="block h-6 w-6"
                      />
                    </foreignObject>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Hovered country
            </div>

            {hovered ? (
              <div className="mt-3">
                <div className="text-[20px] font-semibold text-black">
                  {hovered.country}
                </div>
                <div className="mt-3 grid gap-3">
                  <Info
                    label="Organizations"
                    value={String(hovered.organizationCount)}
                  />
                  <Info label="AI systems" value={String(hovered.systemCount)} />
                  <Info
                    label="High-risk systems"
                    value={String(hovered.highRiskSystemCount)}
                  />
                  <Info
                    label="Avg maturity"
                    value={formatScore(hovered.avgGovernanceMaturityScore)}
                  />
                </div>

                <div className="mt-4">
                  <Link
                    href={`/explorer/countries/${encodeURIComponent(
                      hovered.country
                    )}`}
                    className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                  >
                    View country detail
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-[14px] leading-[1.7] text-black/70">
                Hover over a country marker to inspect governance coverage and
                click through to its detail page.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Countries on map
            </div>
            <div className="mt-3 space-y-2">
              {safeRows.length === 0 ? (
                <div className="text-[14px] text-black/70">
                  No mapped countries available yet.
                </div>
              ) : (
                safeRows.map((row) => (
                  <div
                    key={row.country}
                    className="flex items-center justify-between gap-4 rounded-xl border border-black/5 px-3 py-2"
                  >
                    <Link
                      href={`/explorer/countries/${encodeURIComponent(
                        row.country
                      )}`}
                      className="text-[14px] text-black hover:underline"
                    >
                      {row.country}
                    </Link>
                    <div className="text-[13px] text-black/65">
                      {row.organizationCount} orgs
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value}</div>
    </div>
  );
}