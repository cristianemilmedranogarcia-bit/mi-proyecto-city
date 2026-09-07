import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import PostServiceForm from './PostServiceForm';

export const revalidate = 0;

export default async function PostServicePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '780px' }}>
        <PostServiceForm user={user} categories={categories} />
      </main>
      <MobileNav />
    </>
  );
}
