'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Users, Briefcase, Wrench, ShoppingBag, Flag, Trash2, MapPin } from 'lucide-react';

interface AdminDashboardViewProps {
  stats: any;
  users: any[];
  businesses: any[];
  jobs: any[];
  services: any[];
  items: any[];
  reports: any[];
  cities: any[];
}

export default function AdminDashboardView({
  stats,
  users: initialUsers,
  businesses: initialBusinesses,
  jobs: initialJobs,
  services: initialServices,
  items: initialItems,
  reports: initialReports,
  cities: initialCities,
}: AdminDashboardViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'services' | 'marketplace' | 'reports' | 'cities'>('overview');

  const [newCityName, setNewCityName] = useState('');
  const [newCityZips, setNewCityZips] = useState('');

  const handleVerifyBusiness = async (bizId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_business', targetId: bizId }),
      });
      if (res.ok) router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_job', targetId: jobId }),
      });
      if (res.ok) router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service listing?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_service', targetId: serviceId }),
      });
      if (res.ok) router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this marketplace item?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_marketplace_item', targetId: itemId }),
      });
      if (res.ok) router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve_report', targetId: reportId }),
      });
      if (res.ok) router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_city',
          data: { name: newCityName, state: 'CT', zipCodes: newCityZips },
        }),
      });
      if (res.ok) {
        setNewCityName('');
        setNewCityZips('');
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>
          <ShieldAlert size={16} /> Restricted Admin System
        </div>
        <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Platform Control Dashboard</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
          Manage local users, verify businesses, moderate jobs, services & marketplace listings, and configure Connecticut cities
        </p>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="search-tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`search-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`search-tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users & Businesses
        </button>
        <button className={`search-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          Jobs Moderation
        </button>
        <button className={`search-tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
          Services Moderation
        </button>
        <button className={`search-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
          Marketplace Items ({stats.itemCount})
        </button>
        <button className={`search-tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          Reports Queue ({stats.reportCount})
        </button>
        <button className={`search-tab-btn ${activeTab === 'cities' ? 'active' : ''}`} onClick={() => setActiveTab('cities')}>
          Cities Configuration
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="filter-box" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ color: '#E05638', marginBottom: '0.4rem' }}><Users size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.userCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Total Registered Users</div>
            </div>
            <div className="filter-box" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ color: '#2563EB', marginBottom: '0.4rem' }}><Briefcase size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.jobCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Active Jobs</div>
            </div>
            <div className="filter-box" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ color: '#059669', marginBottom: '0.4rem' }}><Wrench size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.serviceCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Active Services</div>
            </div>
            <div className="filter-box" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ color: '#9333EA', marginBottom: '0.4rem' }}><ShoppingBag size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.itemCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Marketplace Items</div>
            </div>
            <div className="filter-box" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ color: '#DC2626', marginBottom: '0.4rem' }}><Flag size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.reportCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Pending Reports</div>
            </div>
          </div>
        </div>
      )}

      {/* USERS & BUSINESSES TAB */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="search-box-wrapper">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Local Business Verification</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {initialBusinesses.map((b) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{b.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{b.category} · {b.email || 'No email'}</div>
                  </div>
                  <div>
                    {b.isVerified ? (
                      <span className="badge badge-verified">Verified ✓</span>
                    ) : (
                      <button onClick={() => handleVerifyBusiness(b.id)} className="btn btn-dark btn-sm">
                        Verify Business
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="search-box-wrapper">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>User Directory (Recent)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {initialUsers.map((u) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', borderBottom: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{u.name}</span> ({u.email})
                  </div>
                  <div>
                    <span className="tag-badge">{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* JOBS MODERATION TAB */}
      {activeTab === 'jobs' && (
        <div className="search-box-wrapper">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Active Jobs Moderation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {initialJobs.map((j) => (
              <div key={j.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{j.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{j.business?.name || 'Local Employer'} · Posted {new Date(j.createdAt).toLocaleDateString()}</div>
                </div>
                <button onClick={() => handleDeleteJob(j.id)} className="btn btn-outline btn-sm" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>
                  <Trash2 size={14} /> Remove Listing
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES MODERATION TAB */}
      {activeTab === 'services' && (
        <div className="search-box-wrapper">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Active Services Moderation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {initialServices.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Provider: {s.provider?.name} · Rating: {s.rating}★</div>
                </div>
                <button onClick={() => handleDeleteService(s.id)} className="btn btn-outline btn-sm" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>
                  <Trash2 size={14} /> Remove Listing
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MARKETPLACE MODERATION TAB */}
      {activeTab === 'marketplace' && (
        <div className="search-box-wrapper">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Marketplace Items Moderation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {initialItems.map((itm) => (
              <div key={itm.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{itm.title} (${itm.price})</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Seller: {itm.seller?.name} · Listed {new Date(itm.createdAt).toLocaleDateString()}</div>
                </div>
                <button onClick={() => handleDeleteItem(itm.id)} className="btn btn-outline btn-sm" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>
                  <Trash2 size={14} /> Remove Item
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS QUEUE TAB */}
      {activeTab === 'reports' && (
        <div className="search-box-wrapper">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pending Reports Queue</h3>
          {initialReports.length === 0 ? (
            <p style={{ color: '#64748B' }}>No pending reports.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {initialReports.map((rep) => (
                <div key={rep.id} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#DC2626', marginBottom: '0.2rem' }}>
                    Reason: {rep.reason} (Target: {rep.targetType} #{rep.targetId})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.6rem' }}>
                    Reported by: {rep.reporter?.name || 'User'}
                  </div>
                  <button onClick={() => handleResolveReport(rep.id)} className="btn btn-dark btn-sm">
                    Dismiss / Resolve Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CITIES CONFIGURATION TAB */}
      {activeTab === 'cities' && (
        <div className="search-box-wrapper">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Connecticut Cities Management</h3>

          <form onSubmit={handleAddCity} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '0.8rem' }}
              placeholder="City Name (e.g. Bridgeport, New Haven)"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '0.8rem' }}
              placeholder="Zip Codes (e.g. 06604, 06605)"
              value={newCityZips}
              onChange={(e) => setNewCityZips(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Add City
            </button>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {initialCities.map((c) => (
              <span key={c.id} className="tag-badge" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                {c.name}, {c.state} ({c.zipCodes})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
