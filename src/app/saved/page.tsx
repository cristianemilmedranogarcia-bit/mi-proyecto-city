import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import SavedTabsView from './SavedTabsView';
import { Bookmark } from 'lucide-react';

export const revalidate = 0;

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: user.id },
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

  const savedServices = await prisma.savedService.findMany({
    where: { userId: user.id },
    include: {
      service: {
        include: {
          provider: true,
          category: true,
          location: { include: { city: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: user.id },
    include: {
      item: {
        include: {
          seller: true,
          category: true,
          location: { include: { city: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const aj = await prisma.jobApplication.findMany({
    where: { applicantId: user.id },
    select: { jobId: true },
  });
  const appliedJobIds = aj.map((a) => a.jobId);

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase' }}>
            <Bookmark size={16} /> Saved Favorites
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Saved Jobs, Services & Marketplace Items</h1>
        </div>

        <SavedTabsView
          jobs={savedJobs.map((sj) => sj.job)}
          services={savedServices.map((ss) => ss.service)}
          items={savedItems.map((si) => si.item)}
          appliedJobIds={appliedJobIds}
        />
      </main>
      <MobileNav />
    </>
  );
}
