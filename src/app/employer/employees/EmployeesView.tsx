'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Plus,
  X,
  ShieldCheck,
  Award,
  Calendar,
  DollarSign,
  ChevronRight,
  MoreVertical,
  Trash2,
  LayoutDashboard,
  PlusCircle,
  Wrench,
  Megaphone,
  Store,
  BarChart3,
  ExternalLink,
  CalendarDays,
} from 'lucide-react';

interface EmployeesViewProps {
  user: any;
  business: any;
  hiredApplications: any[];
  jobs?: any[];
}

const DEFAULT_EMPLOYEES = [
  {
    id: 'emp-1',
    name: 'Carlos Mendoza',
    role: 'Lead Print Technician & Supervisor',
    department: 'Production & Press',
    email: 'carlos.mendoza@studiomarkprint.com',
    phone: '(203) 555-0192',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'ACTIVE',
    startDate: '2024-03-15',
    hourlyRate: 28.50,
    schedule: 'Mon–Fri (8:00 AM – 4:30 PM)',
  },
  {
    id: 'emp-2',
    name: 'Jessica Reynolds',
    role: 'Senior Graphic Designer',
    department: 'Design Studio',
    email: 'jessica.r@studiomarkprint.com',
    phone: '(203) 555-0144',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    status: 'ACTIVE',
    startDate: '2024-06-01',
    hourlyRate: 32.00,
    schedule: 'Mon–Fri (9:00 AM – 5:00 PM)',
  },
  {
    id: 'emp-3',
    name: 'Mateo Delgado',
    role: 'Customer Service & Counter Lead',
    department: 'Storefront & Sales',
    email: 'mateo.delgado@studiomarkprint.com',
    phone: '(203) 555-0188',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'ACTIVE',
    startDate: '2025-01-10',
    hourlyRate: 22.00,
    schedule: 'Tue–Sat (8:30 AM – 5:00 PM)',
  },
];

