'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, FileText, Send } from 'lucide-react';

interface JobApplyModalProps {
  job: any;
  user: any;
  onClose: () => void;
  onSuccess?: (appData?: any) => void;
}

export default function JobApplyModal({ job, user, onClose, onSuccess }: JobApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          coverLetter,
          resumeUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }
      setSuccess(true);
      if (onSuccess) {
        onSuccess(data.jobApplication || data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Apply for {job.title}</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              {job.business?.name || 'Local Employer'} · Norwalk, CT
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Application Submitted!</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              The employer has received your profile and application. Track its status in your Applications dashboard.
            </p>
            <button onClick={onClose} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {error && (
              <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Profile Confirm */}
            <div style={{ backgroundColor: '#F8FAF9', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                1. Confirm Applicant Profile
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{user?.email} · {user?.phone || 'No phone provided'}</div>
            </div>

            {/* Resume Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                2. Resume Link / File URL
              </label>
              <div className="input-icon-group">
                <FileText size={18} />
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/my-resume.pdf"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem', display: 'block' }}>
                Link to your online resume or portfolio PDF.
              </span>
            </div>

            {/* Optional Cover Note */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                3. Message to Employer (Optional)
              </label>
              <textarea
                rows={4}
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                placeholder="Introduce yourself, mention relevant experience or immediate start availability..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }} disabled={submitting}>
                <Send size={18} />
                <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
