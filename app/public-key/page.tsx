import PublicButtonLink from "../_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div>
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        {eyebrow}
      </div>
      <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 break-words text-[16px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

function BulletCard({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
      <span className="text-[15px] leading-7 text-black/75">{text}</span>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
      <code>{code}</code>
    </pre>
  );
}

const publicKeyCurl = `curl https://www.gafaig.com/api/.well-known/gafaig-public-key`;

const verifyCurl = `curl https://www.gafaig.com/api/verify/GAFAIG-00000001`;

const verificationRule = `Verification MUST use:

proof.messageString
proof.signature
proof.verificationKeyUrl

Do not reconstruct the payload from record fields.`;

export default function PublicKeyPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            GAFAIG PUBLIC KEY
          </div>

          <h1 className="mt-4 max-w-[920px] text-[42px] font-semibold tracking-tight text-black">
            Public verification key for GAFAIG signed verification proof
          </h1>

          <p className="mt-5 max-w-[920px] text-[16px] leading-8 text-black/75">
            GAFAIG uses a public verification key to allow external systems to
            validate signed AI governance certification surfaces. The public key
            verifies that a GAFAIG signed verification proof payload was signed by GAFAIG and has not
            been altered.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/api/.well-known/gafaig-public-key"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Open Public Key JSON
            </a>

            <PublicButtonLink href="/developers" variant="secondary">
              Developer Docs
            </PublicButtonLink>

            <PublicButtonLink href="/verify" variant="secondary">
              Open Verification Surface
            </PublicButtonLink>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard label="Algorithm" value="Ed25519" />
          <InfoCard
            label="Public Key Endpoint"
            value="/api/.well-known/gafaig-public-key"
          />
          <InfoCard
            label="Canonical Payload"
            value="proof.messageString"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="HOW VERIFICATION WORKS"
            title="Signed verification proof makes certification independently verifiable"
            body="Each GAFAIG verification surface response includes a canonical messageString and signature. External systems fetch the public key, verify the signature against the exact messageString, and then evaluate lifecycle and eligibility fields."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Fetch the public verification surface response from /api/verify/{registryId}." />
            <BulletCard text="Read proof.messageString exactly as returned." />
            <BulletCard text="Read proof.signature and proof.verificationKeyUrl." />
            <BulletCard text="Fetch the GAFAIG public key and validate the signature." />
            <BulletCard text="Trust only active, public, eligible certified certification surfaces." />
            <BulletCard text="Never reconstruct messageString from JSON fields." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="PUBLIC KEY ENDPOINT"
            title="Fetch the GAFAIG public key"
            body="The public key endpoint exposes the verification key used by external systems to validate GAFAIG signatures."
          />

          <div className="mt-6">
            <CodeBlock code={publicKeyCurl} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="VERIFY ENDPOINT"
            title="Fetch a signed verification payload"
            body="The verify endpoint returns the public certification surface, proof object, signature, messageString, and public key URL for a GAFAIG certification surface."
          />

          <div className="mt-6">
            <CodeBlock code={verifyCurl} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="CANONICAL RULE"
            title="Verify the exact messageString"
            body="Independent verification depends on the exact signed payload. Any change to whitespace, ordering, timestamp format, escaping, or field values invalidates the signature."
          />

          <div className="mt-6">
            <CodeBlock code={verificationRule} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="TRUST CLAIM RULE"
            title="When a GAFAIG certification surface may be cryptographically trusted"
            body="A downstream system may display a trusted GAFAIG certification surface claim only when the signature validates and the record satisfies the public governance trust contract."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Signature validates successfully against proof.messageString." />
            <BulletCard text="certificationStatus is CERTIFIED." />
            <BulletCard text="lifecycleStatus is active." />
            <BulletCard text="visibilityStatus is public." />
            <BulletCard text="verificationEligible is true." />
            <BulletCard text="badgeEligible is true." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="FAIL SAFE"
            title="If verification fails, do not trust the certification surface"
            body="If messageString is missing, the signature is missing, the key is unavailable, or signature validation fails, external systems must treat the certification surface as invalid or unavailable."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Missing messageString means verification is invalid." />
            <BulletCard text="Missing signature means no cryptographic proof is available." />
            <BulletCard text="Public key failure means verification is unavailable." />
            <BulletCard text="Signature mismatch means payload integrity failed." />
            <BulletCard text="Expired certification surfaces must not be shown as currently active." />
            <BulletCard text="Revoked certification surfaces must not be shown as cryptographically trusted." />
          </div>
        </section>
      </div>
    </main>
  );
}