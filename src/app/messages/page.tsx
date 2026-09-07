import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import ChatInterface from './ChatInterface';

export const revalidate = 0;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; appId?: string; serviceId?: string; quoteId?: string; itemId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { userId: targetUserId, appId, serviceId, quoteId, itemId } = resolvedSearchParams;

  // Fetch initial context details if query parameters are present
  let activeContext: any = null;

  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true, provider: true, location: true },
    });
    if (service) {
      activeContext = { type: 'service', data: service };
    }
  } else if (appId) {
    const app = await prisma.jobApplication.findUnique({
      where: { id: appId },
      include: {
        job: { include: { business: true, location: true, category: true } },
        applicant: true,
      },
    });
    if (app) {
      activeContext = { type: 'job_application', data: app };
    }
  } else if (itemId) {
    const item = await prisma.marketplaceItem.findUnique({
      where: { id: itemId },
      include: { category: true, seller: true, location: true },
    });
    if (item) {
      activeContext = { type: 'marketplace_item', data: item };
    }
  }

  // Fetch all user conversations
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

  // If a targetUserId query param is passed, ensure a conversation exists
  let activeConversationId: string | null = conversations[0]?.id || null;
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
          relatedType: appId
            ? 'job_application'
            : quoteId
            ? 'quote_request'
            : serviceId
            ? 'service_inquiry'
            : itemId
            ? 'marketplace_item'
            : 'direct',
          relatedId: appId || quoteId || serviceId || itemId || null,
        },
        include: {
          participant1: true,
          participant2: true,
          messages: { take: 1 },
        },
      });
      conversations.unshift(newConv);
      activeConversationId = newConv.id;
    } else {
      activeConversationId = existing.id;
    }
  }

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
              Local Inbox & Messages
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Direct messages with local workers, pros, employers, and buyers in Norwalk, CT
            </p>
          </div>
        </div>
        <ChatInterface
          currentUser={user}
          initialConversations={conversations}
          initialActiveId={activeConversationId}
          initialContext={activeContext}
        />
      </main>
      <MobileNav />
    </>
  );
}
