'use client';

import { useSearchParams } from 'next/navigation';

export default function ContactPage() {
  const searchParams = useSearchParams();
  const sent = searchParams.get('sent');

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1rem' }}>
      <h1>Contact GAFAIG</h1>

      <p style={{ marginBottom: '2rem', opacity: 0.85 }}>
        Use the form below to reach the Global Authority for AI Governance. We
        welcome inquiries related to governance frameworks, partnerships,
        research collaboration, and general questions.
      </p>

      {sent && (
        <div
          style={{
            background: '#e6fffa',
            border: '1px solid #38b2ac',
            color: '#065f5b',
            padding: '1rem',
            borderRadius: 6,
            marginBottom: '2rem',
            fontWeight: 500,
          }}
        >
          Thank you — your message has been sent successfully.
        </div>
      )}

      <form
        action="https://formspree.io/f/xnjdgnoy"
        method="POST"
        style={{ display: 'grid', gap: '1.5rem' }}
      >
        {/* Redirect back to GAFAIG with success flag */}
        <input
          type="hidden"
          name="_redirect"
          value="https://www.gafaig.com/contact?sent=1"
        />

        {/* Full Name */}
        <div>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={inputStyle}
          />
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="organization">Organization (optional)</label>
          <input
            id="organization"
            name="organization"
            type="text"
            style={inputStyle}
          />
        </div>

        {/* Reason */}
        <div>
          <label htmlFor="reason">Reason for contacting</label>
          <select
            id="reason"
            name="reason"
            required
            style={inputStyle}
          >
            <option value="">Select one</option>
            <option value="general">General inquiry</option>
            <option value="partnership">Partnership</option>
            <option value="research">Research collaboration</option>
            <option value="governance">Governance framework</option>
            <option value="media">Media / press</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Consent */}
        <div style={{ fontSize: 14 }}>
          <label>
            <input type="checkbox" required /> I consent to being contacted
            regarding this inquiry and acknowledge the privacy policy.
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Send message
        </button>
      </form>

      <p style={{ fontSize: 12, opacity: 0.7, marginTop: '2rem' }}>
        By submitting this form, you consent to being contacted regarding your
        inquiry.
      </p>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  marginTop: '0.25rem',
};
