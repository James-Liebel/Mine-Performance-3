'use client';

import { Suspense } from 'react';
import { ContactForm } from './ContactForm';
import { BookingBanner } from './BookingBanner';
import { EditableContent } from '@/components/EditableContent';
import { useSiteContent } from '@/contexts/SiteContentContext';

export function ContactPageContent() {
  const { content } = useSiteContent();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1>
        <EditableContent contentKey="contact_heading" fallback="Contact Us" as="span" />
      </h1>
      <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '520px' }}>
        <EditableContent contentKey="contact_intro" fallback="Book a session, ask about programs, or schedule a facility tour. We're here to help." as="span" />
      </p>

      <Suspense fallback={null}>
        <BookingBanner />
      </Suspense>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        <section className="card card-elevated" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1rem' }}>
            <EditableContent contentKey="contact_send_message_heading" fallback="Send a message" as="span" />
          </h2>
          <ContactForm />
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1rem' }}>
            <EditableContent contentKey="contact_location_heading" fallback="Location & hours" as="span" />
          </h2>
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
              <EditableContent contentKey="contact_address" fallback="" as="span" />
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <a href={`tel:${(content.contact_phone ?? '').replace(/\D/g, '')}`}>
                <EditableContent contentKey="contact_phone" fallback="" as="span" />
              </a>
            </p>
            <p style={{ marginBottom: '0' }}>
              <a href={`mailto:${content.contact_email ?? ''}`}>
                <EditableContent contentKey="contact_email" fallback="" as="span" />
              </a>
            </p>
          </div>
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '0.5rem' }}>Hours</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              <EditableContent contentKey="contact_hours" fallback="Monday – Friday: 8 am – 9 pm\nSaturday – Sunday: 10 am – 8 pm" as="span" />
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.contact_address ?? '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <EditableContent contentKey="contact_directions_label" fallback="Get directions →" as="span" />
          </a>
        </section>
      </div>
    </div>
  );
}
