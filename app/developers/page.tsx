import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const EXAMPLE_ID = "GAFAIG-28dedd000ca5410c86e3a6633cd6639a";

export default function DevelopersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-10">

      <PublicPageHero
        eyebrow="Developers"
        title="Integrate GAFAIG verification in minutes"
        description="Embed verifiable AI governance certification directly into your product, website, or compliance workflow."
        secondaryDescription="All integrations resolve through the GAFAIG verification API and are cryptographically verifiable."
        actions={
          <>
            <PublicButtonLink href={`/api/verify/${EXAMPLE_ID}`} variant="primary">
              View Live Verify JSON
            </PublicButtonLink>
            <PublicButtonLink href={`/registry/${EXAMPLE_ID}`}>
              View Example Record
            </PublicButtonLink>
          </>
        }
      />

      {/* VERIFY API */}
      <Section title="Verify API">
        <CodeBlock>
{`GET https://www.gafaig.com/api/verify/${EXAMPLE_ID}`}
        </CodeBlock>

        <p className="text-sm text-black/70">
          Returns certification record + signed proof.
        </p>
      </Section>

      {/* BADGE */}
      <Section title="Badge Embed">
        <CodeBlock>
{`<img src="https://www.gafaig.com/badge/${EXAMPLE_ID}" />`}
        </CodeBlock>
      </Section>

      {/* WIDGET */}
      <Section title="Widget Embed">
        <CodeBlock>
{`<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${EXAMPLE_ID}"></div>`}
        </CodeBlock>
      </Section>

      {/* VERIFICATION */}
      <Section title="Independent Verification">
        <CodeBlock>
{`GET https://www.gafaig.com/api/.well-known/gafaig-public-key`}
        </CodeBlock>

        <p className="text-sm text-black/70">
          Use this public key to verify the signed payload returned by the verify API.
        </p>
      </Section>

    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-xl bg-black text-white p-4 text-sm overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}