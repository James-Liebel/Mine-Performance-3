import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  );
}
