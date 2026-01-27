'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sentFromUrl = useMemo(() => searchParams.get('sent') === '1', [searchParams]);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    sentFromUrl ? 'success' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/xnjdgnoy', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        let msg = 'Submission failed. Please try again.';
        try {
          const data = await res.json();
          if (data?.errors?.length) {
            msg = data.errors.map((x: any) => x.message).join(' ');
          }
        } catch {
          // ignore json parse errors
        }
        setStatus('error');
        setErrorMsg(msg);
        return;
      }

      // Success
      setStatus('success');
      form.reset();

      // Update URL to show success state on refresh/share (without navigating away)
      router.replace('/contact?sent=1');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1rem' }}>
      <h1>Contact GAFAIG</h1>

      <p style={{ marginBottom: '2rem', opacity: 0.85 }}>
        Use the form below to reach the Global Authority for AI Governance. We
        welcome inquiries related to governance frameworks, partnerships,
        research collaboration, and general questions.
      </p>

      {status === 'success' && (
        <div
          role="status"
          aria-live="polite"
          style={{
            background: '#e6fffa',
            border: '1px solid #38b2ac',
            color: '#065f5b',
            padding: '1rem',
            borderRadius: 6,
            marginBottom: '2rem',
            fontWeight: 600,
          }}
        >
          Thank you — your message has been sent successfully.
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          style={{
            background: '#fff5f5',
            border: '1px solid #e53e3e',
            color: '#7b1c1c',
            padding: '1rem',
            borderRadius: 6,
            marginBottom: '2rem',
            fontWeight: 600,
          }}
        >
          {errorMsg || 'Something went wrong. Please try again.'}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Full Name */}
        <div>
          <label htmlFor="name" style={labelStyle}>
            Full name
          </label>
          <input id="name" name="name" type="text" required style={inputStyle} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={labelStyle}>
            Email address
          </label>
          <input id="email" name="email" type="email" required style={inputStyle} />
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="organization" style={labelStyle}>
            Organization (optional)
          </label>
          <input id="organization" name="organization" type="text" style={inputStyle} />
        </div>

        {/* Reason */}
        <div>
          <label htmlFor="reason" style={labelStyle}>
            Reason for contacting
          </label>
          <select id="reason" name="reason" required style={inputStyle} defaultValue="">
            <option value="" disabled>
              Select one
            </option>
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
          <label htmlFor="message" style={labelStyle}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Consent */}
        <div style={{ fontSize: 14, lineHeight: 1.4 }}>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <input type="checkbox" required style={{ marginTop: 3 }} />{' '}
            <span>
              I consent to being contacted regarding this inquiry and acknowledge the
              privacy policy.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            opacity: status === 'submitting' ? 0.7 : 1,
          }}
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>
      </form>

      <p style={{ fontSize: 12, opacity: 0.7, marginTop: '2rem' }}>
        By submitting this form, you consent to being contacted regarding your inquiry.
      </p>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem',
  border: '1px solid #d0d0d0',
  borderRadius: 6,
  fontSize: 16,
};
