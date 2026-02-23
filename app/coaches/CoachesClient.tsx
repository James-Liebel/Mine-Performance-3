'use client';

import { useState } from 'react';
import { useSiteContent } from '@/contexts/SiteContentContext';

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  title: string;
  bio: string;
  image: string | null;
}

const INITIALS_COLORS = [
  'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)',
  'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

type CoachFormState = { id: string | null; name: string; specialty: string; title: string; bio: string; image: string };

export function CoachesClient({
  coaches,
  onCoachChange,
  showEditUI,
}: {
  coaches: Coach[];
  onCoachChange?: () => void;
  /** When true, show add/edit/remove UI (e.g. on Admin Coaches page) without needing site edit mode. */
  showEditUI?: boolean;
}) {
  const { editMode, isAdmin } = useSiteContent();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CoachFormState>({
    id: null,
    name: '',
    specialty: '',
    title: '',
    bio: '',
    image: '',
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const canEdit = typeof onCoachChange === 'function' && (showEditUI === true || (editMode && isAdmin));

  const openAdd = () => {
    setForm({ id: null, name: '', specialty: '', title: '', bio: '', image: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Coach) => {
    setForm({
      id: c.id,
      name: c.name,
      specialty: c.specialty,
      title: c.title,
      bio: c.bio,
      image: c.image ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveCoach = async () => {
    setSaving(true);
    try {
      if (form.id) {
        const res = await fetch('/api/admin/coaches', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: form.id,
            name: form.name,
            specialty: form.specialty,
            title: form.title,
            bio: form.bio,
            image: form.image.trim() || null,
          }),
        });
        if (!res.ok) throw new Error('Failed to update');
      } else {
        const res = await fetch('/api/admin/coaches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            specialty: form.specialty,
            title: form.title,
            bio: form.bio,
            image: form.image.trim() || null,
          }),
        });
        if (!res.ok) throw new Error('Failed to add');
      }
      closeModal();
      onCoachChange?.();
    } catch {
      setSaving(false);
    }
    setSaving(false);
  };

  const deleteCoach = async (id: string) => {
    if (!confirm('Remove this coach from the list?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coaches?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onCoachChange?.();
    } catch {
      setDeletingId(null);
    }
    setDeletingId(null);
  };

  return (
    <>
      <div className="coach-grid" style={{ marginTop: '1.5rem' }}>
        {coaches.map((c, i) => (
          <article key={c.id} className="card card-elevated coach-card">
            {canEdit && (
              <div className="coach-card-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => openEdit(c)}
                  title="Edit coach"
                  aria-label="Edit coach"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => deleteCoach(c.id)}
                  disabled={deletingId === c.id}
                  title="Remove coach"
                  aria-label="Remove coach"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="coach-image-wrap">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt=""
                  className="coach-image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="coach-image-placeholder"
                  style={{
                    background: INITIALS_COLORS[i % INITIALS_COLORS.length],
                  }}
                  aria-hidden
                >
                  <span className="coach-image-initials">{getInitials(c.name)}</span>
                </div>
              )}
            </div>
            <div className="coach-card-body">
              <h3 style={{ marginTop: 0, marginBottom: '0.25rem' }}>{c.name}</h3>
              <p
                className="coach-title"
                style={{ color: 'var(--accent)', fontWeight: 600, margin: '0 0 0.5rem' }}
              >
                {c.title}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, flex: 1 }}>
                {c.bio}
              </p>
            </div>
          </article>
        ))}
        {canEdit && (
          <button
            type="button"
            className="coach-card coach-card-add"
            onClick={openAdd}
            title="Add coach"
            aria-label="Add coach"
          >
            <span className="coach-card-add-icon" aria-hidden>+</span>
            <span className="coach-card-add-label">Add coach</span>
          </button>
        )}
      </div>

      {modalOpen && (
        <div className="editable-content-modal-backdrop" role="dialog" aria-modal="true" aria-label={form.id ? 'Edit coach' : 'Add coach'}>
          <div className="editable-content-modal coach-modal">
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{form.id ? 'Edit coach' : 'Add coach'}</h3>
            <label className="editable-content-modal-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Coach name"
            />
            <label className="editable-content-modal-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Pitching Coach"
            />
            <label className="editable-content-modal-label">Specialty</label>
            <input
              type="text"
              className="form-input"
              value={form.specialty}
              onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
              placeholder="e.g. Pitching Velo"
            />
            <label className="editable-content-modal-label">Bio</label>
            <textarea
              className="form-input editable-content-modal-input"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Coach bio"
              rows={4}
            />
            <label className="editable-content-modal-label">Image URL (optional)</label>
            <input
              type="url"
              className="form-input"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="https://..."
            />
            <div className="editable-content-modal-actions" style={{ marginTop: '1rem' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={saveCoach} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .coach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .coach-grid-v3 {
          gap: 1.5rem;
        }
        .coach-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .coach-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(234, 88, 12, 0.1);
          border-color: var(--surface-hover);
        }
        .coach-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .coach-image-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          background: var(--surface);
          position: relative;
          overflow: hidden;
        }
        .coach-card .coach-image {
          transition: transform 0.3s ease;
        }
        .coach-card:hover .coach-image {
          transform: scale(1.05);
        }
        .coach-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .coach-image-initials {
          color: #fff;
          font-weight: 700;
          font-size: 2.5rem;
          letter-spacing: 0.02em;
        }
        .coach-card-actions {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 2;
          display: flex;
          gap: 0.25rem;
        }
        .coach-card {
          position: relative;
        }
        .coach-card-add {
          min-height: 200px;
          border: 2px dashed var(--border);
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .coach-card-add:hover {
          border-color: var(--accent);
          background: var(--accent-muted);
          color: var(--accent);
        }
        .coach-card-add-icon {
          font-size: 2.5rem;
          line-height: 1;
          font-weight: 300;
        }
        .coach-card-add-label {
          font-size: 0.95rem;
        }
        .coach-modal {
          max-width: 480px;
        }
      `}</style>
      <style jsx global>{`
        .coach-card .coach-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .coach-card-v3 {
          padding: 1.75rem;
          border-radius: var(--radius-lg);
        }
        .coach-card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        .coach-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .coach-avatar-v3 {
          width: 64px;
          height: 64px;
          font-size: 1.25rem;
        }
        .coach-card-meta {
          flex: 1;
          min-width: 0;
        }
        .coach-name-v3 {
          margin: 0 0 0.2rem;
          font-family: var(--font-display);
          font-weight: 400;
          font-size: 1.35rem;
        }
        .coach-specialty-v3 {
          color: var(--accent);
          font-weight: 600;
          margin: 0;
          font-size: 0.9rem;
        }
        .coach-credentials {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .coach-credential-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          background: var(--accent-muted);
          color: var(--accent);
          border: 1px solid rgba(201, 162, 39, 0.25);
        }
        .coach-bio-v3 {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          flex: 1;
          margin: 0 0 1rem;
        }
        .coach-cta-v3 {
          margin-top: auto;
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
