'use client';

import { useState, useEffect } from 'react';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

interface Waiver {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function AdminWaiversPage() {
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadWaivers = () => {
    fetch('/api/admin/waivers')
      .then((r) => r.json())
      .then((data) => setWaivers(Array.isArray(data) ? data : []))
      .catch(() => setWaivers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWaivers();
  }, []);

  const showMsg = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) {
      showMsg('err', 'Title is required.');
      return;
    }
    setLoading(true);
    fetch('/api/admin/waivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body: newBody.trim() }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showMsg('err', data.error);
        } else {
          setNewTitle('');
          setNewBody('');
          showMsg('ok', 'Waiver added.');
          loadWaivers();
        }
      })
      .catch(() => showMsg('err', 'Failed to add waiver.'))
      .finally(() => setLoading(false));
  };

  const startEdit = (w: Waiver) => {
    setEditingId(w.id);
    setEditTitle(w.title);
    setEditBody(w.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
  };

  const saveEdit = () => {
    if (!editingId) return;
    setLoading(true);
    fetch('/api/admin/waivers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, title: editTitle.trim(), body: editBody.trim() }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showMsg('err', data.error);
        } else {
          showMsg('ok', 'Waiver updated.');
          cancelEdit();
          loadWaivers();
        }
      })
      .catch(() => showMsg('err', 'Failed to update waiver.'))
      .finally(() => setLoading(false));
  };

  const requestDelete = (id: string) => setDeleteConfirmId(id);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmId(null);
    setLoading(true);
    fetch(`/api/admin/waivers?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showMsg('err', data.error);
        } else {
          showMsg('ok', 'Waiver removed.');
          if (editingId === id) cancelEdit();
          loadWaivers();
        }
      })
      .catch(() => showMsg('err', 'Failed to delete waiver.'))
      .finally(() => {
        setLoading(false);
        setDeletingId(null);
      });
  };

  return (
    <div className="container admin-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="admin-page-title" style={{ marginBottom: '0.5rem' }}>Waivers</h1>
      <p className="text-muted admin-page-desc" style={{ marginBottom: '1.5rem' }}>
        <strong>Click a waiver title or text to edit it.</strong> Add new waivers below. Members see these on their profile as Signed or Unsigned.
      </p>

      {message && (
        <p
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius)',
            background: message.type === 'ok' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: message.type === 'ok' ? '#4ade80' : '#f87171',
          }}
        >
          {message.text}
        </p>
      )}

      <section className="card card-elevated admin-form" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Add waiver</h2>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label" htmlFor="waiver-new-title">Title</label>
            <input
              id="waiver-new-title"
              type="text"
              className="form-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Waiver of Liability and Hold Harmless Agreement"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="waiver-new-body">Body / description</label>
            <textarea
              id="waiver-new-body"
              className="form-input"
              rows={3}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Short description shown to members..."
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Add waiver
          </button>
        </form>
      </section>

      <section>
        <h2 className="admin-form-title" style={{ margin: '0 0 0.5rem' }}>Current waivers — click to edit</h2>
        <p className="text-muted admin-editable-hint" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          Click a title or the description text to change it. Click Remove to delete a waiver.
        </p>
        {loading && waivers.length === 0 ? (
          <p className="text-muted">Loading…</p>
        ) : waivers.length === 0 ? (
          <p className="text-muted">No waivers yet. Add one above.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {waivers.map((w) => (
              <li key={w.id} className="card card-elevated admin-waiver-card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                {editingId === w.id ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Body</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" className="btn btn-primary" onClick={saveEdit} disabled={loading}>
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <button
                          type="button"
                          className="admin-clickable admin-clickable--heading"
                          onClick={() => startEdit(w)}
                          title="Click to edit"
                        >
                          <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>{w.title}</h3>
                        </button>
                        <button
                          type="button"
                          className="admin-clickable admin-clickable--text"
                          onClick={() => startEdit(w)}
                          title="Click to edit"
                          style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
                        >
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {w.body || '—'}
                          </p>
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button type="button" className="btn btn-secondary" onClick={() => startEdit(w)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn profile-remove-btn admin-events-btn-danger"
                          onClick={() => requestDelete(w.id)}
                          disabled={!!deletingId}
                        >
                          {deletingId === w.id ? '…' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <AdminConfirmModal
        open={deleteConfirmId !== null}
        title="Remove this waiver?"
        message="Members will see it as unsigned until you add it back. You can add a new waiver anytime."
        confirmLabel="Yes, remove"
        cancelLabel="Keep"
        danger
        loading={deletingId !== null}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
