import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import ItemDetailView from './ItemDetailView';

export const revalidate = 0;

export default async function ItemDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ offer?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();

  const item = await prisma.marketplaceItem.findUnique({
    where: { id },
    include: {
      seller: true,
      category: true,
      location: { include: { city: true } },
    },
  });

  if (!item) {
    notFound();
  }

  // Increment view count
  await prisma.marketplaceItem.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  });

  let isSaved = false;
  let existingOffer = null;

  if (user) {
    const si = await prisma.savedItem.findFirst({
      where: { userId: user.id, itemId: item.id },
    });
    isSaved = !!si;

    existingOffer = await prisma.itemOffer.findFirst({
      where: { itemId: item.id, buyerId: user.id },
    });
  }

  const similarItems = await prisma.marketplaceItem.findMany({
    where: {
      categoryId: item.categoryId,
      id: { not: item.id },
      status: 'AVAILABLE',
    },
    include: {
      seller: true,
      category: true,
      location: { include: { city: true } },
    },
    take: 3,
  });

  return (
    <>
      <Navbar currentUser={user} />
      <ItemDetailView
        item={item}
        user={user}
        isSaved={isSaved}
        existingOffer={existingOffer}
        similarItems={similarItems}
        initialOfferOpen={resolvedSearchParams.offer === '1'}
      />
      <MobileNav />
    </>
  );
}
