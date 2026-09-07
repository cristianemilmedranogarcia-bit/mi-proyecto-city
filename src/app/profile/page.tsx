import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import ProfileEditView from './ProfileEditView';

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '800px' }}>
        <ProfileEditView user={user} />
      </main>
      <MobileNav />
    </>
  );
}
