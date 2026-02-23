'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ThemeApplicator } from '@/components/ThemeApplicator';

export type SiteContentContextValue = {
  content: Record<string, string>;
  setContentKey: (key: string, value: string) => Promise<void>;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  isAdmin: boolean;
  refresh: () => Promise<void>;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return ctx;
}

const DISPLAY_OPTIONS = [
  { value: 'oswald', label: 'Oswald (sports / headlines)' },
  { value: 'playfair', label: 'Playfair Display (classic serif)' },
];
const BODY_OPTIONS = [
  { value: 'barlow', label: 'Barlow (clean geometric)' },
  { value: 'inter', label: 'Inter (neutral sans)' },
];

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [content, setContent] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/site-content');
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data === 'object' && data !== null) {
        setContent(data);
      }
    } catch {
      // keep current content
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (isAdmin) setEditMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAdmin]);

  const setContentKey = useCallback(async (key: string, value: string) => {
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || 'Failed to update');
      }
      if (typeof data === 'object' && data !== null) {
        setContent(data);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const value: SiteContentContextValue = {
    content,
    setContentKey,
    editMode,
    setEditMode,
    isAdmin,
    refresh,
  };

  return (
    <SiteContentContext.Provider value={value}>
      <ThemeApplicator
        themeDisplayFont={content.theme_display_font}
        themeBodyFont={content.theme_body_font}
      />
      {children}
      {status === 'authenticated' && isAdmin && (
        <>
          <div className="edit-site-fab-group">
            {editMode && (
              <button
                type="button"
                className="edit-site-fab edit-site-fab--theme"
                onClick={() => setThemeModalOpen(true)}
                title="Edit theme & fonts"
                aria-label="Edit theme and fonts"
              >
                Theme
              </button>
            )}
            <button
              type="button"
              className="edit-site-fab"
              onClick={() => setEditMode((prev) => !prev)}
              title={editMode ? 'Exit edit mode (Ctrl+E)' : 'Edit site (Ctrl+E)'}
              aria-label={editMode ? 'Exit edit mode' : 'Edit site'}
            >
              {editMode ? 'Done' : 'Edit site'}
            </button>
          </div>
          {themeModalOpen && (
            <div
              className="editable-content-modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-label="Theme & fonts"
              onClick={(e) => e.target === e.currentTarget && setThemeModalOpen(false)}
            >
              <div className="editable-content-modal theme-editor-modal" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>Theme &amp; fonts</h2>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Change display (headings) and body fonts. Changes apply across the site.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label className="editable-content-modal-label">
                    Display font (headings)
                    <select
                      className="form-input"
                      style={{ marginTop: '0.35rem', width: '100%' }}
                      value={content.theme_display_font ?? 'oswald'}
                      onChange={(e) => setContentKey('theme_display_font', e.target.value)}
                    >
                      {DISPLAY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="editable-content-modal-label">
                    Body font
                    <select
                      className="form-input"
                      style={{ marginTop: '0.35rem', width: '100%' }}
                      value={content.theme_body_font ?? 'barlow'}
                      onChange={(e) => setContentKey('theme_body_font', e.target.value)}
                    >
                      {BODY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="editable-content-modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-primary" onClick={() => setThemeModalOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </SiteContentContext.Provider>
  );
}
