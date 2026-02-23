'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditableContent } from '@/components/EditableContent';
import type { CollegeCommit, Endorsement, CommitDivision } from '@/lib/results-store';

const DIVISION_ORDER: CommitDivision[] = ['d1', 'd2', 'd3', 'juco_naia'];
const DIVISION_LABELS: Record<CommitDivision, string> = {
  d1: 'Division I',
  d2: 'Division II',
  d3: 'Division III',
  juco_naia: 'JUCO / NAIA',
};

export function ResultsPageContent() {
  const [collegeCommits, setCollegeCommits] = useState<CollegeCommit[]>([]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/results')
      .then((r) => r.json())
      .then((data) => {
        setCollegeCommits(Array.isArray(data.collegeCommits) ? data.collegeCommits : []);
        setEndorsements(Array.isArray(data.endorsements) ? data.endorsements : []);
      })
      .catch(() => {
        setCollegeCommits([]);
        setEndorsements([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const commitsByDivision = useMemo(() => {
    const map: Record<CommitDivision, CollegeCommit[]> = { d1: [], d2: [], d3: [], juco_naia: [] };
    collegeCommits.forEach((c) => {
      const div = (c.division && map[c.division] ? c.division : 'd1') as CommitDivision;
      map[div].push(c);
    });
    return map;
  }, [collegeCommits]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-home-section alt-bg">
        <div className="container">
          <h1><EditableContent contentKey="results_heading" fallback="College commits" as="span" /></h1>
          <p className="section-sub" style={{ maxWidth: '640px' }}>
            <EditableContent contentKey="results_sub" fallback="Athletes from our facility who have committed to play at the next level. We're proud of every one of them." as="span" />
          </p>
        </div>
      </section>

      <section className="page-home-section">
        <div className="container">
          <h2><EditableContent contentKey="results_athletes_heading" fallback="Athletes & colleges" as="span" /></h2>
          {collegeCommits.length === 0 ? (
            <p className="text-muted"><EditableContent contentKey="results_no_commits" fallback="No college commits listed yet. Check back soon." as="span" /></p>
          ) : (
            <>
              {DIVISION_ORDER.map((division) => {
                const list = commitsByDivision[division];
                if (list.length === 0) return null;
                return (
                  <div key={division} className="results-commits-division" style={{ marginBottom: '2rem' }}>
                    <h3 className="results-commits-division-title" style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {DIVISION_LABELS[division]}
                    </h3>
                    <ul className="results-commits-list" role="list">
                      {list.map((c) => (
                        <li key={c.id} className="card card-elevated results-commit-card results-commit-card--interactive">
                          <div className="results-commit-inner">
                            {c.imageUrl && (
                              <div className="results-commit-image-wrap">
                                <Image src={c.imageUrl} alt={c.athleteName ? `${c.athleteName} college` : 'College logo'} width={48} height={48} className="results-commit-image" unoptimized />
                              </div>
                            )}
                            <div className="results-commit-main">
                              <span className="results-commit-name">{c.athleteName}</span>
                              <span className="results-commit-college">{c.college}</span>
                            </div>
                          </div>
                          {(c.year || c.position) && (
                            <div className="results-commit-meta">
                              {c.position && <span className="results-commit-position">{c.position}</span>}
                              {c.year && <span className="results-commit-year">{c.year}</span>}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      <section className="page-home-section alt-bg">
        <div className="container">
          <h2><EditableContent contentKey="results_endorsements_heading" fallback="Player endorsements" as="span" /></h2>
          <p className="section-sub" style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>
            <EditableContent contentKey="results_endorsements_sub" fallback="What athletes and families say about training at Mine Performance." as="span" />
          </p>
          {endorsements.length === 0 ? (
            <p className="text-muted"><EditableContent contentKey="results_no_endorsements" fallback="No endorsements yet. Check back soon." as="span" /></p>
          ) : (
            <div className="results-endorsements-grid">
              {endorsements.map((e) => (
                <blockquote key={e.id} className="card card-elevated results-endorsement-card results-endorsement-card--interactive">
                  <p className="results-endorsement-quote">&ldquo;{e.quote}&rdquo;</p>
                  <footer className="results-endorsement-footer">
                    <cite className="results-endorsement-name">{e.athleteName}</cite>
                    {e.college && <span className="results-endorsement-college">{e.college}</span>}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-home-section">
        <div className="container cta-row">
          <Link href="/member-registration" className="btn btn-primary">
            View memberships
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact us
          </Link>
        </div>
      </section>

      <style jsx>{`
        .results-commits-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        .results-commit-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .results-commit-card--interactive {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .results-commit-card--interactive:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(234, 88, 12, 0.15);
          border-color: var(--surface-hover);
        }
        .results-commit-inner {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .results-commit-image-wrap {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--bg-subtle);
          border: 1px solid var(--border);
        }
        .results-commit-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .results-commit-main {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }
        .results-commit-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text);
        }
        .results-commit-college {
          color: var(--accent);
          font-size: 0.95rem;
        }
        .results-commit-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .results-endorsements-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }
        .results-endorsement-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .results-endorsement-card--interactive {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .results-endorsement-card--interactive:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(234, 88, 12, 0.12);
          border-color: var(--surface-hover);
        }
        .results-endorsement-quote {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text);
          flex: 1;
        }
        .results-endorsement-footer {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-style: normal;
        }
        .results-endorsement-name {
          font-weight: 600;
          color: var(--text);
        }
        .results-endorsement-college {
          font-size: 0.9rem;
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
