'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CollegeCommit, Endorsement, CommitDivision } from '@/lib/results-store';

const DIVISION_OPTIONS: { value: CommitDivision; label: string }[] = [
  { value: 'd1', label: 'D1' },
  { value: 'd2', label: 'D2' },
  { value: 'd3', label: 'D3' },
  { value: 'juco_naia', label: 'JUCO/NAIA' },
];

export default function AdminResultsPage() {
  const [commits, setCommits] = useState<CollegeCommit[]>([]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [commitModal, setCommitModal] = useState<CollegeCommit | null | 'add'>(null);
  const [endorsementModal, setEndorsementModal] = useState<Endorsement | null | 'add'>(null);

  const showMsg = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const load = () => {
    fetch('/api/results')
      .then((r) => r.json())
      .then((data) => {
        setCommits(Array.isArray(data.collegeCommits) ? data.collegeCommits : []);
        setEndorsements(Array.isArray(data.endorsements) ? data.endorsements : []);
      })
      .catch(() => {
        setCommits([]);
        setEndorsements([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && commits.length === 0 && endorsements.length === 0) {
    return (
      <div className="container admin-page">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="container admin-page">
      <h1 className="admin-page-title">College commits &amp; endorsements</h1>
      <p className="admin-page-desc text-muted">
        Manage athletes who went to college and player endorsements. Changes appear on the <Link href="/results">Results page</Link>. All fields are editable.
      </p>

      {message && (
        <div className={`admin-toast admin-toast--${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>College commits</h2>
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          Athletes from the facility who committed to a college.
        </p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Athlete</th>
                <th>College</th>
                <th>Division</th>
                <th>Year</th>
                <th>Position</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {commits.map((c) => (
                <tr key={c.id}>
                  <td className="admin-cell--muted">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }} />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{c.athleteName}</td>
                  <td>{c.college}</td>
                  <td className="admin-cell--muted">{DIVISION_OPTIONS.find((d) => d.value === (c.division ?? 'd1'))?.label ?? 'D1'}</td>
                  <td className="admin-cell--muted">{c.year ?? '—'}</td>
                  <td className="admin-cell--muted">{c.position ?? '—'}</td>
                  <td>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCommitModal(c)}>Edit</button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={async () => {
                        if (!confirm('Remove this commit?')) return;
                        const res = await fetch(`/api/admin/college-commits?id=${encodeURIComponent(c.id)}`, { method: 'DELETE' });
                        if (res.ok) {
                          showMsg('ok', 'Removed.');
                          load();
                        } else showMsg('err', 'Failed to remove');
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => setCommitModal('add')}>
          + Add college commit
        </button>
      </section>

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Player endorsements</h2>
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          Quotes from athletes and families.
        </p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Quote</th>
                <th>Athlete</th>
                <th>College</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {endorsements.map((e) => (
                <tr key={e.id}>
                  <td style={{ maxWidth: '320px' }} className="admin-cell--muted">{e.quote.slice(0, 80)}{e.quote.length > 80 ? '…' : ''}</td>
                  <td>{e.athleteName}</td>
                  <td className="admin-cell--muted">{e.college ?? '—'}</td>
                  <td>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEndorsementModal(e)}>Edit</button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={async () => {
                        if (!confirm('Remove this endorsement?')) return;
                        const res = await fetch(`/api/admin/endorsements?id=${encodeURIComponent(e.id)}`, { method: 'DELETE' });
                        if (res.ok) {
                          showMsg('ok', 'Removed.');
                          load();
                        } else showMsg('err', 'Failed to remove');
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => setEndorsementModal('add')}>
          + Add endorsement
        </button>
      </section>

      {commitModal && (
        <CommitModal
          commit={commitModal === 'add' ? null : commitModal}
          onClose={() => setCommitModal(null)}
          onSaved={() => {
            showMsg('ok', 'Saved.');
            setCommitModal(null);
            load();
          }}
          onError={(err) => showMsg('err', err)}
        />
      )}
      {endorsementModal && (
        <EndorsementModal
          endorsement={endorsementModal === 'add' ? null : endorsementModal}
          onClose={() => setEndorsementModal(null)}
          onSaved={() => {
            showMsg('ok', 'Saved.');
            setEndorsementModal(null);
            load();
          }}
          onError={(err) => showMsg('err', err)}
        />
      )}
    </div>
  );
}

function CommitModal({
  commit,
  onClose,
  onSaved,
  onError,
}: {
  commit: CollegeCommit | null;
  onClose: () => void;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [athleteName, setAthleteName] = useState(commit?.athleteName ?? '');
  const [college, setCollege] = useState(commit?.college ?? '');
  const [division, setDivision] = useState<CommitDivision>(commit?.division ?? 'd1');
  const [year, setYear] = useState(commit?.year ?? '');
  const [position, setPosition] = useState(commit?.position ?? '');
  const [imageUrl, setImageUrl] = useState(commit?.imageUrl ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        athleteName,
        college,
        division,
        year: year || undefined,
        position: position || undefined,
        imageUrl: imageUrl.trim() || undefined,
      };
      if (commit) {
        const res = await fetch('/api/admin/college-commits', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: commit.id, ...payload }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error((d as { error?: string }).error || 'Failed to update');
        }
      } else {
        const res = await fetch('/api/admin/college-commits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error((d as { error?: string }).error || 'Failed to add');
        }
      }
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Failed');
    }
    setSaving(false);
  };

  return (
    <div className="editable-content-modal-backdrop" role="dialog" aria-modal="true" aria-label={commit ? 'Edit commit' : 'Add commit'} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="editable-content-modal coach-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{commit ? 'Edit college commit' : 'Add college commit'}</h3>
        <label className="editable-content-modal-label">Athlete name *</label>
        <input type="text" className="form-input" value={athleteName} onChange={(e) => setAthleteName(e.target.value)} placeholder="Athlete name" />
        <label className="editable-content-modal-label">College *</label>
        <input type="text" className="form-input" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="College name" />
        <label className="editable-content-modal-label">Division</label>
        <select className="form-input" value={division} onChange={(e) => setDivision(e.target.value as CommitDivision)}>
          {DIVISION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <label className="editable-content-modal-label">Year (optional)</label>
        <input type="text" className="form-input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2024" />
        <label className="editable-content-modal-label">Position (optional)</label>
        <input type="text" className="form-input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. RHP, OF" />
        <label className="editable-content-modal-label">College / mascot image URL (optional)</label>
        <input type="url" className="form-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
        {imageUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            <img src={imageUrl} alt="Preview" style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain', borderRadius: 4, border: '1px solid var(--border)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
        <div className="editable-content-modal-actions" style={{ marginTop: '1rem' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EndorsementModal({
  endorsement,
  onClose,
  onSaved,
  onError,
}: {
  endorsement: Endorsement | null;
  onClose: () => void;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [quote, setQuote] = useState(endorsement?.quote ?? '');
  const [athleteName, setAthleteName] = useState(endorsement?.athleteName ?? '');
  const [college, setCollege] = useState(endorsement?.college ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (endorsement) {
        const res = await fetch('/api/admin/endorsements', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: endorsement.id, quote, athleteName, college: college || undefined }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error((d as { error?: string }).error || 'Failed to update');
        }
      } else {
        const res = await fetch('/api/admin/endorsements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quote, athleteName, college: college || undefined }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error((d as { error?: string }).error || 'Failed to add');
        }
      }
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Failed');
    }
    setSaving(false);
  };

  return (
    <div className="editable-content-modal-backdrop" role="dialog" aria-modal="true" aria-label={endorsement ? 'Edit endorsement' : 'Add endorsement'} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="editable-content-modal coach-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{endorsement ? 'Edit endorsement' : 'Add endorsement'}</h3>
        <label className="editable-content-modal-label">Quote</label>
        <textarea className="form-input editable-content-modal-input" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="What they said…" rows={4} />
        <label className="editable-content-modal-label">Athlete name</label>
        <input type="text" className="form-input" value={athleteName} onChange={(e) => setAthleteName(e.target.value)} placeholder="Athlete name" />
        <label className="editable-content-modal-label">College (optional)</label>
        <input type="text" className="form-input" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="College name" />
        <div className="editable-content-modal-actions" style={{ marginTop: '1rem' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
