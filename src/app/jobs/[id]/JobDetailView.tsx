'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Building2,
  Clock,
  Bookmark,
  Flag,
  Send,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  Heart,
  Calendar,
  Sparkles,
  DollarSign,
  Award,
  Check,
  Image as ImageIcon,
  Briefcase,
  ExternalLink,
  Shield,
  Zap,
  Languages,
  HeartPulse,
  Utensils,
  Car,
  Wrench,
  GraduationCap,
  TrendingUp,
  Gift,
  Shirt,
  Dumbbell,
  Lock,
  Smile,
  Bus,
  Users,
} from 'lucide-react';
import JobApplyModal from './JobApplyModal';
import JobCard from '@/components/JobCard';
import SharePopover from '@/components/SharePopover';
import { formatEmploymentType, formatSchedule, formatWorkplaceType } from '@/lib/formatters';

interface JobDetailViewProps {
  job: any;
  user: any;
  existingApplication: any;
  isSaved: boolean;
  similarJobs: any[];
  appliedJobIds?: string[];
}

const CATEGORY_GALLERY_FALLBACKS: Record<string, string[]> = {
  Logistics: [
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
  ],
  Hospitality: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
  ],
  Healthcare: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  ],
  Retail: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
  ],
  Services: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  ],
  Trades: [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  ],
  Default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=800&q=80',
  ],
};

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

