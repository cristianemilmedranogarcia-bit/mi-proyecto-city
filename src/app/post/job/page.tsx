import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import PostJobForm from './PostJobForm';

export const revalidate = 0;

export default async function PostJobPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const categories = await prisma.jobCategory.findMany({
    orderBy: { name: 'asc' },
  });

  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
  });

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '780px' }}>
        <PostJobForm user={user} categories={categories} businesses={businesses} />
      </main>
      <MobileNav />
    </>
  );
}
