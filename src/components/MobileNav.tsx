'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Briefcase, ShoppingBag, PlusCircle, MessageSquare, Building2, Users } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <nav className="mobile-bottom-nav">
      <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link href="/jobs" className={`mobile-nav-item ${pathname.startsWith('/jobs') ? 'active' : ''}`}>
        <Briefcase size={20} />
        <span>Jobs</span>
      </Link>
      {user?.role === 'EMPLOYER' ? (
        <>
          <Link href="/employer/dashboard" className={`mobile-nav-item ${pathname === '/employer/dashboard' ? 'active' : ''}`}>
            <Building2 size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/employer/employees" className={`mobile-nav-item ${pathname.startsWith('/employer/employees') ? 'active' : ''}`}>
            <Users size={20} />
            <span>Employees</span>
          </Link>
        </>
      ) : (
        <>
          <Link href="/marketplace" className={`mobile-nav-item ${pathname.startsWith('/marketplace') ? 'active' : ''}`}>
            <ShoppingBag size={20} />
            <span>Market</span>
          </Link>
          <Link href="/nearby" className={`mobile-nav-item ${pathname.startsWith('/nearby') ? 'active' : ''}`}>
            <Compass size={20} />
            <span>Nearby</span>
          </Link>
        </>
      )}
      <Link href="/post/job" className="mobile-nav-item" style={{ color: '#E05638' }}>
        <PlusCircle size={24} />
        <span>Post</span>
      </Link>
      <Link href="/messages" className={`mobile-nav-item ${pathname.startsWith('/messages') ? 'active' : ''}`}>
        <MessageSquare size={20} />
        <span>Messages</span>
      </Link>
    </nav>
  );
}
