import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Link from 'next/link';
import { AdminNav } from './AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  if (role !== 'admin') {
    redirect('/profile');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-inner">
          <h2 className="admin-sidebar-title">Admin</h2>
          <AdminNav />
        </div>
      </aside>
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
