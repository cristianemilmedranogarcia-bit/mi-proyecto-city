'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  UserCheck,
  Ban,
  Eye,
  Inbox
} from 'lucide-react';

import QuickChatModal from './QuickChatModal';

interface ApplicantStatusManagerProps {
  application: any;
}

const STATUS_OPTIONS = [
  { value: 'APPLIED', label: 'Applied (New)', icon: Inbox, color: '#16845D', bg: '#F0FDF4' },
  { value: 'VIEWED', label: 'Under Review', icon: Eye, color: '#475569', bg: '#F1F5F9' },
  { value: 'SHORTLISTED', label: 'Shortlisted', icon: Star, color: '#0369A1', bg: '#E0F2FE' },
  { value: 'INTERVIEW', label: 'Interview Scheduled', icon: Calendar, color: '#B45309', bg: '#FEF3C7' },
  { value: 'HIRED', label: 'HIRED', icon: CheckCircle2, color: '#15803D', bg: '#DCFCE7' },
  { value: 'REJECTED', label: 'Rejected', icon: XCircle, color: '#B91C1C', bg: '#FEE2E2' },
];

export default function ApplicantStatusManager({ application: initialApp }: ApplicantStatusManagerProps) {
  const [app, setApp] = useState(initialApp);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(app.notes || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [interviewDate, setInterviewDate] = useState(() => new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [interviewTime, setInterviewTime] = useState('10:00');
  const [interviewLocation, setInterviewLocation] = useState('On-site / In Person');
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0); // 0 = Current month (Sept 2026), 1 = Oct 2026, etc.
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Helper to generate accurate calendar days for selected month
  const getMonthDays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth() + selectedMonthOffset;
    
    // Target Date object for year and month
    const targetDate = new Date(currentYear, currentMonthIndex, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    
    // Number of days in target month (JavaScript handles leap years and days accurately)
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    
    const days = [];
    // If current month, start from tomorrow; otherwise start from day 1
    const startDay = selectedMonthOffset === 0 ? today.getDate() + 1 : 1;

    for (let day = startDay; day <= daysInMonth; day++) {
      const d = new Date(targetYear, targetMonth, day);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ iso, dayName, monthDay, fullDate: d });
    }
    return days;
  };

  const monthDaysList = getMonthDays();

  const applicant = app.applicant || {};
  const applicantName = applicant.name || applicant.email?.split('@')[0] || 'Applicant';
  
  // Compute two-letter initials (e.g. "Brandon Miller" -> "BM")
  const nameParts = applicantName.trim().split(/\s+/);
  const avatarInitials = nameParts.length >= 2
    ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
    : applicantName.substring(0, 2).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateStatus = async (newStatus: string, interviewDetails?: { date: string; time: string; location: string }) => {
    setLoading(true);
    setIsDropdownOpen(false);
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: app.id,
          status: newStatus,
          interviewDate: interviewDetails?.date,
          interviewTime: interviewDetails?.time,
          interviewLocation: interviewDetails?.location,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setApp((prev: any) => ({
          ...prev,
          ...data.application,
          interviewDate: interviewDetails?.date || prev.interviewDate,
          interviewTime: interviewDetails?.time || prev.interviewTime,
          interviewLocation: interviewDetails?.location || prev.interviewLocation,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentOption = STATUS_OPTIONS.find((opt) => opt.value === app.status) || STATUS_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        transition: 'all 0.2s ease-in-out',
        marginBottom: '1.25rem',
        position: 'relative',
        fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
      }}
    >
      {/* COMPACT & MODERN ATS CANDIDATE ROW */}
      <div
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Left: Avatar + Candidate Name + Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 260 }}>
          {applicant.avatarUrl ? (
            <img
              src={applicant.avatarUrl}
              alt={applicantName}
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                border: '2px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            />
          ) : (
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#0E3B2E',
                border: '1.5px solid #A7F3D0',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
              }}
            >
              {avatarInitials}
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {applicantName}
              </h3>
              {(app.job?.title || initialApp.job?.title) && (
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    backgroundColor: '#F8FAFC',
                    color: '#64748B',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Briefcase size={11} color="#64748B" /> {app.job?.title || initialApp.job?.title}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.825rem', color: '#64748B', marginTop: '0.25rem' }}>
              <a href={`mailto:${applicant.email || ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#475569', textDecoration: 'none' }}>
                <Mail size={13} color="#94A3B8" /> {applicant.email || 'No email'}
              </a>
              <a href={`tel:${applicant.phone || ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#475569', textDecoration: 'none' }}>
                <Phone size={13} color="#94A3B8" /> {applicant.phone || '(203) 555-0122'}
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94A3B8' }}>
                <Calendar size={13} /> {new Date(app.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Single Clean Status Badge & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Single Read-only Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: currentOption.bg,
              color: currentOption.color,
              padding: '0.35rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.775rem',
              fontWeight: 800,
              border: `1px solid ${currentOption.color}30`,
            }}
          >
            <CurrentIcon size={14} color={currentOption.color} />
            <span>{currentOption.label}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextExpanded = !isExpanded;
              setIsExpanded(nextExpanded);
              if (nextExpanded && app.status === 'APPLIED') {
                updateStatus('VIEWED');
              }
            }}
            style={{
              backgroundColor: isExpanded ? '#0E3B2E' : '#16845D',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: '9px',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 8px rgba(22, 132, 93, 0.2)',
            }}
          >
            <Eye size={15} />
            <span>{isExpanded ? 'Close' : 'View Application'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="button"
            onClick={() => setShowQuickChat(true)}
            style={{
              backgroundColor: '#F8FAFC',
              color: '#334155',
              border: '1px solid #CBD5E1',
              padding: '0.45rem 0.75rem',
              borderRadius: '9px',
              fontSize: '0.825rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={14} color="#64748B" /> Message
          </button>

          {app.resumeUrl && (
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: '#F8FAFC',
                color: '#334155',
                border: '1px solid #CBD5E1',
                padding: '0.45rem 0.75rem',
                borderRadius: '9px',
                fontSize: '0.825rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Download size={14} color="#64748B" /> Resume
            </a>
          )}
        </div>
      </div>

      {/* EXPANDED CANDIDATE DOSSIER */}
      {isExpanded && (
        <div style={{ backgroundColor: '#F8FAFC', borderTop: '1.5px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
          {/* Contact & Notes Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Contact Details */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={16} color="#16845D" /> Contact Information
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F1F5F9', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#64748B' }}>Full Name:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{applicantName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F1F5F9', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#64748B' }}>Email:</span>
                  <a href={`mailto:${applicant.email}`} style={{ fontWeight: 700, color: '#16845D', textDecoration: 'none' }}>{applicant.email || 'N/A'}</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F1F5F9', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#64748B' }}>Phone:</span>
                  <a href={`tel:${applicant.phone}`} style={{ fontWeight: 700, color: '#16845D', textDecoration: 'none' }}>{applicant.phone || 'Not provided'}</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Application Status:</span>
                  <span style={{ fontWeight: 800, color: currentOption.color }}>{currentOption.label}</span>
                </div>
              </div>
            </div>

            {/* Internal Employer Notes */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#16845D" /> Internal Interview Notes
              </div>
              <textarea
                rows={3}
                placeholder="Write private notes regarding interview feedback, salary expectations, shift availability..."
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#16845D', fontWeight: 600 }}>
                  {notesSaved ? '✓ Notes saved' : 'Only visible to your hiring team'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNotesSaved(true);
                    setTimeout(() => setNotesSaved(false), 2500);
                  }}
                  style={{
                    backgroundColor: '#0E3B2E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          {/* Hiring Management Actions */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
              Hiring Pipeline Actions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => updateStatus('HIRED')}
                disabled={loading || app.status === 'HIRED'}
                style={{
                  backgroundColor: app.status === 'HIRED' ? '#DCFCE7' : '#0E3B2E',
                  color: app.status === 'HIRED' ? '#15803D' : '#FFFFFF',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: app.status === 'HIRED' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: app.status === 'HIRED' ? 'none' : '0 2px 8px rgba(14,59,46,0.25)',
                }}
              >
                <UserCheck size={16} />
                <span>{app.status === 'HIRED' ? 'Hired' : 'Hire Candidate'}</span>
              </button>

              <button
                type="button"
                onClick={() => updateStatus('SHORTLISTED')}
                style={{
                  backgroundColor: app.status === 'SHORTLISTED' ? '#E0F2FE' : '#F8FAFC',
                  color: app.status === 'SHORTLISTED' ? '#0369A1' : '#334155',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Star size={15} color="#0369A1" /> Shortlist Candidate
              </button>

              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                style={{
                  backgroundColor: app.status === 'INTERVIEW' ? '#FEF3C7' : '#F8FAFC',
                  color: app.status === 'INTERVIEW' ? '#B45309' : '#334155',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Calendar size={15} color="#B45309" /> {app.status === 'INTERVIEW' ? '🗓️ Change Interview Date' : 'Schedule Interview'}
              </button>

              <button
                type="button"
                onClick={() => updateStatus('VIEWED')}
                style={{
                  backgroundColor: app.status === 'VIEWED' ? '#F1F5F9' : '#F8FAFC',
                  color: app.status === 'VIEWED' ? '#475569' : '#334155',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Eye size={15} color="#475569" /> Under Review
              </button>

              <button
                type="button"
                onClick={() => updateStatus('REJECTED')}
                style={{
                  backgroundColor: app.status === 'REJECTED' ? '#FEE2E2' : '#F8FAFC',
                  color: app.status === 'REJECTED' ? '#B91C1C' : '#64748B',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Ban size={15} color="#B91C1C" /> Reject Candidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Schedule Interview</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Book appointment date & time for {applicantName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStatus('INTERVIEW', {
                  date: interviewDate,
                  time: interviewTime,
                  location: interviewLocation,
                });
                setShowScheduleModal(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                      Select Interview Date *
                    </label>

                    {/* Custom Branded Month Selector Dropdown */}
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: '#0E3B2E',
                          backgroundColor: '#F0FDF4',
                          border: '1.5px solid #A7F3D0',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 2px 6px rgba(14, 59, 70, 0.06)',
                        }}
                      >
                        <span>
                          {new Date(new Date().setMonth(new Date().getMonth() + selectedMonthOffset)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <ChevronDown size={14} color="#16845D" />
                      </button>

                      {isMonthDropdownOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '115%',
                            left: 0,
                            zIndex: 100,
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #E2E8F0',
                            borderRadius: '14px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                            padding: '0.4rem',
                            minWidth: '170px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.2rem',
                          }}
                        >
                          {Array.from({ length: 6 }).map((_, idx) => {
                            const d = new Date();
                            d.setMonth(d.getMonth() + idx);
                            const monthName = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                            const isSelected = selectedMonthOffset === idx;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedMonthOffset(idx);
                                  setIsMonthDropdownOpen(false);
                                  const today = new Date();
                                  const targetMonthDate = new Date(today.getFullYear(), today.getMonth() + idx, idx === 0 ? today.getDate() + 1 : 1);
                                  const isoStr = `${targetMonthDate.getFullYear()}-${String(targetMonthDate.getMonth() + 1).padStart(2, '0')}-${String(targetMonthDate.getDate()).padStart(2, '0')}`;
                                  setInterviewDate(isoStr);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.55rem 0.75rem',
                                  fontSize: '0.825rem',
                                  fontWeight: isSelected ? 800 : 600,
                                  color: isSelected ? '#0E3B2E' : '#334155',
                                  backgroundColor: isSelected ? '#F0FDF4' : 'transparent',
                                  borderRadius: '8px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%',
                                  fontFamily: 'inherit',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }
                                }}
                              >
                                <span>{monthName}</span>
                                {isSelected && <Check size={14} color="#16845D" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Carousel Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const container = document.getElementById('date-carousel-container');
                        if (container) container.scrollBy({ left: -220, behavior: 'smooth' });
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1.5px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0E3B2E'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#475569'; }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const container = document.getElementById('date-carousel-container');
                        if (container) container.scrollBy({ left: 220, behavior: 'smooth' });
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1.5px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0E3B2E'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#475569'; }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrolling Date Carousel */}
                <div
                  id="date-carousel-container"
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    paddingBottom: '0.5rem',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {monthDaysList.map((item) => {
                    const isSelected = interviewDate === item.iso;

                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setInterviewDate(item.iso)}
                        style={{
                          minWidth: '85px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '0.75rem 0.5rem',
                          borderRadius: '14px',
                          border: isSelected ? '2px solid #16845D' : '1.5px solid #E2E8F0',
                          backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                          color: isSelected ? '#0E3B2E' : '#334155',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 4px 12px rgba(22, 132, 93, 0.18)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: isSelected ? '#16845D' : '#64748B' }}>
                          {item.dayName}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '3px' }}>
                          {item.monthDay}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Interview Time *
                  </label>
                  <input
                    type="time"
                    className="form-input"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Format / Location
                  </label>
                  <select
                    className="form-input"
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                  >
                    <option value="On-site / In Person">On-site / In Person</option>
                    <option value="Phone Call Interview">Phone Call Interview</option>
                    <option value="Video Call (Google Meet / Zoom)">Video Call (Google Meet / Zoom)</option>
                  </select>
                </div>
              </div>

              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.825rem', color: '#78350F', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="#B45309" />
                <span>
                  Candidate will receive an email & in-app confirmation for{' '}
                  <strong>
                    {interviewDate
                      ? new Date(interviewDate + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : interviewDate}{' '}
                    at {interviewTime}
                  </strong>
                  .
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn btn-outline btn-lg"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ flex: 2, backgroundColor: '#0E3B2E' }}
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <QuickChatModal
        isOpen={showQuickChat}
        onClose={() => setShowQuickChat(false)}
        recipient={{
          id: app.applicantId,
          name: app.applicant?.name || 'Applicant',
          email: app.applicant?.email,
          phone: app.applicant?.phone,
          position: app.job?.title || 'Candidate',
          avatarUrl: app.applicant?.avatarUrl,
        }}
        applicationId={app.id}
      />
    </div>
  );
}
