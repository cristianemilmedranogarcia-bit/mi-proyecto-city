import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import ServiceDetailView from './ServiceDetailView';

export const revalidate = 0;

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ quote?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      provider: true,
      category: true,
      location: { include: { city: true } },
      reviews: {
        include: { reviewer: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!service) {
    notFound();
  }

  let isSaved = false;
  if (user) {
    const ss = await prisma.savedService.findFirst({
      where: { userId: user.id, serviceId: service.id },
    });
    isSaved = !!ss;
  }

  return (
    <>
      <Navbar currentUser={user} />
      <ServiceDetailView
        service={service}
        user={user}
        isSaved={isSaved}
        initialQuoteOpen={resolvedSearchParams.quote === '1'}
      />
      <MobileNav />
    </>
  );
}
