import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import JobDetailView from './JobDetailView';

export const revalidate = 0;

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      business: {
        include: { location: { include: { city: true } } },
      },
      category: true,
      location: { include: { city: true } },
      postedBy: true,
      applications: true,
    },
  });

  if (!job) {
    notFound();
  }

  // Increment view count
  await prisma.job.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  });

  // Check if user already applied
  let existingApplication = null;
  let isSaved = false;
  let appliedJobIds: string[] = [];

  if (user) {
    existingApplication = await prisma.jobApplication.findFirst({
      where: { jobId: job.id, applicantId: user.id },
    });

    const sj = await prisma.savedJob.findFirst({
      where: { userId: user.id, jobId: job.id },
    });
    isSaved = !!sj;

    const aj = await prisma.jobApplication.findMany({
      where: { applicantId: user.id },
      select: { jobId: true },
    });
    appliedJobIds = aj.map((a) => a.jobId);
  }

  // Fetch similar jobs in same category
  const similarJobs = await prisma.job.findMany({
    where: {
      categoryId: job.categoryId,
      id: { not: job.id },
      status: 'active',
    },
    include: {
      business: true,
      location: { include: { city: true } },
    },
    take: 3,
  });

  return (
    <>
      <Navbar currentUser={user} />
      <JobDetailView
        job={job}
        user={user}
        existingApplication={existingApplication}
        isSaved={isSaved}
        similarJobs={similarJobs}
        appliedJobIds={appliedJobIds}
      />
      <MobileNav />
    </>
  );
}
