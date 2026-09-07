import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import EmployerDashboardView from './EmployerDashboardView';

export const revalidate = 0;

export default async function EmployerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; userId?: string; appId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const targetUserId = resolvedSearchParams?.userId;
  const appId = resolvedSearchParams?.appId;

  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Get business owned by this user
  const business = await prisma.business.findFirst({
    where: { ownerId: user.id },
    include: {
      location: {
        include: {
          city: true,
        },
      },
    },
  });

  // Get all categories for job form
  const categories = await prisma.jobCategory.findMany({
    orderBy: { name: 'asc' },
  });

  // Get user businesses
  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
  });

  // Get jobs posted by user
  const jobs = await prisma.job.findMany({
    where: { postedById: user.id },
    include: {
      business: true,
      applications: {
        include: { applicant: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get user conversations for Business Inbox
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
    },
    include: {
      participant1: true,
      participant2: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  if (targetUserId && targetUserId !== user.id) {
    let existing = conversations.find(
      (c) =>
        (c.participant1Id === user.id && c.participant2Id === targetUserId) ||
        (c.participant1Id === targetUserId && c.participant2Id === user.id)
    );

    if (!existing) {
      const newConv = await prisma.conversation.create({
        data: {
          participant1Id: user.id,
          participant2Id: targetUserId,
          relatedType: appId ? 'job_application' : 'direct',
          relatedId: appId || null,
        },
        include: {
          participant1: true,
          participant2: true,
          messages: { take: 1 },
        },
      });
      conversations.unshift(newConv);
    }
  }

  return (
    <>
      <Navbar currentUser={user} />
      <main style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#F8FAFC' }}>
        <EmployerDashboardView
          user={user}
          initialBusiness={business}
          initialJobs={jobs}
          categories={categories}
          businesses={businesses}
          initialConversations={conversations}
        />
      </main>
      <MobileNav />
    </>
  );
}
