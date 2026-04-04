"use client";

import * as React from "react";
import Link from "next/link";
import AdminNav from "@/app/admin/_components/AdminNav";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import CaseTabs from "@/app/admin/verification/[caseId]/_components/CaseTabs";
import PublicButton from "@/app/_components/PublicButton";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

type FindingRow = {
  findingId: string;
  caseId: string;
  controlId: string;
  controlTitle: string;
  result: string;
  severity: string;
  rationale: string | null;
  createdAt: string;
  updatedAt: string;
};

type EvidenceRow = {
  evidenceId: string;
  caseId: string;
  evidenceType: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  storageRef: string | null;
  submittedBy: string | null;
  submittedAt: string;
  linkedAt?: string;
};

type ApiList = { ok: true; rows: any[] } | { ok: false; error: string };
type ApiEvidence = { ok: true; rows: any[] } | { ok: false; error: string };
type ApiPost = { ok: true; findingId: string } | { ok: false; error: string };

function fmt(v?: string | null) {
  return v ? String(v) : "—";
}

function prettify(v?: string | null) {
  return v ? String(v).replaceAll("_", " ").replaceAll("-", " ") : "—";
}

function truncateMiddle(s: string, head = 18, tail = 10) {
  if (!s) return "—";
  if (s.length <= head + tail + 1) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

function splitDateTime(ts?: string | null) {
  const v = (ts || "").trim();
  if (!v) return { d: "—", t: "" };
  const parts = v.split(" ");
  if (parts.length >= 2) return { d: parts[0], t: parts.slice(1).join(" ") };
  return { d: v, t: "" };
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function pillTone(value?: string) {
  const v = (value || "").toLowerCase();
  if (v === "pass" || v === "approved") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (v === "partial" || v === "needs_more_info") return "border-amber-200 bg-amber-50 text-amber-900";
  if (v === "fail" || v === "rejected" || v === "suspended") return "border-red-200 bg-red-50 text-red-900";
  return "border-gray-200 bg-gray-50 text-gray-800";
}