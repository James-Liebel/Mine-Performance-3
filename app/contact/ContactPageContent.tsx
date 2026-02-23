'use client';

import { Suspense } from 'react';
import { ContactForm } from './ContactForm';
import { BookingBanner } from './BookingBanner';
import { EditableContent } from '@/components/EditableContent';
import { useSiteContent } from '@/contexts/SiteContentContext';

export function ContactPageContent() {
  const { content } = useSiteContent();

  return (
    <div className="page page-contact-editorial">
      <div className="container contact-page-inner" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1>
          <EditableContent contentKey="contact_heading" fallback="Contact Us" as="span" />
        </h1>
        <p className="text-muted contact-intro" style={{ marginBottom: '1.5rem', maxWidth: '560px' }}>
          <EditableContent contentKey="contact_intro" fallback="Book a session, ask about programs, or schedule a facility tour. We're here to help." as="span" />
        </p>

        <Suspense fallback={null}>
          <BookingBanner />
        </Suspense>

        <div className="contact-visit-strip" aria-label="Visit us">
          <div className="contact-visit-cell">
            <span className="contact-visit-label">Address</span>
            <span className="contact-visit-value">
              <EditableContent contentKey="contact_address" fallback="" as="span" />
            </span>
          </div>
          <div className="contact-visit-cell">
            <span className="contact-visit-label">Phone</span>
            <a href={`tel:${(content.contact_phone ?? '').replace(/\D/g, '')}`} className="contact-visit-value">
              <EditableContent contentKey="contact_phone" fallback="" as="span" />
            </a>
          </div>
          <div className="contact-visit-cell">
            <span className="contact-visit-label">Email</span>
            <a href={`mailto:${content.contact_email ?? ''}`} className="contact-visit-value">
              <EditableContent contentKey="contact_email" fallback="" as="span" />
            </a>
          </div>
          <div className="contact-visit-cell">
            <span className="contact-visit-label">Hours</span>
            <span className="contact-visit-value contact-visit-hours">
              <EditableContent contentKey="contact_hours" fallback="Mon–Fri: 8am–9pm / Sat–Sun: 10am–8pm" as="span" />
            </span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.contact_address ?? '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary contact-visit-directions"
          >
            <EditableContent contentKey="contact_directions_label" fallback="Get directions →" as="span" />
          </a>
        </div>

        <section className="contact-form-block card card-elevated" style={{ padding: '1.75rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1rem' }}>
            <EditableContent contentKey="contact_send_message_heading" fallback="Send a message" as="span" />
          </h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
