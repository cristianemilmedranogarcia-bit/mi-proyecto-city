'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Key, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      const targetRole = data.user?.activeRole || data.user?.role;
      if (targetRole === 'EMPLOYER' || targetRole === 'SERVICE_PROVIDER') {
        router.push('/employer/dashboard');
      } else if (targetRole === 'SELLER') {
        router.push('/seller/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Quick login failed');
      }
      const targetRole = data.user?.activeRole || data.user?.role;
      if (targetRole === 'EMPLOYER') {
        router.push('/employer/dashboard');
      } else if (targetRole === 'SERVICE_PROVIDER') {
        router.push('/provider/dashboard');
      } else if (targetRole === 'SELLER') {
        router.push('/seller/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '3.5rem 1.25rem', maxWidth: '480px' }}>
        <div className="search-box-wrapper" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#FFF4F1',
                color: '#E05638',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto',
              }}
            >
              <LogIn size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Sign in to your PostPlace CT account</p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div className="input-icon-group">
                <Mail size={18} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div className="input-icon-group">
                <Key size={18} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
              Quick Demo Logins (Norwalk, CT)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickLogin('studiomarkprint123@gmail.com')}
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ECFDF5',
                  borderColor: '#A7F3D0',
                  color: '#047857',
                  fontWeight: 700,
                }}
              >
                <span>🏢 Business: Studio Mark & Print</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickLogin('alex@user.com')}
                style={{ justifyContent: 'space-between', width: '100%' }}
              >
                <span>Job Seeker: Alex Rivera</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickLogin('hr@norwalkdistro.com')}
                style={{ justifyContent: 'space-between', width: '100%' }}
              >
                <span>Employer: Norwalk Logistics</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickLogin('carlos@homerepair.com')}
                style={{ justifyContent: 'space-between', width: '100%' }}
              >
                <span>Provider: Carlos Handyman</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickLogin('admin@norwalklocal.com')}
                style={{ justifyContent: 'space-between', width: '100%', borderColor: '#FCA5A5', color: '#DC2626' }}
              >
                <span>Admin System Account</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#E05638', fontWeight: 700 }}>
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
