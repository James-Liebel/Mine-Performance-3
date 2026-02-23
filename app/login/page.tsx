'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EditableContent } from '@/components/EditableContent';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/profile';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password.');
      return;
    }
    if (res?.url) window.location.href = res.url;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '400px' }}>
      <h1><EditableContent contentKey="login_heading" fallback="Login" as="span" /></h1>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
        <EditableContent contentKey="login_sub" fallback="Sign in to your account to access your profile." as="span" />
      </p>
      <form onSubmit={handleSubmit} className="card card-elevated" style={{ padding: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            style={{ width: '100%' }}
          />
        </div>
        {error && (
          <p style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
        <EditableContent contentKey="login_no_account_before" fallback="Don't have an account? " as="span" />
        <Link href="/contact"><EditableContent contentKey="login_no_account_link" fallback="Contact us" as="span" /></Link>
        <EditableContent contentKey="login_no_account_after" fallback=" to get started." as="span" />
      </p>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
        <strong>Demo:</strong> Admin — admin@mineperformance.com / admin. Member — member@mineperformance.com / member.
      </p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        <Link href="/">Back to home</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: '3rem' }}><p>Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
