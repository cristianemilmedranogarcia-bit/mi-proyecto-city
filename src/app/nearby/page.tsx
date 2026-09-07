import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import NearbyView from './NearbyView';

export const revalidate = 0; // Dynamic rendering

export default async function NearbyPage({ searchParams }: { searchParams: Promise<{ city?: string; state?: string }> }) {
  const resolvedParams = await searchParams;
  const user = await getCurrentUser();
  const selectedCityName = resolvedParams?.city || 'Norwalk';
  const selectedStateCode = resolvedParams?.state || 'CT';

  return (
    <NearbyView
      initialUser={user}
      initialCity={selectedCityName}
      initialState={selectedStateCode}
    />
  );
}
