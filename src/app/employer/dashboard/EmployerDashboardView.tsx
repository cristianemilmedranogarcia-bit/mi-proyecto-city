'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Briefcase,
  Building2,
  PlusCircle,
  Users,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Tag,
  ExternalLink,
  Store,
  Pencil,
  ShieldCheck,
  Check,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Languages,
  DollarSign,
  Clock,
  Heart,
  Calendar,
  Zap,
  HeartPulse,
  Utensils,
  Car,
  Wrench,
  GraduationCap,
  Award,
  TrendingUp,
  Gift,
  Shirt,
  Dumbbell,
  Smile,
  Lock,
  Bus,
  LayoutDashboard,
  BarChart3,
  Megaphone,
  CalendarDays,
  Settings,
  HelpCircle,
  FileCheck,
  UserCheck,
  ChevronRight,
  TrendingDown,
  Activity,
  ArrowUpRight,
  Bookmark,
  MessageSquare,
} from 'lucide-react';
import { formatEmploymentType, formatSchedule, formatWorkplaceType } from '@/lib/formatters';
import ApplicantStatusManager from './ApplicantStatusManager';
import EditBusinessModal from './EditBusinessModal';
import DashboardTour from './DashboardTour';
import ChatInterface from '@/app/messages/ChatInterface';
import PostJobForm from '@/app/post/job/PostJobForm';
import PostServiceForm from '@/app/post/service/PostServiceForm';
import QuickChatModal from './QuickChatModal';
import EmployeesView from '@/app/employer/employees/EmployeesView';

interface EmployerDashboardViewProps {
  user: any;
  initialBusiness: any;
  initialJobs: any[];
  categories?: any[];
  businesses?: any[];
  initialConversations?: any[];
}

const MASTER_BENEFITS = [
  { key: 'health', title: 'Health Insurance', text: 'Comprehensive medical, dental & vision coverage', icon: Heart, color: '#EF4444', bg: '#FEF2F2' },
  { key: 'pto', title: 'Paid Time Off', text: 'Paid vacation, personal days & national holidays', icon: Calendar, color: '#2563EB', bg: '#EFF6FF' },
  { key: 'schedule', title: 'Flexible Schedule', text: 'Adaptable work shifts, hybrid & work-life balance', icon: Clock, color: '#059669', bg: '#ECFDF5' },
  { key: '401k', title: 'Retirement Plan', text: 'Company-matched 401(k) retirement savings plan', icon: DollarSign, color: '#7C3AED', bg: '#F3E8FF' },
  { key: 'bonus', title: 'Performance Bonuses & Tips', text: 'Weekly/monthly bonuses, commission & cash tips', icon: Zap, color: '#D97706', bg: '#FEF3C7' },
  { key: 'leave', title: 'Paid Sick & Family Leave', text: 'Paid sick time & parental family leave support', icon: ShieldCheck, color: '#10B981', bg: '#E1FDF4' },
  { key: 'dental', title: 'Dental & Vision Coverage', text: '100% covered preventative dental care & vision exams', icon: HeartPulse, color: '#E11D48', bg: '#FFE4E6' },
  { key: 'meals', title: 'Free Meals, Coffee & Snacks', text: 'Free shift meals, espresso bar & workplace snacks', icon: Utensils, color: '#EA580C', bg: '#FFEDD5' },
  { key: 'vehicle', title: 'Company Vehicle / Gas Stipend', text: 'Company work truck/van or monthly gas reimbursement', icon: Car, color: '#4F46E5', bg: '#E0E7FF' },
  { key: 'tools', title: 'Tools & Work Gear Provided', text: 'All tools, power equipment & safety gear fully supplied', icon: Wrench, color: '#475569', bg: '#F1F5F9' },
  { key: 'training', title: 'Paid Training & Certifications', text: 'Paid training, CDL/OSHA licensing & certifications', icon: GraduationCap, color: '#0891B2', bg: '#CFFAFE' },
  { key: 'discounts', title: 'Employee Discounts', text: 'Exclusive discounts on store goods, food & services', icon: Sparkles, color: '#CA8A04', bg: '#FEF9C3' },
  { key: 'growth', title: 'Career Growth & Training', text: 'Fast-track promotions, mentorship & leadership growth', icon: Award, color: '#DB2777', bg: '#FCE7F3' },
  { key: 'overtime', title: 'Overtime Pay (1.5x Rate)', text: 'Ample overtime hours with 1.5x time-and-a-half rate', icon: TrendingUp, color: '#0D9488', bg: '#CCFBF1' },
  { key: 'signing', title: 'Signing Bonus Available', text: 'Immediate sign-on cash bonus upon completing 90 days', icon: Gift, color: '#9333EA', bg: '#F3E8FF' },
  { key: 'uniform', title: 'Uniforms & Safety Boots', text: 'Company uniforms, jackets, safety boots & laundry', icon: Shirt, color: '#64748B', bg: '#F8FAFC' },
  { key: 'gym', title: 'Gym Membership & Wellness', text: 'Free local gym membership & annual wellness stipend', icon: Dumbbell, color: '#16A34A', bg: '#DCFCE7' },
  { key: 'insurance', title: 'Life & Disability Insurance', text: 'Employer-paid life, short-term & long-term disability', icon: Lock, color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'childcare', title: 'Childcare & Family Support', text: 'Subsidized childcare assistance & flexible family scheduling', icon: Smile, color: '#F43F5E', bg: '#FFE4E6' },
  { key: 'transit', title: 'Commuter & Transit Pass', text: 'Pre-tax commuter pass, train stipend & parking subsidy', icon: Bus, color: '#0284C7', bg: '#E0F2FE' },
];

