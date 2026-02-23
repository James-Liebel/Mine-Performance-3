import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Admin dashboard</h1>
      <p className="text-muted admin-page-desc" style={{ marginBottom: '2rem' }}>
        You can change almost everything by clicking on it. Use the sections below to edit <strong>events & times</strong>, <strong>pricing</strong>, <strong>waivers</strong>, and <strong>users</strong>. No coding required.
      </p>

      <div className="admin-dashboard-grid">
        <Link href="/admin/events" className="admin-dashboard-card card card-elevated">
          <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Schedules & events</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
            Click any event to edit date, time, title, or capacity. Add new events and delete ones you don’t need.
          </p>
          <span className="admin-dashboard-arrow" aria-hidden>→</span>
        </Link>

        <Link href="/admin/pricing" className="admin-dashboard-card card card-elevated">
          <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Pricing</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
            Click any membership name or price to edit. Add or remove plans. Click Save when done.
          </p>
          <span className="admin-dashboard-arrow" aria-hidden>→</span>
        </Link>

        <Link href="/admin/waivers" className="admin-dashboard-card card card-elevated">
          <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Waivers</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
            Click a waiver title or text to edit. Add new waivers or remove old ones. Members see Signed/Unsigned on their profile.
          </p>
          <span className="admin-dashboard-arrow" aria-hidden>→</span>
        </Link>

        <Link href="/admin/users" className="admin-dashboard-card card card-elevated">
          <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>Users</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
            See who can sign in. Click a name or role to change it. Manage who is Admin vs Member.
          </p>
          <span className="admin-dashboard-arrow" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