export default function EmployeesView({ user, business, hiredApplications, jobs = [] }: EmployeesViewProps) {
  // Sidebar counter metrics
  const postingsCount = jobs.length;
  const activeCandidatesCount = jobs.flatMap((job) => job.applications || []).filter((app: any) => app.status !== 'INTERVIEW' && app.status !== 'HIRED' && app.status !== 'REJECTED').length;
  const scheduledInterviewsCount = jobs.flatMap((job) => job.applications || []).filter((app: any) => app.status === 'INTERVIEW').length;

  const [employees, setEmployees] = useState(() => {
    // Combine hired applications + default team members
    const hiredConverted = hiredApplications.map((app) => ({
      id: app.id,
      name: app.applicant.name,
      role: app.job.title,
      department: app.job.category?.name || 'General Staff',
      email: app.applicant.email,
      phone: app.applicant.phone || '(203) 555-0100',
      avatarUrl: app.applicant.avatarUrl,
      status: 'ACTIVE',
      startDate: new Date(app.statusUpdatedAt).toISOString().split('T')[0],
      hourlyRate: app.job.salaryMin || 22.00,
      schedule: 'Full-Time Shift',
    }));

    return [...hiredConverted, ...DEFAULT_EMPLOYEES];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDepartment, setNewDepartment] = useState('Production & Press');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newHourlyRate, setNewHourlyRate] = useState('22.00');
  const [newSchedule, setNewSchedule] = useState('Mon–Fri (8:00 AM – 4:30 PM)');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole) return;

    const created = {
      id: `emp-custom-${Date.now()}`,
      name: newName,
      role: newRole,
      department: newDepartment,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@business.com`,
      phone: newPhone || '(203) 555-0100',
      avatarUrl: null,
      status: 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0],
      hourlyRate: parseFloat(newHourlyRate) || 22.00,
      schedule: newSchedule,
    };

    setEmployees((prev) => [created, ...prev]);
    setShowAddModal(false);

    // Reset form
    setNewName('');
    setNewRole('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleRemoveEmployee = (id: string) => {
    if (confirm('Are you sure you want to remove this employee from your staff roster?')) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  });

  const companyName = business?.name || `${user.name}'s Business`;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', backgroundColor: '#F8FAFC' }}>
      {/* LEFT NAVIGATION SIDEBAR (Employer Portal) */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #ECE7DF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.75rem 1.15rem',
          flexShrink: 0,
          fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Section Header */}
          <div style={{ padding: '0 0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0E3B2E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={20} color="#16845D" />
              <span>Employer Portal</span>
            </div>
            <div style={{ fontSize: '0.975rem', color: '#5D5851', fontWeight: 700 }}>
              Business Management
            </div>
          </div>

          {/* Menu Items Group 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link
              href="/employer/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <LayoutDashboard size={18} color="#16845D" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/employer/dashboard?tab=postings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <Briefcase size={18} color="#16845D" />
              <span>Postings ({postingsCount})</span>
            </Link>

            <Link
              href="/employer/dashboard?tab=post_job"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <PlusCircle size={18} color="#16845D" />
              <span>Post a New Job</span>
            </Link>

            <Link
              href="/employer/dashboard?tab=post_service"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <Wrench size={18} color="#475569" />
              <span>Post a Service</span>
            </Link>

            <Link
              href="/employer/dashboard?tab=candidates"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={18} color="#16845D" />
                <span>Candidates</span>
              </div>
              {activeCandidatesCount > 0 && (
                <span style={{ backgroundColor: '#E05638', color: '#FFFFFF', fontSize: '0.725rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px' }}>
                  {activeCandidatesCount}
                </span>
              )}
            </Link>

            <Link
              href="/employer/dashboard?tab=schedule"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CalendarDays size={18} color="#16845D" />
                <span>Interview Schedule</span>
              </div>
              {scheduledInterviewsCount > 0 && (
                <span style={{ backgroundColor: '#E05638', color: '#FFFFFF', fontSize: '0.725rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px' }}>
                  {scheduledInterviewsCount}
                </span>
              )}
            </Link>

            <Link
              href="/employer/employees"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: '#0E3B2E',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(14, 59, 70, 0.15)',
              }}
            >
              <Users size={18} color="#A7F3D0" />
              <span>Employees</span>
            </Link>

            <Link
              href="/employer/dashboard?tab=campaigns"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <Megaphone size={18} color="#16845D" />
              <span>Campaigns</span>
            </Link>

            <Link
              href="/employer/dashboard?tab=featured"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <ShieldCheck size={18} color="#16845D" />
              <span>Featured Employer</span>
            </Link>

            <Link
              href="/employer/dashboard?tab=messages"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <MessageSquare size={18} color="#16845D" />
              <span>Messages</span>
            </Link>
          </div>

          {/* Group 2: Management & Analytics */}
          <div style={{ borderTop: '1px solid #ECE7DF', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0E3B2E', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
              Management & Analytics
            </div>

            <Link
              href="/employer/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              <Store size={18} color="#5D5851" />
              <span>Business Profile</span>
            </Link>

            <Link
              href="/employer/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              <BarChart3 size={18} color="#5D5851" />
              <span>Reports & Analytics</span>
            </Link>

            <Link
              href="/jobs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={18} color="#5D5851" />
              <span>View Public Portal</span>
            </Link>
          </div>
        </div>

        {/* User Account Footer */}
        <div style={{ borderTop: '1px solid #ECE7DF', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: '#0E3B2E',
              color: '#FFFFFF',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            {business?.name ? business.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'B'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {business?.name || user?.name || 'My Business'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        {/* Top Banner Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            <Users size={16} /> Business Staff & Employee Roster
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: '#0F172A' }}>
                Employees at {companyName}
              </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.3rem', margin: 0 }}>
              Manage your local staff team, view active employees, schedule shifts, and track hired job applicants.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-lg"
            style={{ borderRadius: '12px', gap: '0.5rem' }}
          >
            <UserPlus size={18} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="filter-box" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#E05638', marginBottom: '0.4rem' }}><Users size={24} /></div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>{employees.length}</div>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>Total Active Staff</div>
        </div>

        <div className="filter-box" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#059669', marginBottom: '0.4rem' }}><CheckCircle2 size={24} /></div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>{hiredApplications.length}</div>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>Hired from Job Listings</div>
        </div>

        <div className="filter-box" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#2563EB', marginBottom: '0.4rem' }}><Clock size={24} /></div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>{employees.length}</div>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>On Shift Today</div>
        </div>

        <div className="filter-box" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#7C3AED', marginBottom: '0.4rem' }}><Award size={24} /></div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>100%</div>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>Fairfield County Team</div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="search-box-wrapper" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="input-icon-group" style={{ flex: 1 }}>
            <Search size={18} color="#64748B" />
            <input
              type="text"
              className="form-input"
              placeholder="Search employees by name, title, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} listed
          </span>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="search-box-wrapper"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.35rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div>
              {/* Employee Top Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {emp.avatarUrl ? (
                      <img src={emp.avatarUrl} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      emp.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      {emp.name}
                    </h3>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#059669',
                        backgroundColor: '#ECFDF5',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        marginTop: '0.2rem',
                      }}
                    >
                      🟢 Active Staff
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveEmployee(emp.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  title="Remove Employee"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Role & Department */}
              <div style={{ marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>
                  {emp.role}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={13} color="#94A3B8" />
                  <span>{emp.department}</span>
                </div>
              </div>

              {/* Details List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: '#475569', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} color="#64748B" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} color="#64748B" />
                  <span>{emp.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={14} color="#059669" />
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>${emp.hourlyRate.toFixed(2)} / hour</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} color="#64748B" />
                  <span>Started {emp.startDate}</span>
                </div>
              </div>
            </div>

            {/* Card Actions Footer */}
            <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9' }}>
              <Link
                href="/messages"
                className="btn btn-outline btn-sm"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '8px' }}
              >
                <MessageSquare size={14} />
                <span>Message</span>
              </Link>
              <button
                className="btn btn-dark btn-sm"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '8px' }}
                onClick={() => alert(`Managing schedule and shifts for ${emp.name}`)}
              >
                <Clock size={14} />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Employee to Staff Roster</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Register a new staff member for {companyName}
                </span>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Maria Santos"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Job Position / Title *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Print Specialist, Counter Associate, Line Cook"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Department
                  </label>
                  <select className="form-input" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)}>
                    <option value="Production & Press">Production & Press</option>
                    <option value="Design Studio">Design Studio</option>
                    <option value="Storefront & Sales">Storefront & Sales</option>
                    <option value="Logistics & Delivery">Logistics & Delivery</option>
                    <option value="General Staff">General Staff</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    className="form-input"
                    placeholder="22.50"
                    value={newHourlyRate}
                    onChange={(e) => setNewHourlyRate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="employee@studiomarkprint.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="(203) 555-0100"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }}>
                  <Plus size={18} />
                  <span>Add to Employees</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