export default function EmployerDashboardView({
  user,
  initialBusiness,
  initialJobs,
  categories = [],
  businesses = [],
  initialConversations = [],
}: EmployerDashboardViewProps) {
  const [business, setBusiness] = useState(initialBusiness);
  const [jobs, setJobs] = useState(initialJobs);
  const [showTour, setShowTour] = useState(false);
  const [tourActive, setTourActive] = useState(false);

  const searchParams = useSearchParams();
  const tabFromUrl = searchParams ? searchParams.get('tab') : null;
  const userIdFromUrl = searchParams ? searchParams.get('userId') : null;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'postings' | 'candidates' | 'schedule' | 'employees' | 'messages' | 'campaigns' | 'featured' | 'analytics' | 'post_job' | 'post_service'>(
    (tabFromUrl as any) || 'dashboard'
  );

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollY > 120) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }
  }, [activeTab]);

  // Business Modal State
  const [isEditBusinessOpen, setIsEditBusinessOpen] = useState(false);
  const [quickChatTarget, setQuickChatTarget] = useState<any>(null);
  const [confirmedInterviews, setConfirmedInterviews] = useState<Record<string, boolean>>({});

  // Expanded Job Details State (default true for full view)
  const [expandedJobIds, setExpandedJobIds] = useState<Record<string, boolean>>({});

  const toggleExpandJob = (jobId: string) => {
    setExpandedJobIds((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const handleUpdateBusiness = (updated: any) => {
    setBusiness(updated);
  };

  const activeCandidatesCount = jobs.flatMap(j => j.applications || []).filter(a => a.status !== 'INTERVIEW' && a.status !== 'HIRED' && a.status !== 'REJECTED').length;
  const scheduledInterviewsCount = jobs.flatMap(j => j.applications || []).filter(a => a.status === 'INTERVIEW').length;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', backgroundColor: '#F8FAFC' }}>
      {showTour && (
        <DashboardTour
          businessId={initialBusiness?.id}
          onActiveChange={(active) => setTourActive(active)}
        />
      )}

      {/* LEFT NAVIGATION SIDEBAR (Matching our Brand Design System) */}
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
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'dashboard' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'dashboard' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
                boxShadow: activeTab === 'dashboard' ? '0 4px 12px rgba(14, 59, 70, 0.15)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'dashboard') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'dashboard') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <LayoutDashboard size={18} color={activeTab === 'dashboard' ? '#A7F3D0' : '#16845D'} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('dashboard');
                setTimeout(() => {
                  const elem = document.getElementById('tour-job-listings');
                  if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 50);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'postings' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'postings' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'postings') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'postings') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <Briefcase size={18} color={activeTab === 'postings' ? '#A7F3D0' : '#16845D'} />
              <span>Postings ({jobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('post_job')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'post_job' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'post_job' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'post_job') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'post_job') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <PlusCircle size={18} color={activeTab === 'post_job' ? '#A7F3D0' : '#16845D'} />
              <span>Post a New Job</span>
            </button>

            <button
              onClick={() => setActiveTab('post_service')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'post_service' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'post_service' ? '#FFFFFF' : '#141414',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
            >
              <Wrench size={18} color={activeTab === 'post_service' ? '#A7F3D0' : '#475569'} />
              <span>Post a Service</span>
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'candidates' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'candidates' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'candidates') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'candidates') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={18} color={activeTab === 'candidates' ? '#A7F3D0' : '#16845D'} />
                <span>Candidates</span>
              </div>
              {activeCandidatesCount > 0 && (
                <span style={{ backgroundColor: '#E05638', color: '#FFFFFF', fontSize: '0.725rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px' }}>
                  {activeCandidatesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'schedule' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'schedule' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'schedule') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'schedule') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CalendarDays size={18} color={activeTab === 'schedule' ? '#A7F3D0' : '#16845D'} />
                <span>Interview Schedule</span>
              </div>
              {scheduledInterviewsCount > 0 && (
                <span style={{ backgroundColor: '#E05638', color: '#FFFFFF', fontSize: '0.725rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px' }}>
                  {scheduledInterviewsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('employees')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'employees' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'employees' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'employees') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'employees') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <Users size={18} color={activeTab === 'employees' ? '#A7F3D0' : '#16845D'} />
              <span>Employees</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'campaigns' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'campaigns' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'campaigns') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'campaigns') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <Megaphone size={18} color={activeTab === 'campaigns' ? '#A7F3D0' : '#16845D'} />
              <span>Campaigns</span>
            </button>

            <button
              onClick={() => setActiveTab('featured')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'featured' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'featured' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'featured') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'featured') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <ShieldCheck size={18} color={activeTab === 'featured' ? '#A7F3D0' : '#16845D'} />
              <span>Featured Employer</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'messages' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'messages' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'messages') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'messages') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={18} color={activeTab === 'messages' ? '#A7F3D0' : '#16845D'} />
                <span>Messages</span>
              </div>
            </button>
          </div>

          <div style={{ borderTop: '1px solid #ECE7DF', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0E3B2E', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
              Management & Analytics
            </div>

            <button
              onClick={() => setIsEditBusinessOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                color: '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <Store size={18} color="#5D5851" />
              <span>Business Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: activeTab === 'analytics' ? '#0E3B2E' : 'transparent',
                color: activeTab === 'analytics' ? '#FFFFFF' : '#141414',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'analytics') {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.color = '#0E3B2E';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'analytics') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#141414';
                }
              }}
            >
              <BarChart3 size={18} color={activeTab === 'analytics' ? '#A7F3D0' : '#5D5851'} />
              <span>Reports & Analytics</span>
            </button>

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
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#0E3B2E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#141414'; }}
            >
              <ExternalLink size={18} color="#5D5851" />
              <span>View Public Portal</span>
            </Link>
          </div>
        </div>

        {/* User Account Info Footer */}
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0E3B2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {business?.name || 'My Business'}
            </div>
            <div style={{ fontSize: '0.775rem', color: '#5D5851', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
              {user?.email || 'employer@norwalk.com'}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: activeTab === 'messages' ? '1.5rem' : '2rem 2.5rem', width: '100%', minWidth: 0 }}>
        {activeTab === 'messages' ? (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '0.2rem' }}>
                  Business Inbox & Messages
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
                  Direct messages with local workers, applicants, and service pros in Norwalk, CT
                </p>
              </div>
            </div>
            {(() => {
              const activeConvForTargetUser = userIdFromUrl
                ? initialConversations.find(
                    (c: any) => c.participant1Id === userIdFromUrl || c.participant2Id === userIdFromUrl
                  )
                : null;
              const targetActiveId = activeConvForTargetUser?.id || initialConversations[0]?.id || null;
              return (
                <ChatInterface
                  currentUser={user}
                  initialConversations={initialConversations}
                  initialActiveId={targetActiveId}
                />
              );
            })()}
          </div>
        ) : activeTab === 'candidates' ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECE7DF', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            {/* Header & Stats Banner */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: '#F0FDF4', color: '#16845D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#0E3B2E' }}>
                      Candidates & Recruitment Management ({activeCandidatesCount})
                    </h2>
                    <span style={{ fontSize: '0.875rem', color: '#5D5851' }}>
                      Review, interview, take private notes, and hire applicants for your postings across Norwalk & Fairfield County
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('post_job')}
                  className="btn btn-primary btn-md"
                  style={{ borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <PlusCircle size={18} /> Post a New Job
                </button>
              </div>

              {/* Stat Counters Banner */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Total Applications</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0E3B2E', marginTop: '0.2rem' }}>{activeCandidatesCount}</div>
                </div>
                <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>Interviewing</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#B45309', marginTop: '0.2rem' }}>
                    {jobs.flatMap((j: any) => j.applications || []).filter((a: any) => a.status === 'INTERVIEW').length}
                  </div>
                </div>
                <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>Hired</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803D', marginTop: '0.2rem' }}>
                    {jobs.flatMap((j: any) => j.applications || []).filter((a: any) => a.status === 'HIRED').length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>Shortlisted</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0369A1', marginTop: '0.2rem' }}>
                    {jobs.flatMap((j: any) => j.applications || []).filter((a: any) => a.status === 'SHORTLISTED').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Candidates List View */}
            {jobs.flatMap((j: any) => (j.applications || []).filter((a: any) => a.status !== 'INTERVIEW' && a.status !== 'HIRED').map((app: any) => ({ ...app, jobTitle: j.title, jobCategory: j.category?.name }))).length === 0 ? (
              <div style={{ padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #CBD5E1' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F0FDF4', color: '#16845D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <Users size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>No pending candidate applications</h3>
                <p style={{ color: '#64748B', fontSize: '0.925rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
                  All candidates with scheduled interviews are in your <strong>Interview Schedule</strong> agenda, and hired employees are in <strong>Employees</strong>.
                </p>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="btn btn-primary btn-md"
                  style={{ borderRadius: '10px', fontWeight: 700 }}
                >
                  View Scheduled Interviews
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {jobs.map((job: any) => {
                  const pendingApps = (job.applications || []).filter((a: any) => a.status !== 'INTERVIEW' && a.status !== 'HIRED');
                  if (pendingApps.length === 0) return null;
                  return (
                    <div key={job.id} style={{ border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', backgroundColor: '#FAFAFA' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1.5px solid #E2E8F0', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16845D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            JOB POSITION
                          </div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '0.1rem' }}>
                            {job.title}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', backgroundColor: '#E2E8F0', padding: '4px 12px', borderRadius: '20px' }}>
                            {pendingApps.length} {pendingApps.length === 1 ? 'Candidate' : 'Candidates'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pendingApps.map((app: any) => (
                          <ApplicantStatusManager key={app.id} application={{ ...app, job }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'campaigns' ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECE7DF', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#16845D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0E3B2E' }}>Hiring Campaigns</h2>
                <span style={{ fontSize: '0.875rem', color: '#5D5851' }}>Promote your job listings across Norwalk & Fairfield County</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ border: '1.5px solid #A7F3D0', borderRadius: '16px', padding: '1.5rem', backgroundColor: '#F0FDF4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#0E3B2E', color: '#FFFFFF', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>Active Boost</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0E3B2E', marginTop: '0.75rem', marginBottom: '0.35rem' }}>Local Norwalk Spotlight</h3>
                <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem', lineHeight: '1.5' }}>Feature your listings at the top of local search results and email digests for 7 days.</p>
                <button type="button" className="btn btn-primary btn-md" style={{ borderRadius: '10px', width: '100%', fontWeight: 700 }}>Launch Local Campaign</button>
              </div>

              <div style={{ border: '1px solid #ECE7DF', borderRadius: '16px', padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>Urgent Hiring</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.75rem', marginBottom: '0.35rem' }}>Immediate Fill Blast</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1rem', lineHeight: '1.5' }}>Send instant push notifications to qualified applicants nearby looking for immediate work.</p>
                <button type="button" className="btn btn-outline btn-md" style={{ borderRadius: '10px', width: '100%', fontWeight: 700 }}>Create Urgent Blast</button>
              </div>
            </div>
          </div>
        ) : activeTab === 'featured' ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECE7DF', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Featured Employer Verification</h2>
                <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Build trust with job seekers and showcase your verified business badge</span>
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={20} /> Verified Business Badge Status: ACTIVE
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                Your business address <strong>{business?.location?.addressLine || 'Norwalk, CT'}</strong> and contact information have been verified by PostPlace. Candidates see your verified checkmark on all job posts.
              </p>
            </div>
          </div>
        ) : activeTab === 'post_job' ? (
          <div style={{ maxWidth: '850px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn btn-outline btn-sm"
              style={{ marginBottom: '1.25rem', borderRadius: '8px', fontWeight: 700 }}
            >
              ← Back to Dashboard
            </button>
            <PostJobForm
              user={user}
              categories={categories || []}
              businesses={businesses || (business ? [business] : [])}
              onCancel={() => setActiveTab('dashboard')}
            />
          </div>
        ) : activeTab === 'post_service' ? (
          <div style={{ maxWidth: '850px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn btn-outline btn-sm"
              style={{ marginBottom: '1.25rem', borderRadius: '8px', fontWeight: 700 }}
            >
              ← Back to Dashboard
            </button>
            <PostServiceForm
              user={user}
              categories={categories || []}
            />
          </div>
        ) : activeTab === 'employees' ? (
          <EmployeesView
            user={user}
            business={business}
            hiredApplications={jobs.flatMap((j: any) => (j.applications || []).filter((a: any) => a.status === 'HIRED'))}
            jobs={jobs}
          />
        ) : activeTab === 'schedule' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Interview Schedule & Agenda
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem', margin: 0 }}>
                  View upcoming interview appointments, set interview dates, and manage meetings with job applicants.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('candidates')}
                className="btn btn-primary"
                style={{ borderRadius: '10px', gap: '0.5rem', fontWeight: 700 }}
              >
                <Users size={16} /> Schedule with Candidate
              </button>
            </div>

            {/* Upcoming Interviews Summary Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.15rem', borderRadius: '14px', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>Scheduled Interviews</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#78350F', marginTop: '0.2rem' }}>
                  {jobs.flatMap(j => j.applications || []).filter(a => a.status === 'INTERVIEW').length}
                </div>
              </div>
              <div style={{ padding: '1.15rem', borderRadius: '14px', backgroundColor: '#E0F2FE', border: '1px solid #BAE6FD' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>Shortlisted Candidates</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#075985', marginTop: '0.2rem' }}>
                  {jobs.flatMap(j => j.applications || []).filter(a => a.status === 'SHORTLISTED').length}
                </div>
              </div>
              <div style={{ padding: '1.15rem', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>Hired Staff</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#14532D', marginTop: '0.2rem' }}>
                  {jobs.flatMap(j => j.applications || []).filter(a => a.status === 'HIRED').length}
                </div>
              </div>
            </div>

            {/* Scheduled Candidates List */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarDays size={20} color="#16845D" /> Upcoming Appointments & Interviews
              </h3>

              {jobs.flatMap(j => j.applications || []).filter(a => a.status === 'INTERVIEW' || a.status === 'SHORTLISTED').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                  <CalendarDays size={42} color="#CBD5E1" style={{ marginBottom: '0.75rem' }} />
                  <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, color: '#334155' }}>No interviews currently scheduled</p>
                  <p style={{ fontSize: '0.875rem', margin: '0.35rem 0 1rem 0' }}>Select a candidate from your Candidates list to schedule an interview appointment.</p>
                  <button
                    onClick={() => setActiveTab('candidates')}
                    className="btn btn-outline btn-sm"
                    style={{ borderRadius: '8px', fontWeight: 700 }}
                  >
                    View Candidate Applications
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {jobs
                    .flatMap((j: any) => (j.applications || []).map((a: any) => ({ ...a, jobTitle: j.title })))
                    .filter((a: any) => a.status === 'INTERVIEW')
                    .sort((a: any, b: any) => {
                      const dateA = a.interviewDate || a.statusUpdatedAt || '2099-01-01';
                      const dateB = b.interviewDate || b.statusUpdatedAt || '2099-01-01';
                      const timeA = a.interviewTime || '00:00';
                      const timeB = b.interviewTime || '00:00';
                      return `${dateA} ${timeA}`.localeCompare(`${dateB} ${timeB}`);
                    })
                    .map((a: any, idx: number) => {
                      const dateObj = a.interviewDate
                        ? new Date(a.interviewDate + 'T00:00:00')
                        : new Date(a.statusUpdatedAt || Date.now());
                      
                      const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                      const dayNum = dateObj.getDate();
                      const weekdayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const formattedDateFull = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                      
                      const rawTime = a.interviewTime || '10:00';
                      const [hh, mm] = rawTime.split(':');
                      const hourNum = parseInt(hh, 10);
                      const ampm = hourNum >= 12 ? 'PM' : 'AM';
                      const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
                      const formattedTime = `${formattedHour}:${mm || '00'} ${ampm}`;

                      const locFormat = a.interviewLocation || 'On-site / In Person';

                      return (
                        <div
                          key={a.id}
                          style={{
                            padding: '1.25rem 1.5rem',
                            borderRadius: '16px',
                            backgroundColor: '#FFFFFF',
                            border: idx === 0 ? '2px solid #16845D' : '1.5px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1.25rem',
                            boxShadow: idx === 0 ? '0 8px 24px rgba(22, 132, 93, 0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
                            position: 'relative',
                          }}
                        >
                          {/* Next Appointment Highlight Tag */}
                          {idx === 0 && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '-11px',
                                left: '24px',
                                backgroundColor: '#16845D',
                                color: '#FFFFFF',
                                fontSize: '0.675rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 6px rgba(22, 132, 93, 0.3)',
                              }}
                            >
                              ⏰ Next Earliest Appointment
                            </span>
                          )}

                          {/* Left: Date Box + Candidate Info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flex: 1, minWidth: '300px' }}>
                            {/* Chronological Date Badge Box */}
                            <div
                              style={{
                                width: 62,
                                height: 62,
                                borderRadius: '14px',
                                backgroundColor: idx === 0 ? '#0E3B2E' : '#F0FDF4',
                                color: idx === 0 ? '#FFFFFF' : '#0E3B2E',
                                border: '1.5px solid #A7F3D0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <span style={{ fontSize: '0.675rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.9 }}>
                                {weekdayStr}
                              </span>
                              <span style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1 }}>
                                {dayNum}
                              </span>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: idx === 0 ? '#A7F3D0' : '#16845D' }}>
                                {monthStr}
                              </span>
                            </div>

                            {/* Candidate Details */}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', margin: 0 }}>
                                  {a.applicant?.name || 'Candidate'}
                                </h4>
                                <span style={{ fontSize: '0.775rem', fontWeight: 800, color: '#16845D', backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                                  💼 {a.jobTitle}
                                </span>
                              </div>

                              {/* Time & Location Tags */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '3px 10px', borderRadius: '8px' }}>
                                  <Clock size={14} color="#D97706" />
                                  <span>{formattedTime}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', fontWeight: 700, color: '#334155', backgroundColor: '#F1F5F9', padding: '3px 10px', borderRadius: '8px' }}>
                                  {locFormat.includes('Phone') ? (
                                    <Phone size={14} color="#2563EB" />
                                  ) : locFormat.includes('Video') ? (
                                    <Sparkles size={14} color="#7C3AED" />
                                  ) : (
                                    <MapPin size={14} color="#E05638" />
                                  )}
                                  <span>{locFormat}</span>
                                </div>
                              </div>

                              <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.45rem' }}>
                                <span>📧 {a.applicant?.email}</span>
                                <span>•</span>
                                <span>📞 {a.applicant?.phone || '(203) 555-0188'}</span>
                                <span>•</span>
                                <span>📅 {formattedDateFull}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Action Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <button
                              type="button"
                              onClick={() => setQuickChatTarget({
                                recipient: {
                                  id: a.applicantId,
                                  name: a.applicant?.name || 'Candidate',
                                  email: a.applicant?.email,
                                  phone: a.applicant?.phone,
                                  avatarUrl: a.applicant?.avatarUrl,
                                  position: a.jobTitle || 'Applicant',
                                },
                                appId: a.id,
                              })}
                              className="btn btn-outline btn-md"
                              style={{ borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                            >
                              <MessageSquare size={16} /> Message Candidate
                            </button>

                            {confirmedInterviews[a.id] ? (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  backgroundColor: '#DCFCE7',
                                  color: '#15803D',
                                  border: '1.5px solid #86EFAC',
                                  padding: '0.5rem 0.85rem',
                                  borderRadius: '10px',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  boxShadow: '0 2px 8px rgba(21, 128, 61, 0.12)',
                                }}
                              >
                                <CheckCircle2 size={16} color="#15803D" />
                                <span>Interview Confirmed</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmedInterviews((prev) => ({ ...prev, [a.id]: true }));
                                }}
                                className="btn btn-primary btn-md"
                                style={{
                                  borderRadius: '10px',
                                  fontWeight: 700,
                                  backgroundColor: '#0E3B2E',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  cursor: 'pointer',
                                }}
                              >
                                <Check size={16} /> Confirm Shift
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECE7DF', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Reports & Performance Analytics</h2>
                <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Track views, candidate clicks, and hiring performance</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Active Listings</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>{jobs.length}</div>
              </div>
              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0E3B2E', textTransform: 'uppercase' }}>Total Applications</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0E3B2E', marginTop: '0.2rem' }}>{activeCandidatesCount}</div>
              </div>
              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>Listing Views</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginTop: '0.2rem' }}>
                  {jobs.reduce((acc, j) => acc + (j.viewsCount || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Page Title Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: 0 }}>
            Business Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>
              Manage your business profile, job listings, and candidate applications in Fairfield County, CT
            </p>
            <button
              onClick={() => {
                const key = initialBusiness?.id
                  ? `postplace_biz_dashboard_tour_v1_${initialBusiness.id}`
                  : 'postplace_biz_dashboard_tour_v1';
                localStorage.removeItem(key);
                setShowTour(false);
                setTimeout(() => setShowTour(true), 50);
              }}
              style={{
                background: 'none',
                border: '1.5px solid #E2E8F0',
                borderRadius: '8px',
                color: '#64748B',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              title="Replay the dashboard tour"
            >
              <Sparkles size={12} /> Tour
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setActiveTab('post_service')} className="btn btn-outline btn-lg" style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#16845d', color: '#16845d', backgroundColor: '#F0FDF4', fontWeight: 700 }}>
            <Wrench size={18} /> Post a Service
          </button>
          <button type="button" id="tour-post-job" onClick={() => setActiveTab('post_job')} className="btn btn-primary btn-lg" style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} /> Post a New Job
          </button>
        </div>
      </div>

      {/* Business Profile Hero Card */}
      {business ? (
        <div
          id="tour-business-card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '1.75rem',
            marginBottom: '2.25rem',
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
              {/* Storefront Photo / Logo */}
              <div
                style={{
                  width: 95,
                  height: 95,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#FFF4F1',
                  border: '2px solid #FFDDD5',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(224, 86, 56, 0.12)',
                }}
              >
                <img
                  src={business.logoUrl || '/images/empanada_bakery.png'}
                  alt={business.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Business Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {business.name}
                  </h2>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      color: '#2563EB',
                      fontWeight: 700,
                      backgroundColor: '#EFF6FF',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                    }}
                  >
                    <ShieldCheck size={14} color="#2563EB" />
                    Verified
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.85rem', lineHeight: '1.45' }}>
                  {business.description || `${business.name} operating in Norwalk & Fairfield County, CT.`}
                </p>

                {/* Metadata Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.1rem', fontSize: '0.825rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Tag size={15} color="#E05638" />
                    <span style={{ fontWeight: 700, color: '#1E293B' }}>{business.category || 'Local Business'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={15} color="#E05638" />
                    <span>
                      {business.location?.addressLine ? `${business.location.addressLine}, ` : ''}
                      {business.location?.neighborhood || 'South Norwalk (SoNo)'}, {business.location?.city?.name || 'Norwalk'}, CT
                    </span>
                  </div>

                  {business.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Phone size={15} color="#64748B" />
                      <span>{business.phone}</span>
                    </div>
                  )}

                  {business.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Mail size={15} color="#64748B" />
                      <span>{business.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minWidth: '200px' }}>
              <button
                id="tour-edit-business"
                type="button"
                onClick={() => setIsEditBusinessOpen(true)}
                className="btn btn-outline btn-md"
                style={{
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#FFF4F1',
                  borderColor: '#FFDDD5',
                  color: '#E05638',
                  fontWeight: 700,
                }}
              >
                <Pencil size={15} /> Editar Perfil de Negocio
              </button>

              <button type="button" onClick={() => setActiveTab('post_job')} className="btn btn-primary btn-md" style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <PlusCircle size={16} /> Post a New Job
              </button>

              <button type="button" onClick={() => setActiveTab('post_service')} className="btn btn-outline btn-md" style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', borderColor: '#16845d', color: '#16845d', backgroundColor: '#F0FDF4', fontWeight: 700 }}>
                <Wrench size={16} /> Post a Service
              </button>

              <Link href="/jobs" className="btn btn-outline btn-sm" style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <ExternalLink size={14} /> View Business Listings
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#FFF8F6',
            border: '2px dashed #E05638',
            borderRadius: '20px',
            padding: '1.75rem',
            marginBottom: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: '#FFE8E2', color: '#E05638', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>
                Setup Business Profile
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
                Add your storefront photo, address, and category to display your verified business card here.
              </p>
            </div>
          </div>
          <Link href="/register" className="btn btn-primary btn-md" style={{ borderRadius: '10px' }}>
            Setup Profile
          </Link>
        </div>
      )}

      {/* Posted Jobs Section Header */}
      <div id="tour-job-listings" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          Active Job Listings ({jobs.length})
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Review candidate applications and manage post details
        </span>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="empty-state" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3rem 2rem' }}>
          <div className="empty-state-icon" style={{ backgroundColor: '#FFF4F1', color: '#E05638' }}>
            <Briefcase size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
            No job postings created yet
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Post a job for <strong>{business?.name || 'your business'}</strong> to connect with qualified candidates in Norwalk & Fairfield County.
          </p>
          <Link href="/post/job" className="btn btn-primary btn-lg" style={{ borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} /> Post Your First Job
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {jobs.map((job) => {
            const isExpanded = expandedJobIds[job.id] ?? false; // Default collapsed on page load
            const logoImage = job.business?.logoUrl || business?.logoUrl || '/images/empanada_bakery.png';
            const companyName = job.business?.name || business?.name || 'Your Business';
            const addressString = job.location?.addressLine || business?.location?.addressLine || '440 Water St';
            const neighborhoodString = job.location?.neighborhood || business?.location?.neighborhood || 'South Norwalk (SoNo)';
            const cityName = job.location?.city?.name || business?.location?.city?.name || 'Norwalk';

            // Responsibilities lines
            const getParsedResponsibilities = (): string[] => {
              if (!job.responsibilities || !job.responsibilities.trim()) return [];
              return job.responsibilities
                .split(/\n+|•|\*|- (?=[A-Z0-9])|\d+\.\s+/)
                .map((line: string) => line.trim().replace(/^[-•*]\s*/, ''))
                .filter((line: string) => line.length > 2);
            };
            const respLines = getParsedResponsibilities();

            // Determine Benefits list formatted matching JobDetailView
            const getDisplayBenefits = () => {
              if (!job.benefits || !job.benefits.trim()) {
                return MASTER_BENEFITS.slice(0, 3);
              }
              const rawItems = job.benefits
                .split(',')
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0);

              return rawItems.map((raw: string) => {
                const found = MASTER_BENEFITS.find((m) =>
                  m.title.toLowerCase().includes(raw.toLowerCase()) || raw.toLowerCase().includes(m.title.toLowerCase())
                );
                if (found) return found;
                return {
                  key: raw,
                  title: raw,
                  text: 'Included with position',
                  icon: Sparkles,
                  color: '#CA8A04',
                  bg: '#FEF9C3',
                };
              });
            };
            const benefitsList = getDisplayBenefits();

            // Gallery photos
            let galleryPhotos: string[] = [];
            try {
              if (job.galleryImages) {
                const parsed = typeof job.galleryImages === 'string' ? JSON.parse(job.galleryImages) : job.galleryImages;
                if (Array.isArray(parsed)) galleryPhotos = parsed.filter(Boolean);
              }
            } catch (e) {}

            return (
              <div
                key={job.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                {/* Job Card Hero Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                    {/* Business Photo / Logo */}
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        backgroundColor: '#FFF4F1',
                        border: '2px solid #FFDDD5',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(224, 86, 56, 0.12)',
                      }}
                    >
                      <img
                        src={logoImage}
                        alt={job.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      {/* Job Title & Active Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {job.title}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            backgroundColor: job.status === 'active' ? '#ECFDF5' : job.status === 'paused' ? '#FEF3C7' : '#FEE2E2',
                            color: job.status === 'active' ? '#047857' : job.status === 'paused' ? '#B45309' : '#B91C1C',
                            border: `1px solid ${job.status === 'active' ? '#A7F3D0' : job.status === 'paused' ? '#FDE68A' : '#FCA5A5'}`,
                          }}
                        >
                          {job.status === 'active' ? 'Active' : job.status === 'paused' ? 'Paused' : 'Closed'}
                        </span>
                      </div>

                      {/* Sub-line: Company + Verified + Address */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: '#1E293B' }}>{companyName}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#2563EB', fontWeight: 700, backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                          <ShieldCheck size={14} color="#2563EB" /> Verified
                        </span>
                        <span>·</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#64748B' }}>
                          <MapPin size={14} color="#E05638" />
                          {addressString}, {neighborhoodString}, {cityName} CT
                        </span>
                        <span>·</span>
                        <span style={{ color: '#64748B' }}>
                          Posted {new Date(job.createdAt).toLocaleDateString()} · {job.viewsCount} views
                        </span>
                      </div>

                      {/* Badges / Pill Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
                          {formatEmploymentType(job.employmentType)}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
                          {formatSchedule(job.schedule)}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
                          {formatWorkplaceType(job.isRemote)}
                        </span>
                        {job.languages && (
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#FCE7F3', color: '#DB2777', padding: '0.3rem 0.75rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Languages size={13} /> {job.languages}
                          </span>
                        )}
                        {job.salaryMin && (
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
                            ${job.salaryMin}{job.salaryMax ? ` – $${job.salaryMax}` : ''}/{job.salaryType === 'hourly' ? 'hr' : 'yr'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      id={jobs.indexOf(job) === 0 ? 'tour-view-details' : undefined}
                      type="button"
                      onClick={() => toggleExpandJob(job.id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 700,
                        borderColor: '#CBD5E1',
                        color: '#334155',
                      }}
                    >
                      <FileText size={14} color="#E05638" />
                      <span>{isExpanded ? 'Ocultar Detalles' : 'Ver Detalles de Publicación'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <Link href={`/jobs/${job.id}`} className="btn btn-outline btn-sm" style={{ borderRadius: '8px', fontWeight: 700 }}>
                      View Live Page ↗
                    </Link>
                  </div>
                </div>

                {/* EXACT BEAUTIFUL JOB DETAIL SECTIONS MATCHING THE LIVE PAGE */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '1.75rem' }}>
                    {/* 1. JOB OVERVIEW */}
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>
                        Job Overview
                      </h3>
                      <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '0.975rem', margin: 0 }}>
                        {job.description || 'Sin descripción ingresada.'}
                      </p>

                      {job.requirements && (
                        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0F172A' }}>
                            Requirements & Qualifications
                          </h4>
                          <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '0.95rem', margin: 0 }}>
                            {job.requirements}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 2. JOB DETAILS / INFORMACIÓN DEL EMPLEO */}
                    <div style={{ paddingTop: '1.75rem', borderTop: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Job Details</h3>
                          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Key specifications, compensation & language preferences</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        {/* Pay / Salary */}
                        {job.salaryMin && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                              <DollarSign size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Pay & Salary</div>
                              <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                                ${job.salaryMin}{job.salaryMax ? ` – $${job.salaryMax}` : ''} / {job.salaryType === 'hourly' ? 'hour' : 'year'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Job Type */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                            <Briefcase size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Employment Type</div>
                            <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                              {formatEmploymentType(job.employmentType)}
                            </span>
                          </div>
                        </div>

                        {/* Schedule */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                            <Clock size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Schedule</div>
                            <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                              {formatSchedule(job.schedule)}
                            </span>
                          </div>
                        </div>

                        {/* Languages Accepted */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#FCE7F3', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                            <Languages size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Language Requirement</div>
                            <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                              {job.languages || 'English Required'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. JOB RESPONSIBILITIES SECTION */}
                    {respLines.length > 0 && (
                      <div style={{ paddingTop: '1.75rem', borderTop: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Job Responsibilities</h3>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Key tasks and daily expectations for this role</span>
                          </div>
                        </div>

                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0, listStyle: 'none' }}>
                          {respLines.map((task: string, idx: number) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                              <div
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  backgroundColor: '#ECFDF5',
                                  color: '#059669',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  marginTop: '0.15rem',
                                }}
                              >
                                <Check size={13} strokeWidth={3} />
                              </div>
                              <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', fontWeight: 500 }}>
                                {task}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 4. BENEFITS SECTION */}
                    {benefitsList.length > 0 && (
                      <div style={{ paddingTop: '1.75rem', borderTop: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Benefits</h3>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Perks and compensation advantages provided</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                          {benefitsList.map((benefit: any, idx: number) => {
                            const IconComponent = benefit.icon;
                            return (
                              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                                <div
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '10px',
                                    backgroundColor: benefit.bg,
                                    color: benefit.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: '0.1rem',
                                  }}
                                >
                                  <IconComponent size={18} />
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.15rem' }}>
                                    {benefit.title}
                                  </div>
                                  <div style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: '1.45' }}>
                                    {benefit.text}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 5. WORKPLACE GALLERY SECTION */}
                    {galleryPhotos.length > 0 && (
                      <div style={{ paddingTop: '1.75rem', borderTop: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                            <ImageIcon size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Workplace Gallery</h3>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Photos of the business environment</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          {galleryPhotos.map((url: string, idx: number) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Workplace photo ${idx + 1}`}
                              style={{
                                width: 140,
                                height: 95,
                                borderRadius: '12px',
                                objectFit: 'cover',
                                border: '1.5px solid #CBD5E1',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                  {/* Applicants Sub-Section */}
                  <div style={{ paddingTop: isExpanded ? '1.5rem' : '0', borderTop: isExpanded ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginBottom: '1rem' }}>
                      <Users size={18} color="#E05638" />
                      <span>Candidate Applications ({job.applications?.length || 0})</span>
                    </div>

                    {!job.applications || job.applications.length === 0 ? (
                      <p style={{ fontSize: '0.875rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>
                        No applications received yet for this listing.
                      </p>
                    ) : (
                      <div>
                        {job.applications.map((app: any) => (
                          <ApplicantStatusManager key={app.id} application={{ ...app, job }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Edit Business Profile Modal */}
      {business && (
        <EditBusinessModal
          business={business}
          isOpen={isEditBusinessOpen}
          onClose={() => setIsEditBusinessOpen(false)}
          onUpdate={handleUpdateBusiness}
        />
      )}
          </>
        )}

        {quickChatTarget && (
          <QuickChatModal
            isOpen={!!quickChatTarget}
            onClose={() => setQuickChatTarget(null)}
            recipient={quickChatTarget.recipient}
            applicationId={quickChatTarget.appId}
          />
        )}
      </main>
    </div>
  );
}
