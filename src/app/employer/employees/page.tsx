import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import EmployeesView from './EmployeesView';

export const revalidate = 0;

export default async function EmployerEmployeesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'EMPLOYER') {
    redirect('/');
  }

  const business = await prisma.business.findFirst({
    where: { ownerId: user.id },
    include: { location: { include: { city: true } } },
  });

  // Fetch hired applicants from job listings
  const hiredApplications = await prisma.jobApplication.findMany({
    where: {
      status: 'HIRED',
      job: {
        OR: [
          { postedById: user.id },
          { business: { ownerId: user.id } },
        ],
      },
    },
    include: {
      applicant: true,
      job: true,
    },
    orderBy: { statusUpdatedAt: 'desc' },
  });

  // Fetch employer's jobs to calculate sidebar counts (Postings, Candidates, Interview Schedule)
  const jobs = await prisma.job.findMany({
    where: {
      OR: [
        { postedById: user.id },
        { business: { ownerId: user.id } },
      ],
    },
    include: {
      applications: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  return (
    <>
      <Navbar currentUser={user} />
      <main style={{ padding: 0, margin: 0, backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 70px)' }}>
        <EmployeesView user={user} business={business} hiredApplications={hiredApplications} jobs={jobs} />
      </main>
      <MobileNav />
    </>
  );
}
