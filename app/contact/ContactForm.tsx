'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Unable to send. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '1rem 0' }} data-testid="contact-form-success">
        <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>
          ✓ Message sent!
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          We&apos;ll get back to you within 24 hours. You can also reach us at{' '}
          <a href="tel:5133843840">(513) 384-3840</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Contact form">
      {error && (
        <p role="alert" data-testid="contact-form-error" style={{ color: 'var(--danger, #dc2626)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </p>
      )}
      <div className="form-group">
        <label className="form-label" htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="contact-phone">Phone (optional)</label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          placeholder="Tell us about your goals, ask about programs, or request a session time..."
          className="form-input"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading} data-testid="contact-form-submit">
        {loading ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

