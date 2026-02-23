'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CreditsExplainer } from '@/components/CreditsExplainer';

interface Waiver {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

function formatSignedAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function ProfileWaiverItem({
  waiver,
  signedAt,
  memberName,
  onSign,
}: {
  waiver: Waiver;
  signedAt: string | null;
  memberName: string;
  onSign: (waiverId: string) => void;
}) {
  const isSigned = Boolean(signedAt);
  return (
    <div className="profile-waiver-item card card-elevated">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{waiver.title}</h4>
        <span
          className={`profile-waiver-status ${isSigned ? 'profile-waiver-status--signed' : 'profile-waiver-status--unsigned'}`}
        >
          {isSigned ? 'Signed' : 'Unsigned'}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {waiver.body}
        {isSigned && signedAt && (
          <>
            {' '}
            E-signed on {formatSignedAt(signedAt)}
            {memberName && ` on behalf of ${memberName}.`}
          </>
        )}
      </p>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {isSigned ? (
          <button type="button" className="profile-waiver-download" aria-label="Download waiver">
            <span aria-hidden>↓</span> Download
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
            onClick={() => onSign(waiver.id)}
          >
            Sign waiver
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfileOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;
  const isAdmin = user?.role === 'admin';

  const [firstName, setFirstName] = useState('James');
  const [lastName, setLastName] = useState('Liebel');
  const [email, setEmail] = useState(user?.email ?? 'jamesliebel40@gmail.com');
  const [phone, setPhone] = useState('(513) 965-1578');
  const [birthday, setBirthday] = useState('');
  const [userType, setUserType] = useState<'athlete' | 'parent'>('athlete');
  const [familyMembers, setFamilyMembers] = useState<{ id: string; name: string; phone: string }[]>([
    { id: 'self', name: 'James Liebel', phone: '(513) 965-1578' },
    { id: '2', name: 'Jeff Liebel', phone: '(513) 555-0001' },
  ]);
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [notifications, setNotifications] = useState({
    googleCalendar: false,
    alerts: true,
    reminders: true,
    promos: true,
    email: true,
    sms: true,
  });
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [credits, setCredits] = useState<number | null>(null);
  const [creditHistory, setCreditHistory] = useState<Array<{ id: string; amount: number; reason: string; reference?: string; createdAt: string }>>([]);

  useEffect(() => {
    fetch('/api/member/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setCredits(data.credits ?? null);
          setCreditHistory(Array.isArray(data.creditHistory) ? data.creditHistory : []);
        } else {
          setCredits(null);
          setCreditHistory([]);
        }
      })
      .catch(() => {
        setCredits(null);
        setCreditHistory([]);
      });
  }, []);

  useEffect(() => {
    fetch('/api/waivers')
      .then((r) => r.json())
      .then((data) => setWaivers(Array.isArray(data) ? data : []))
      .catch(() => setWaivers([]));
  }, []);

  useEffect(() => {
    fetch('/api/waivers/signatures')
      .then((r) => r.json())
      .then((data) => setSignatures(typeof data === 'object' && data !== null ? data : {}))
      .catch(() => setSignatures({}));
  }, []);

  const handleSignWaiver = (waiverId: string) => {
    fetch('/api/waivers/signatures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waiverId }),
    })
      .then((r) => r.ok && r.json())
      .then(() => {
        fetch('/api/waivers/signatures')
          .then((res) => res.json())
          .then((data) => setSignatures(typeof data === 'object' && data !== null ? data : {}));
      });
  };

  const memberName = `${firstName} ${lastName}`.trim() || (user?.name ?? '');

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeFamilyMember = (id: string) => {
    if (id === 'self') return;
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addFamilyMemberByPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMemberPhone.trim().replace(/\D/g, '');
    if (!trimmed || trimmed.length < 10) return;
    const formatted = trimmed.length === 10
      ? `(${trimmed.slice(0, 3)}) ${trimmed.slice(3, 6)}-${trimmed.slice(6)}`
      : newMemberPhone.trim();
    setFamilyMembers((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, name: `Member ${formatted}`, phone: formatted },
    ]);
    setNewMemberPhone('');
  };

  if (!user) return null;

  const formatTxDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const reasonLabel: Record<string, string> = {
    stripe_purchase: 'Stripe purchase',
    stripe_refund: 'Refund',
    booking_spend: 'Event booking',
    admin_adjustment: 'Admin adjustment',
    membership_grant: 'Membership',
    other: 'Other',
  };

