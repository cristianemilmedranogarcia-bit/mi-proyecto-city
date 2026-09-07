import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import { Bell, CheckCheck, Briefcase, MessageSquare, Star, FileText } from 'lucide-react';
import MarkAllReadBtn from './MarkAllReadBtn';

export const revalidate = 0;

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase' }}>
              <Bell size={16} /> Notification Center
            </div>
            <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Notifications</h1>
          </div>

          <MarkAllReadBtn />
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Bell size={28} />
            </div>
            <h3>No notifications</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem' }}>
              You're all caught up! New alerts will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link || '#'}
                style={{
                  backgroundColor: n.isRead ? '#FFFFFF' : '#FFF4F1',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: n.isRead ? '#F1F5F9' : '#E05638',
                    color: n.isRead ? '#64748B' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bell size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{n.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.4rem' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <MobileNav />
    </>
  );
}
