"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function ApplicantLoginPage() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/applicant/login",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email,
                password,
              }),
          },
        );

      const payload =
        (await response
          .json()
          .catch(
            () => ({}),
          )) as {
          ok?: boolean;
          error?: string;
        };

      if (
        !response.ok ||
        !payload.ok
      ) {
        setError(
          payload.error ||
            "Unable to sign in.",
        );

        return;
      }

      const requestedNext =
        searchParams.get(
          "next",
        );

      const destination =
        requestedNext &&
        requestedNext.startsWith(
          "/applicant",
        ) &&
        requestedNext !==
          "/applicant/login"
          ? requestedNext
          : "/applicant/dashboard";

      router.replace(
        destination,
      );

      router.refresh();
    } catch {
      setError(
        "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        width:
          "min(760px, calc(100% - 32px))",
        margin:
          "48px auto 80px",
      }}
    >
      <section
        style={{
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "20px",
          padding:
            "32px",
          background:
            "#ffffff",
        }}
      >
        <p
          style={{
            margin:
              "0 0 10px",
            fontSize:
              "12px",
            letterSpacing:
              "0.18em",
            textTransform:
              "uppercase",
            color:
              "#6b7280",
          }}
        >
          Applicant Portal
        </p>

        <h1
          style={{
            margin:
              "0 0 12px",
            fontSize:
              "32px",
            lineHeight:
              1.1,
          }}
        >
          Sign in to your organization workspace
        </h1>

        <p
          style={{
            margin:
              "0 0 28px",
            color:
              "#4b5563",
            lineHeight:
              1.6,
          }}
        >
          Access your organization-scoped
          cases, evidence, requests,
          remediation records, certification
          records, progress, and operational
          guidance.
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <label
            htmlFor="applicant-email"
            style={{
              display:
                "block",
              marginBottom:
                "8px",
              fontWeight:
                600,
            }}
          >
            Email
          </label>

          <input
            id="applicant-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={
              email
            }
            onChange={(
              event,
            ) =>
              setEmail(
                event.target
                  .value,
              )
            }
            style={{
              width:
                "100%",
              boxSizing:
                "border-box",
              padding:
                "12px 14px",
              marginBottom:
                "20px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "10px",
              font:
                "inherit",
            }}
          />

          <label
            htmlFor="applicant-password"
            style={{
              display:
                "block",
              marginBottom:
                "8px",
              fontWeight:
                600,
            }}
          >
            Password
          </label>

          <input
            id="applicant-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={
              password
            }
            onChange={(
              event,
            ) =>
              setPassword(
                event.target
                  .value,
              )
            }
            style={{
              width:
                "100%",
              boxSizing:
                "border-box",
              padding:
                "12px 14px",
              marginBottom:
                "20px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "10px",
              font:
                "inherit",
            }}
          />

          {error ? (
            <p
              role="alert"
              style={{
                margin:
                  "0 0 18px",
                color:
                  "#b42318",
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={
              submitting
            }
            style={{
              border:
                "0",
              borderRadius:
                "999px",
              padding:
                "12px 20px",
              background:
                "#000000",
              color:
                "#ffffff",
              fontWeight:
                700,
              cursor:
                submitting
                  ? "wait"
                  : "pointer",
            }}
          >
            {submitting
              ? "Signing in..."
              : "Continue to Applicant Portal"}
          </button>
        </form>

        <p
          style={{
            margin:
              "24px 0 0",
            color:
              "#6b7280",
            fontSize:
              "14px",
            lineHeight:
              1.6,
          }}
        >
          Applicant access is
          organization-scoped. Signing in
          does not create governance,
          certification, publication,
          registry, or verification
          authority.
        </p>
      </section>
    </main>
  );
}