  return (
    <div className="container profile-overview" style={{ paddingTop: '1.5rem', paddingBottom: '3rem', maxWidth: '720px' }}>
      {/* Credits — highlighted at top */}
      <section id="credits" className="card card-elevated profile-section profile-section--credits-highlight">
        <CreditsExplainer balance={credits} />
        {creditHistory.length > 0 && (
          <div className="credits-history" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 }}>Recent activity</h3>
            <ul className="credits-history-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {creditHistory.slice(0, 15).map((tx) => (
                <li key={tx.id} className="credits-history-item">
                  <span className="credits-history-reason">
                    {reasonLabel[tx.reason] ?? tx.reason}
                    {tx.reference && <span className="credits-history-ref"> · {tx.reference.length > 14 ? `${tx.reference.slice(0, 12)}…` : tx.reference}</span>}
                  </span>
                  <span className={tx.amount >= 0 ? 'credits-history-add' : 'credits-history-deduct'}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount}
                  </span>
                  <span className="credits-history-date">{formatTxDate(tx.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Personal information */}
      <section className="card card-elevated profile-section">
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Personal information</h2>
        <div className="profile-picture-row">
          <div className="profile-picture-placeholder" aria-hidden>
            <span style={{ opacity: 0.5 }}>👤</span>
          </div>
          <div className="profile-picture-field form-group" style={{ flex: 1 }}>
            <label className="form-label">Profile picture</label>
            <input type="text" className="form-input" placeholder="Upload here..." readOnly style={{ background: 'var(--surface)' }} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="profile-birthday">Birthday</label>
          <input
            id="profile-birthday"
            type="text"
            className="form-input"
            placeholder="mm/dd/yyyy"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className="profile-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-first">First name</label>
            <input
              id="profile-first"
              type="text"
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-last">Last name</label>
            <input
              id="profile-last"
              type="text"
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="profile-phone">Phone</label>
          <input
            id="profile-phone"
            type="tel"
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </section>

      {/* Add family members */}
      <section className="card card-elevated profile-section">
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem' }}>Add family members</h2>
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Add family members as linked users to checkout and sign up for events on behalf of other users. This is also
          applicable for memberships and team registration.
        </p>
        <ul className="profile-family-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem' }}>
          {familyMembers.map((member) => (
            <li key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span aria-hidden style={{ color: 'var(--text-muted)' }}>🔗</span>
              <span>{member.name}</span>
              {member.phone && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{member.phone}</span>
              )}
              {member.id !== 'self' && (
                <button
                  type="button"
                  className="btn btn-secondary profile-remove-btn"
                  onClick={() => removeFamilyMember(member.id)}
                  style={{ marginLeft: 'auto', fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={addFamilyMemberByPhone} className="profile-add-family-form" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
            <label className="form-label" htmlFor="profile-new-member-phone">Phone number</label>
            <input
              id="profile-new-member-phone"
              type="tel"
              className="form-input"
              placeholder="(513) 555-1234"
              value={newMemberPhone}
              onChange={(e) => setNewMemberPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary profile-add-family">
            + Add by phone
          </button>
        </form>
      </section>

      {/* Change user type */}
      <section className="card card-elevated profile-section">
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem' }}>Change user type</h2>
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Are you a parent or an athlete? Please set this to what you are and use the linked user feature to act on
          behalf of other users.
        </p>
        <div className="form-group">
          <select
            className="form-input"
            value={userType}
            onChange={(e) => setUserType(e.target.value as 'athlete' | 'parent')}
            style={{ maxWidth: '200px' }}
          >
            <option value="athlete">Athlete</option>
            <option value="parent">Parent</option>
          </select>
        </div>
      </section>

      {/* Notifications */}
      <section className="card card-elevated profile-section">
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Notifications</h2>
        {[
          {
            key: 'googleCalendar' as const,
            label: 'Google Calendar',
            desc: 'Sync your events with Google Calendar. This will only work for events at facilities who have enabled the Google Calendar integration.',
          },
          {
            key: 'alerts' as const,
            label: 'Alerts',
            desc: 'Important notifications and admin updates.',
          },
          {
            key: 'reminders' as const,
            label: 'Reminders',
            desc: 'Reminders for scheduled events and payments.',
          },
          {
            key: 'promos' as const,
            label: 'Promos',
            desc: 'Receive exclusive offers from our partner companies.',
          },
          {
            key: 'email' as const,
            label: 'Email',
            desc: 'Receive your admin updates via email.',
          },
          {
            key: 'sms' as const,
            label: 'SMS',
            desc: 'Do you agree to receive text messages from Mine Performance Academy. Message frequency varies. Reply STOP to unsubscribe.',
          },
        ].map(({ key, label, desc }) => (
          <div key={key} className="profile-notification-row">
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{label}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {desc}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications[key]}
              className={`profile-toggle${notifications[key] ? ' profile-toggle--on' : ''}`}
              onClick={() => toggleNotification(key)}
              aria-label={`${label}: ${notifications[key] ? 'Yes' : 'No'}`}
            >
              <span className="profile-toggle-label">{notifications[key] ? 'Yes' : 'No'}</span>
            </button>
          </div>
        ))}
      </section>

      {/* Waivers & contracts */}
      <section className="card card-elevated profile-section">
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Waivers & contracts</h2>
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Each waiver shows whether it is signed or unsigned. Sign any that are required.
        </p>
        {waivers.length === 0 ? (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>No waivers on file.</p>
        ) : (
          waivers.map((waiver) => (
            <ProfileWaiverItem
              key={waiver.id}
              waiver={waiver}
              signedAt={signatures[waiver.id] ?? null}
              memberName={memberName}
              onSign={handleSignWaiver}
            />
          ))
        )}
      </section>

      {/* Account actions + easy Log out */}
      <section className="card card-elevated profile-section profile-account-actions">
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Account actions</h2>
        <div className="profile-account-buttons">
          <button type="button" className="btn btn-secondary profile-account-btn">
            ↻ Reset password
          </button>
          <button type="button" className="btn profile-account-btn profile-account-btn--danger">
            🗑 Delete user
          </button>
          <button
            type="button"
            className="btn btn-primary profile-account-btn profile-logout-btn"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Log out
          </button>
        </div>
      </section>

      {isAdmin && (
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/admin" className="btn btn-secondary">
            Admin dashboard
          </Link>
        </p>
      )}
    </div>
  );
}
