'use client';

import { useState } from 'react';
import { useSiteContent } from '@/contexts/SiteContentContext';

type EditableContentProps = {
  contentKey: string;
  fallback?: string;
  /** When set, this is shown instead of content[contentKey] (e.g. for templates with {date} replaced). Editing still saves to contentKey. */
  displayValue?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
  style?: React.CSSProperties;
};

export function EditableContent({ contentKey, fallback = '', displayValue, as: Tag = 'span', className, style }: EditableContentProps) {
  const { content, setContentKey, editMode, isAdmin } = useSiteContent();
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const value = content[contentKey] ?? fallback;
  const shown = displayValue !== undefined ? displayValue : value;
  const canEdit = editMode && isAdmin;

  const openModal = (e?: React.MouseEvent) => {
    if (!canEdit) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDraft(value);
    setModalOpen(true);
  };

  const save = async () => {
    try {
      await setContentKey(contentKey, draft);
      setTimeout(() => setModalOpen(false), 0);
    } catch (err) {
      // could show toast
    }
  };

  return (
    <>
      {canEdit ? (
        <Tag
          role="button"
          tabIndex={0}
          className={className ? `${className} editable-content editable-content--on` : 'editable-content editable-content--on'}
          style={style}
          onClick={(e) => openModal(e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              openModal();
            }
          }}
          title="Click to edit"
        >
          {shown}
        </Tag>
      ) : (
        <Tag className={className} style={style}>
          {shown}
        </Tag>
      )}
      {modalOpen && (
        <div
          className="editable-content-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Edit content"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target === e.currentTarget) setTimeout(() => setModalOpen(false), 0);
          }}
        >
          <div className="editable-content-modal" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="editable-content-input" className="editable-content-modal-label">
              Edit: {contentKey}
            </label>
            <textarea
              id="editable-content-input"
              className="form-input editable-content-modal-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="editable-content-modal-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  save();
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTimeout(() => setModalOpen(false), 0);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