export default function JobDetailView({
  job,
  user,
  existingApplication,
  isSaved: initialSaved,
  similarJobs,
  appliedJobIds = [],
}: JobDetailViewProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [hasApplied, setHasApplied] = useState(!!existingApplication);
  const [applicationStatus, setApplicationStatus] = useState(existingApplication?.status || 'Submitted');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const toggleSave = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch('/api/saved/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();
      if (res.ok) setSaved(data.saved);
    } catch (e) {
      console.error(e);
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'job',
          targetId: job.id,
          reason: reportReason,
        }),
      });
      if (res.ok) {
        setReportSuccess(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const companyName = job.business?.name || 'Local Business';
  const categoryName = job.category?.name || job.business?.category || 'General';
  
  const street = job.location?.addressLine || job.business?.location?.addressLine;
  const neighborhood = job.location?.neighborhood || job.business?.location?.neighborhood;
  const cityName = job.location?.city?.name || job.business?.location?.city?.name || 'Norwalk';

  const locationText = street
    ? `${street}, ${neighborhood ? `${neighborhood}, ` : ''}${cityName} CT`
    : neighborhood
    ? `${neighborhood}, ${cityName} CT`
    : `${cityName}, CT`;

  // Determine photo gallery (max 3 photos)
  let photos: string[] = [];
  if (job.galleryImages) {
    try {
      const parsed = JSON.parse(job.galleryImages);
      if (Array.isArray(parsed) && parsed.length > 0) photos = parsed;
    } catch (e) {}
  }
  if (photos.length === 0 && job.business?.logoUrl) {
    photos.push(job.business.logoUrl);
  }
  if (photos.length < 3) {
    const categoryKey = Object.keys(CATEGORY_GALLERY_FALLBACKS).find((k) =>
      categoryName.toLowerCase().includes(k.toLowerCase())
    ) || 'Default';
    const fallbacks = CATEGORY_GALLERY_FALLBACKS[categoryKey] || CATEGORY_GALLERY_FALLBACKS.Default;
    for (const url of fallbacks) {
      if (photos.length < 3 && !photos.includes(url)) {
        photos.push(url);
      }
    }
  }
  photos = photos.slice(0, 3);

  // Parse Responsibilities into scannable bullet points
  const getParsedResponsibilities = (): string[] => {
    if (!job.responsibilities || !job.responsibilities.trim()) {
      return [
        'Perform core daily duties associated with the role maintaining high attention to detail.',
        'Collaborate effectively with teammates, shift supervisors, and clients.',
        'Follow workplace health, safety guidelines, and quality assurance procedures.',
        'Provide exceptional service and maintain proper organization of work areas.',
      ];
    }

    const items = job.responsibilities
      .split(/\n+|•|\*|- (?=[A-Z0-9])|\d+\.\s+/)
      .map((line: string) => line.trim().replace(/^[-•*]\s*/, ''))
      .filter((line: string) => line.length > 4);

    return items.length > 0 ? items : [job.responsibilities.trim()];
  };

  const responsibilitiesList = getParsedResponsibilities();

  // Determine Benefits list
  const getDisplayBenefits = () => {
    if (!job.benefits || !job.benefits.trim()) {
      return MASTER_BENEFITS.slice(0, 6);
    }
    const rawItems = job.benefits
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    return rawItems.map((raw: string) => {
      const found = MASTER_BENEFITS.find(
        (b) =>
          b.title.toLowerCase() === raw.toLowerCase() ||
          b.key.toLowerCase() === raw.toLowerCase() ||
          raw.toLowerCase().includes(b.title.toLowerCase()) ||
          b.title.toLowerCase().includes(raw.toLowerCase())
      );
      if (found) {
        return found;
      }
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

  return (
    <main className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/jobs" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E05638' }}>
          ← Back to All Jobs in Norwalk
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Left Column: Main Job Info & Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Main Job Card Header */}
          <div className="search-box-wrapper">
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div className="company-logo-box" style={{ width: 64, height: 64 }}>
                {job.business?.logoUrl ? (
                  <img src={job.business.logoUrl} alt={companyName} />
                ) : (
                  <Building2 size={32} color="#64748B" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.75rem', lineHeight: '1.2', marginBottom: '0.3rem' }}>{job.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>
                  <span>{companyName}</span>
                  {job.business?.isVerified && (
                    <span title="Verified Business">
                      <ShieldCheck size={18} color="#2563EB" />
                    </span>
                  )}
                  <span>·</span>
                  <MapPin size={16} color="#E05638" />
                  <span>{locationText}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
                  {job.salaryMin && (
                    <span className="salary-tag" style={{ fontSize: '1rem', padding: '0.3rem 0.8rem' }}>
                      ${job.salaryMin}
                      {job.salaryMax ? `–$${job.salaryMax}` : ''}/{job.salaryType === 'hourly' ? 'hr' : 'yr'}
                    </span>
                  )}
                  <span className="tag-badge" style={{ fontSize: '0.85rem' }}>{formatEmploymentType(job.employmentType)}</span>
                  <span className="tag-badge" style={{ fontSize: '0.85rem' }}>{formatSchedule(job.schedule)}</span>
                  <span className="tag-badge" style={{ fontSize: '0.85rem' }}>{formatWorkplaceType(job.isRemote)}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            {(() => {
              const isOwner = user && (job.postedById === user.id || (job.business && job.business.ownerId === user.id));
              const applicantCount = job.applications?.length || 0;

              if (isOwner) {
                return (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', alignItems: 'center' }}>
                    <Link
                      href="/employer/dashboard"
                      className="btn btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#059669',
                        borderColor: '#059669',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        textDecoration: 'none',
                      }}
                    >
                      <Users size={18} />
                      <span>View Applicants ({applicantCount})</span>
                    </Link>

                    <Link
                      href="/employer/dashboard"
                      className="btn btn-outline"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        padding: '0.65rem 1.1rem',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: '#334155',
                      }}
                    >
                      <Building2 size={18} />
                      <span>Business Dashboard</span>
                    </Link>

                    <SharePopover
                      title={`${job.title} - ${companyName}`}
                      buttonClassName="btn btn-outline"
                    />
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                  {hasApplied ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #6EE7B7',
                          color: '#047857',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          padding: '0.65rem 1.25rem',
                          borderRadius: '10px',
                        }}
                      >
                        <CheckCircle2 size={20} color="#059669" />
                        <span>Application Submitted</span>
                      </div>
                      <Link
                        href="/applications"
                        className="btn btn-outline"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          padding: '0.65rem 1.1rem',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          color: '#334155',
                        }}
                      >
                        <span>Track Status →</span>
                      </Link>
                    </div>
                  ) : user?.role === 'EMPLOYER' ? (
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: '#FFF4F1',
                        border: '1px solid #FFDDD5',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.85rem',
                        color: '#E05638',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Building2 size={18} />
                      <span>Business accounts cannot apply to job listings.</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => (user ? setShowApplyModal(true) : (window.location.href = '/login'))}
                      className="btn btn-primary btn-lg"
                      style={{ flex: 1 }}
                    >
                      <Send size={18} />
                      <span>Apply Now</span>
                    </button>
                  )}

                  <button onClick={toggleSave} className="btn btn-outline btn-lg" style={{ gap: '0.4rem' }}>
                    <Bookmark size={18} fill={saved ? '#E05638' : 'none'} color={saved ? '#E05638' : 'currentColor'} />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>

                  <SharePopover
                    title={`${job.title} - ${companyName}`}
                    buttonClassName="btn btn-outline btn-lg"
                  />

                  <button
                    onClick={() => setShowReportModal(true)}
                    className="btn btn-outline"
                    style={{ padding: '0.65rem', color: '#64748B' }}
                    title="Report Listing"
                  >
                    <Flag size={18} />
                  </button>
                </div>
              );
            })()}
          </div>

          {/* UNIFIED SINGLE CARD CONTAINING ALL JOB SECTIONS */}
          <div className="search-box-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
            {/* 1. JOB OVERVIEW */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>Job Overview</h3>
              <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>{job.description}</p>

              {job.requirements && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0F172A' }}>
                    Requirements & Qualifications
                  </h4>
                  <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                    {job.requirements}
                  </p>
                </div>
              )}
            </div>



            {/* 2. JOB DETAILS / INFORMACIÓN DEL EMPLEO */}
            <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Job Details</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Key specifications, compensation & language preferences</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
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
            <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
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
                {responsibilitiesList.map((task, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}
                  >
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

            {/* 4. BENEFITS SECTION */}
            <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
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
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                      }}
                    >
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

            {/* 5. SMALL PHOTO GALLERY (CAROUSEL / SLIDER) */}
            <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Workplace Gallery</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Photos of the business environment</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>
                  {activePhotoIndex + 1} of {photos.length} photos
                </span>
              </div>

              {/* Compact Photo Display Card */}
              <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#0F172A' }}>
                <img
                  src={photos[activePhotoIndex]}
                  alt={`Workplace photo ${activePhotoIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />

                {/* Prev/Next Overlay Buttons if > 1 photo */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        color: '#0F172A',
                        transition: 'transform 0.15s ease',
                      }}
                      title="Previous Photo"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={() => setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        color: '#0F172A',
                        transition: 'transform 0.15s ease',
                      }}
                      title="Next Photo"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Counter Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px',
                  }}
                >
                  {activePhotoIndex + 1} / {photos.length}
                </div>
              </div>

              {/* Horizontal Thumbnails (Max 3) */}
              {photos.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-start' }}>
                  {photos.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      style={{
                        padding: 0,
                        border: idx === activePhotoIndex ? '2px solid #E05638' : '2px solid transparent',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        width: '80px',
                        height: '54px',
                        backgroundColor: '#E2E8F0',
                        transition: 'all 0.2s ease',
                        opacity: idx === activePhotoIndex ? 1 : 0.65,
                      }}
                    >
                      <img src={photoUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Company & Sidebar Info */}
        <div>
          <div className="filter-box" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>About the Employer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <div className="company-logo-box">
                {job.business?.logoUrl ? <img src={job.business.logoUrl} alt={companyName} /> : <Building2 size={24} color="#64748B" />}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{companyName}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{job.business?.category || 'Local Business'}</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', lineHeight: '1.5' }}>
              {job.business?.description || 'Registered business active on PostPlace CT.'}
            </p>
            {job.business?.website && (
              <a
                href={job.business.website}
                target="_blank"
                rel="noreferrer"
                className="see-all-link"
                style={{ fontSize: '0.85rem' }}
              >
                Visit Official Website →
              </a>
            )}
          </div>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Similar Jobs in Norwalk</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {similarJobs.map((sj) => (
                  <JobCard key={sj.id} job={sj} isApplied={appliedJobIds.includes(sj.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <JobApplyModal
          job={job}
          user={user}
          onClose={() => setShowApplyModal(false)}
          onSuccess={(appData) => {
            setHasApplied(true);
            if (appData?.status) {
              setApplicationStatus(appData.status);
            }
            router.refresh();
          }}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Job Listing</h3>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            {reportSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
                <p>Thank you. Our admin team will review this listing.</p>
              </div>
            ) : (
              <form onSubmit={submitReport}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Reason for reporting
                </label>
                <select className="form-input" value={reportReason} onChange={(e) => setReportReason(e.target.value)} required>
                  <option value="">Select a reason</option>
                  <option value="spam">Spam or misleading information</option>
                  <option value="scam">Scam or suspicious contact</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="expired">Job is closed or expired</option>
                </select>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
