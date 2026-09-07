'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCheck } from 'lucide-react';

export default function MarkAllReadBtn() {
  const router = useRouter();

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button onClick={handleMarkAllRead} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
      <CheckCheck size={16} /> Mark All as Read
    </button>
  );
}
