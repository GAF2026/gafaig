"use client";

import { useState } from "react";

type SubmitState =
  | { kind: "idle"; message: "" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export default function ApplyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
    message: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ kind: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      orgName: String(formData.get("orgName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      country: String(formData.get("country") || "").trim(),
      systemName: String(formData.get("systemName") || "").trim(),
      systemType: String(formData.get("systemType") || "").trim(),
    };

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        setSubmitState({
          kind: "error",
          message:
            result?.error ||
            "Application submission failed. Please review your information and try again.",
        });
        return;
      }

      setSubmitState({
        kind: "success",
        message: `Application received. Request ID: ${result.requestId}. Your submission has entered the private GAFAIG verification intake process. Public registry visibility happens only after review, certification, and publication.`,
      });

      form.reset();
    } catch {
      setSubmitState({
        kind: "error",
        message:
          "Application submission failed. Please review your information and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label="Organization name"
          name="orgName"
          placeholder="Enter organization name"
          required
          helpText="The legal or operating name of the organization seeking GAFAIG review."
        />

        <FormField
          label="Contact email"
          name="email"
          type="email"
          placeholder="Enter contact email"
          required
          helpText="This is the primary contact for application follow-up and verification intake."
        />

        <FormField
          label="Country"
          name="country"
          placeholder="Enter country"
          helpText="Country where the organization primarily operates or where review should be anchored."
        />

        <FormField
          label="AI system name"
          name="systemName"
          placeholder="Enter system name"
          helpText="Name of the AI system, product, service, or internal capability being submitted."
        />

        <FormField
          label="System type"
          name="systemType"
          placeholder="e.g. LLM, assistant, recommendation engine"
          helpText="A short description of the system category to help GAFAIG route the intake correctly."
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
          What happens after submission
        </div>
        <div className="mt-3 space-y-2 text-[14px] leading-7 text-black/72">
          <p>
            1. Your application enters the private GAFAIG verification intake process.
          </p>
          <p>
            2. GAFAIG reviews scope, organization details, and system context before moving into structured verification.
          </p>
          <p>
            3. Public visibility does not happen at application. Public registry listing occurs only after review, certification, and publication.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Begin GAFAIG verification intake"}
        </button>

        {submitState.kind === "success" ? (
          <div className="max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-800">
            {submitState.message}
          </div>
        ) : null}

        {submitState.kind === "error" ? (
          <div className="max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800">
            {submitState.message}
          </div>
        ) : null}
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  placeholder,
  required = false,
  type = "text",
  helpText,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  helpText?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-black">
        {label}
        {required ? <span className="ml-1 text-black/45">*</span> : null}
      </div>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black outline-none transition focus:border-black/30"
      />
      {helpText ? (
        <div className="mt-2 text-[13px] leading-6 text-black/60">{helpText}</div>
      ) : null}
    </label>
  );
}