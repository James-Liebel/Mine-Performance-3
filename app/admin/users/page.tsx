'use client';

import { useState, useEffect, useCallback } from 'react';

interface MembershipOption {
  id: string;
  name: string;
}

interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
  credits: number;
  membershipId: string;
}

const PAGE_SIZES = [10, 20, 50, 100];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<MembershipOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editMembershipId, setEditMembershipId] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search.trim()) params.set('q', search.trim());
    fetch(`/api/admin/users?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
          setTotal(data.length);
          setTotalPages(1);
        } else if (data?.users && Array.isArray(data.users)) {
          setUsers(data.users);
          setTotal(data.total ?? data.users.length);
          setTotalPages(data.totalPages ?? 1);
        } else {
          setUsers([]);
          setTotal(0);
          setTotalPages(1);
        }
      })
      .catch(() => {
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [page, limit, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    fetch('/api/memberships')
      .then((r) => r.json())
      .then((data) =>
        setMemberships(
          Array.isArray(data) ? data.map((m: { id: string; name: string }) => ({ id: m.id, name: m.name })) : []
        )
      )
      .catch(() => setMemberships([]));
  }, []);

  const showMsg = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const startEdit = (u: User) => {
    setEditingEmail(u.email);
    setEditName(u.name);
    setEditRole(u.role);
    setEditCredits(u.credits ?? 0);
    setEditMembershipId(u.membershipId ?? '');
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingEmail(null);
  };

  const adjustCredits = (delta: number) => {
    setEditCredits((c) => Math.max(0, c + delta));
  };

  const saveEdit = async () => {
    if (!editingEmail) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingEmail,
          name: editName.trim() || undefined,
          role: editRole,
          credits: editCredits,
          membershipId: editMembershipId || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showMsg('err', data.error || 'Failed to update');
        return;
      }
      showMsg('ok', 'User updated. Changes apply on next login.');
      setEditingEmail(null);
      loadUsers();
    } catch {
      showMsg('err', 'Failed to update');
    }
  };

  const quickCredits = async (email: string, delta: number) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, creditsDelta: delta }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showMsg('err', data.error || 'Failed to update credits');
        return;
      }
      showMsg('ok', 'Credits updated.');
      loadUsers();
    } catch {
      showMsg('err', 'Failed to update credits');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="container admin-page">
        <p className="text-muted">Loading users…</p>
      </div>
    );
  }

  return (
    <div className="container admin-page">
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-desc text-muted">
        Manage who can sign in, their role, credits, and membership. <strong>Click a row or Edit to change fields.</strong> Use + / − next to credits for quick adjustments. Changes apply when that user signs in again. Passwords are set in your environment (not editable here).
      </p>

      {message && (
        <div className={`admin-toast admin-toast--${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <div className="admin-users-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <label className="admin-search" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="text-muted">Search</span>
          <input
            type="search"
            className="form-input"
            placeholder="Email or name…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), setSearch(searchInput))}
            style={{ minWidth: '12rem' }}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSearch(searchInput)}>
            Search
          </button>
        </label>
        <label className="admin-page-size" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="text-muted">Per page</span>
          <select
            className="form-input"
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            style={{ width: 'auto' }}
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <span className="text-muted" style={{ marginLeft: 'auto' }}>
          {total} user{total !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Display name</th>
              <th>Role</th>
              <th>Credits</th>
              <th>Membership</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td className="admin-cell--muted">{u.email}</td>
                <td>
                  {editingEmail === u.email ? (
                    <input
                      type="text"
                      className="form-input admin-inline-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Display name"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      className="admin-clickable admin-clickable--text"
                      onClick={() => startEdit(u)}
                      title="Click to edit"
                    >
                      {u.name}
                    </button>
                  )}
                </td>
                <td>
                  {editingEmail === u.email ? (
                    <select
                      className="form-input admin-inline-select"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as 'admin' | 'user')}
                    >
                      <option value="user">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <button
                      type="button"
                      className="admin-clickable admin-clickable--badge"
                      onClick={() => startEdit(u)}
                      title="Click to edit"
                      data-role={u.role}
                    >
                      {u.role === 'admin' ? 'Admin' : 'Member'}
                    </button>
                  )}
                </td>
                <td>
                  {editingEmail === u.email ? (
                    <span className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => adjustCredits(-1)} aria-label="Decrease credits">−</button>
                      <input
                        type="number"
                        min={0}
                        className="form-input admin-inline-input"
                        style={{ width: '4rem', textAlign: 'center' }}
                        value={editCredits}
                        onChange={(e) => setEditCredits(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      />
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => adjustCredits(1)} aria-label="Increase credits">+</button>
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>{u.credits ?? 0}</span>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => quickCredits(u.email, -1)} aria-label="Remove 1 credit">−</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => quickCredits(u.email, 1)} aria-label="Add 1 credit">+</button>
                    </span>
                  )}
                </td>
                <td>
                  {editingEmail === u.email ? (
                    <select
                      className="form-input admin-inline-select"
                      value={editMembershipId}
                      onChange={(e) => setEditMembershipId(e.target.value)}
                      style={{ minWidth: '10rem' }}
                    >
                      <option value="">None</option>
                      {memberships.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      type="button"
                      className="admin-clickable admin-clickable--text"
                      onClick={() => startEdit(u)}
                      title="Click to edit"
                    >
                      {memberships.find((m) => m.id === (u.membershipId ?? ''))?.name ?? (u.membershipId ? u.membershipId : '—')}
                    </button>
                  )}
                </td>
                <td>
                  {editingEmail === u.email ? (
                    <span className="admin-inline-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={saveEdit}>
                        Save
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(u)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="admin-pagination" aria-label="User list pagination" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
