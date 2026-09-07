import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import { Briefcase, Building2, MapPin, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const applications = await prisma.jobApplication.findMany({
    where: { applicantId: user.id },
    include: {
      job: {
        include: {
          business: true,
          location: { include: { city: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return (
          <span className="badge" style={{ backgroundColor: '#F0FDF4', color: '#16845D', border: '1px solid #A7F3D0', fontWeight: 800 }}>
            📥 Application Sent
          </span>
        );
      case 'VIEWED':
        return (
          <span className="badge" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', fontWeight: 800 }}>
            👀 Application Viewed by Business Owner
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="badge" style={{ backgroundColor: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', fontWeight: 800 }}>
            ⭐ Shortlisted for Role
          </span>
        );
      case 'INTERVIEW':
        return (
          <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', fontWeight: 800 }}>
            📅 Interview Invited
          </span>
        );
      case 'HIRED':
        return (
          <span className="badge" style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', fontWeight: 800 }}>
            🎉 Hired / Offer Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5', fontWeight: 800 }}>
            Not Selected
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase' }}>
            <Briefcase size={16} /> Job Seeker Tracking
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>My Applications</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Track live updates, status changes, and employer communications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={28} />
            </div>
            <h3>No applications submitted yet</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
              Explore jobs in Norwalk, CT and apply with your profile.
            </p>
            <Link href="/jobs" className="btn btn-primary">
              Explore Local Jobs
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                  <div className="company-logo-box">
                    {app.job.business?.logoUrl ? (
                      <img src={app.job.business.logoUrl} alt={app.job.business.name} />
                    ) : (
                      <Building2 size={24} color="#64748B" />
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{app.job.title}</h3>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      {app.job.business?.name || 'Local Employer'} · {app.job.location?.neighborhood || 'Norwalk'}, CT
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span>Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Type: {app.job.employmentType}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>{getStatusBadge(app.status)}</div>
                  <Link href={`/jobs/${app.jobId}`} className="btn btn-outline btn-sm">
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <MobileNav />
    </>
  );
}
