'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CoachesClient, type Coach } from '@/app/coaches/CoachesClient';

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCoaches = () => {
    fetch('/api/admin/coaches')
      .then((r) => r.json())
      .then((data) => setCoaches(Array.isArray(data) ? data : []))
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoaches();
  }, []);

  if (loading && coaches.length === 0) {
    return (
      <div className="container admin-page">
        <p className="text-muted">Loading coaches…</p>
      </div>
    );
  }

  return (
    <div className="container admin-page">
      <h1 className="admin-page-title">Coaches</h1>
      <p className="admin-page-desc text-muted">
        Edit bios, add or remove coaches. Changes appear on the <Link href="/about#coaching-staff">About page</Link>.
        You can also edit coaches from the About page when using &quot;Edit site&quot; (Ctrl+E).
      </p>
      <CoachesClient coaches={coaches} onCoachChange={loadCoaches} showEditUI />
    </div>
  );
}
