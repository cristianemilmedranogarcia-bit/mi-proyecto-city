import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import AdminDashboardView from './AdminDashboardView';

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  const userCount = await prisma.user.count();
  const jobCount = await prisma.job.count();
  const serviceCount = await prisma.service.count();
  const itemCount = await prisma.marketplaceItem.count();
  const applicationCount = await prisma.jobApplication.count();
  const reportCount = await prisma.report.count({ where: { status: 'pending' } });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const jobs = await prisma.job.findMany({
    include: { business: true },
    orderBy: { createdAt: 'desc' },
  });

  const services = await prisma.service.findMany({
    include: { provider: true },
    orderBy: { createdAt: 'desc' },
  });

  const items = await prisma.marketplaceItem.findMany({
    include: { seller: true },
    orderBy: { createdAt: 'desc' },
  });

  const reports = await prisma.report.findMany({
    where: { status: 'pending' },
    include: { reporter: true },
    orderBy: { createdAt: 'desc' },
  });

  const cities = await prisma.city.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem' }}>
        <AdminDashboardView
          stats={{ userCount, jobCount, serviceCount, itemCount, applicationCount, reportCount }}
          users={users}
          businesses={businesses}
          jobs={jobs}
          services={services}
          items={items}
          reports={reports}
          cities={cities}
        />
      </main>
      <MobileNav />
    </>
  );
}
