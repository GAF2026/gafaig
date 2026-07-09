import { NextResponse } from "next/server";
import { getApplicantSession } from "@/lib/applicant-auth";
import { executeQuery } from "@/lib/snowflake";

type RouteContext = {
  params: {
    requestId: string;
  };
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await getApplicantSession();

    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const requestId = decodeURIComponent(params.requestId);

    const rows = await executeQuery<{
      REQUEST_ID: string;
      CASE_ID: string;
      ORGANIZATION_NAME: string;
      CONTACT_EMAIL: string | null;
      REQUEST_TYPE: string;
      REQUEST_STATUS: string;
      CASE_STATUS: string;
      SOURCE: string;
      SOURCE_URL: string | null;
      REQUEST_TEXT: string | null;
      RESPONSE_TEXT: string | null;
      SUBMITTED_AT: string | null;
      UPDATED_AT: string | null;
    }>(
      `
      SELECT
          REQUEST_ID,
          CASE_ID,
          ORGANIZATION_NAME,
          CONTACT_EMAIL,
          REQUEST_TYPE,
          REQUEST_STATUS,
          CASE_STATUS,
          SOURCE,
          SOURCE_URL,
          REQUEST_TEXT,
          RESPONSE_TEXT,
          SUBMITTED_AT,
          UPDATED_AT
      FROM CORE_API.V_APPLICANT_INFORMATION_REQUESTS
      WHERE ORGANIZATION_ID = ?
        AND REQUEST_ID = ?
      `,
      [
        session.organizationId,
        requestId,
      ],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Information request not found.",
        },
        { status: 404 },
      );
    }

    const record = rows[0];

    return NextResponse.json({
      ok: true,

      informationRequest: {
        requestId: record.REQUEST_ID,
        caseId: record.CASE_ID,
        organizationName: record.ORGANIZATION_NAME,
        contactEmail: record.CONTACT_EMAIL,
        requestType: record.REQUEST_TYPE,
        requestStatus: record.REQUEST_STATUS,
        caseStatus: record.CASE_STATUS,
        source: record.SOURCE,
        sourceUrl: record.SOURCE_URL,
        requestText: record.REQUEST_TEXT,
        responseText: record.RESPONSE_TEXT,
        submittedAt: record.SUBMITTED_AT,
        updatedAt: record.UPDATED_AT,
      },

      workflow: [
        {
          status: "COMPLETE",
          title: "Information Request Issued",
        },
        {
          status: "COMPLETE",
          title: "Applicant Notified",
        },
        {
          status:
            record.RESPONSE_TEXT
              ? "COMPLETE"
              : "PENDING",
          title: "Applicant Response",
        },
        {
          status: "PENDING",
          title: "Governance Review",
        },
        {
          status: "PENDING",
          title: "Decision Update",
        },
      ],

      authorityBoundaries: [
        {
          title: "View Request",
          description:
            "Allowed for applicant users.",
        },
        {
          title: "Submit Response",
          description:
            "Allowed for applicant users.",
        },
        {
          title: "Modify Findings",
          description:
            "Not allowed for applicant users.",
        },
        {
          title: "Modify Decision",
          description:
            "Not allowed for applicant users.",
        },
        {
          title: "Publish Registry",
          description:
            "Not allowed for applicant users.",
        },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant information request detail query failed.",
      },
      { status: 500 },
    );
  }
}