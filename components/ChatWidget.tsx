'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FAQ_ENTRIES } from '@/content/faq';
import { matchFAQ, hasHighConfidence } from '@/lib/faq-matcher';
import type { FAQEntry } from '@/content/faq';

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  role: MessageRole;
  content: string;
  citations?: FAQEntry[];
}

const LOW_CONFIDENCE_MESSAGE =
  "I'm not sure—here are a few related topics that might help.";

function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChatWidget() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [lastMatchedQuery, setLastMatchedQuery] = useState<string>('');
  const [lastMatches, setLastMatches] = useState<FAQEntry[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** When admin is logged in, Edit site FAB is bottom-right; shift chat left so they don't overlap */
  const chatRight = isAdmin ? '6.5rem' : '1.25rem';

  const findMatches = useCallback(
    (query: string): { results: ReturnType<typeof matchFAQ>; combinedQuery: string } => {
      const combinedQuery =
        lastMatchedQuery && lastMatches.length > 0
          ? `${lastMatchedQuery} ${query}`.trim()
          : query;
      const results = matchFAQ(combinedQuery, FAQ_ENTRIES);
      return { results, combinedQuery };
    },
    [lastMatchedQuery, lastMatches]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);

    const { results, combinedQuery } = findMatches(text);
    const matches = results.map((r) => r.entry);
    setLastMatchedQuery(combinedQuery);
    setLastMatches(matches);

    if (results.length === 0) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: LOW_CONFIDENCE_MESSAGE,
          citations: FAQ_ENTRIES.slice(0, 3),
        },
      ]);
      return;
    }

    const highConf = hasHighConfidence(results);
    const topMatch = results[0].entry;

    if (highConf && topMatch) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: topMatch.answer, citations: [topMatch] },
      ]);
    } else {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: LOW_CONFIDENCE_MESSAGE,
          citations: matches,
        },
      ]);
    }
  }, [input, findMatches]);

  const handleChipClick = useCallback((question: string) => {
    setInput(question);
    inputRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const target = e.shiftKey ? (document.activeElement === first ? last : null) : (document.activeElement === last ? first : null);
        if (target) {
          e.preventDefault();
          target.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const suggestedQuestions = FAQ_ENTRIES.slice(0, 4).map((e) => e.question);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        data-testid="chat-widget-toggle"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: chatRight,
          zIndex: 9998,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--accent)',
          color: 'var(--btn-primary-text)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <ChatIcon />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="FAQ chat"
          data-testid="chat-widget-panel"
          style={{
            position: 'fixed',
            bottom: '5rem',
            right: chatRight,
            zIndex: 9999,
            width: 'min(380px, calc(100vw - 2rem))',
            maxHeight: 'min(520px, calc(100vh - 7rem))',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
              FAQ Chat
            </h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              style={{
                padding: '0.25rem',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: 'var(--radius)',
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '200px',
            }}
          >
            {messages.length === 0 && (
              <div style={{ marginBottom: '0.25rem' }}>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Suggested questions:
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                  }}
                >
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleChipClick(q)}
                      data-testid="chat-suggested-question"
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                }}
              >
                <div
                  data-testid={`chat-message-${msg.role}`}
                  style={{
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius)',
                    background:
                      msg.role === 'user'
                        ? 'var(--accent)'
                        : 'var(--surface)',
                    color:
                      msg.role === 'user' ? 'var(--btn-primary-text)' : 'var(--text)',
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                  }}
                >
                  {msg.content}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div
                    style={{
                      marginTop: '0.35rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span style={{ marginRight: '0.25rem' }}>From:</span>
                    {msg.citations.map((c) => (
                      <span key={c.id} style={{ marginRight: '0.35rem' }}>
                        {c.question}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              aria-label="Ask a question"
              data-testid="chat-input"
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send"
              data-testid="chat-send"
            >
              Send
            </button>
          </div>

          <div
            style={{
              padding: '0.5rem 1rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            <Link href="/contact">Contact us</Link> for personal help.
          </div>
        </div>
      )}
    </>
  );
}
