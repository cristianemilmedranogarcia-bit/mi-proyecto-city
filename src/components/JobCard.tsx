'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Bookmark, Building2, Send, CheckCircle2 } from 'lucide-react';

import SharePopover from '@/components/SharePopover';
import { formatEmploymentType, formatSchedule, formatWorkplaceType } from '@/lib/formatters';

interface JobCardProps {
  job: any;
  isSaved?: boolean;
  isApplied?: boolean;
  userRole?: string;
}

export default function JobCard({ job, isSaved: initialSaved = false, isApplied = false, userRole: initialUserRole }: JobCardProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [userRole, setUserRole] = useState<string | null>(initialUserRole || null);

  React.useEffect(() => {
    if (!initialUserRole) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.role) setUserRole(data.user.role);
        })
        .catch(() => {});
    }
  }, [initialUserRole]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch('/api/saved/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(data.saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const companyName = job.business?.name || 'Local Employer';

  const street = job.location?.addressLine || job.business?.location?.addressLine;
  const neighborhood = job.location?.neighborhood || job.business?.location?.neighborhood;
  const cityName = job.location?.city?.name || job.business?.location?.city?.name || 'Norwalk';

  const locationText = street
    ? `${street}, ${neighborhood ? `${neighborhood}, ` : ''}${cityName} CT`
    : neighborhood
    ? `${neighborhood}, ${cityName} CT`
    : `${cityName}, CT`;

  return (
    <Link href={`/jobs/${job.id}`} className="job-card">
      <div>
        <div className="job-card-header">
          <div className="company-logo-box">
            {job.business?.logoUrl ? (
              <img src={job.business.logoUrl} alt={companyName} />
            ) : (
              <Building2 size={24} color="#64748B" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="job-title">{job.title}</h3>
            <div className="job-company">{companyName}</div>
          </div>
        </div>

        <div className="job-meta-row">
          <div className="job-meta-item">
            <MapPin size={15} color="#E05638" />
            <span>{locationText}</span>
          </div>
          {job.salaryMin && (
            <div className="salary-tag">
              ${job.salaryMin}
              {job.salaryMax ? `–$${job.salaryMax}` : ''}/{job.salaryType === 'hourly' ? 'hr' : 'yr'}
            </div>
          )}
        </div>

        <div className="job-tags">
          <span className="tag-badge">{formatEmploymentType(job.employmentType)}</span>
          <span className="tag-badge">{formatSchedule(job.schedule)}</span>
          <span className="tag-badge">{formatWorkplaceType(job.isRemote)}</span>
        </div>
      </div>

      <div className="job-card-footer">
        <div className="posted-time" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Clock size={13} />
          <span>Recently posted</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isApplied ? (
            <span
              className="btn-apply-card"
              style={{
                backgroundColor: '#ECFDF5',
                color: '#047857',
                border: '1px solid #A7F3D0',
                fontWeight: 700,
                gap: '0.3rem',
              }}
            >
              <CheckCircle2 size={13} color="#059669" />
              <span>Applied</span>
            </span>
          ) : userRole === 'EMPLOYER' ? (
            <span
              className="btn-apply-card"
              style={{
                backgroundColor: '#F8FAF9',
                color: '#64748B',
                border: '1px solid #E2E8F0',
                fontWeight: 600,
                cursor: 'default',
                gap: '0.3rem',
              }}
            >
              <Building2 size={13} />
              <span>Business</span>
            </span>
          ) : (
            <span className="btn-apply-card">
              <span>Apply</span>
              <Send size={12} />
            </span>
          )}
          <button
            onClick={toggleSave}
            className={`save-btn ${saved ? 'saved' : ''}`}
            title={saved ? 'Remove from Saved' : 'Save Job'}
          >
            <Bookmark size={18} fill={saved ? '#E05638' : 'none'} />
          </button>
          <SharePopover title={`${job.title} - ${companyName}`} url={`/jobs/${job.id}`} />
        </div>
      </div>
    </Link>
  );
}
