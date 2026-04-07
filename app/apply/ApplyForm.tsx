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
            result?.error || "Application submission failed. Please try again.",
        });
        return;
      }

      setSubmitState({
        kind: "success",
        message: `Application received. Request ID: ${result.requestId}`,
      });

      form.reset();
    } catch {
      setSubmitState({
        kind: "error",
        message: "Application submission failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 lg:grid-cols-2">
      <FormField
        label="Organization name"
        name="orgName"
        placeholder="Enter organization name"
        required
      />
      <FormField
        label="Contact email"
        name="email"
        type="email"
        placeholder="Enter contact email"
        required
      />
      <FormField
        label="Country"
        name="country"
        placeholder="Enter country"
      />
      <FormField
        label="AI system name"
        name="systemName"
        placeholder="Enter system name"
      />
      <FormField
        label="System type"
        name="systemType"
        placeholder="e.g. LLM, assistant, recommendation engine"
      />

      <div className="lg:col-span-2 flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit application"}
        </button>

        {submitState.kind === "success" ? (
          <div className="text-sm font-medium text-green-700">
            {submitState.message}
          </div>
        ) : null}

        {submitState.kind === "error" ? (
          <div className="text-sm font-medium text-red-700">
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
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-black">{label}</div>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black outline-none transition focus:border-black/30"
      />
    </label>
  );
}