'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, FileText, CheckCircle2, ShieldAlert, Plus, Trash2 } from 'lucide-react';

interface ProfileEditViewProps {
  user: any;
}

export default function ProfileEditView({ user }: ProfileEditViewProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [resumeUrl, setResumeUrl] = useState(user.resumeUrl || '');
  const [privacy, setPrivacy] = useState(user.privacy || 'PUBLIC');

  const [skills, setSkills] = useState<string[]>(
    user.skills?.length > 0 ? user.skills.map((s: any) => s.skillName) : ['Forklift Certified', 'Inventory']
  );
  const [newSkill, setNewSkill] = useState('');

  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          phone,
          avatarUrl,
          resumeUrl,
          privacy,
          skills,
          experienceTitle: expTitle || undefined,
          experienceCompany: expCompany || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      setSuccess(true);
      setExpTitle('');
      setExpCompany('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="search-box-wrapper" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem' }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E05638' }} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '2rem' }}>
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>{name}</h1>
          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
            {user.email} · Account Role: {user.role} ({user.activeRole} Mode)
          </span>
        </div>
      </div>

      {success && (
        <div style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Full Name
            </label>
            <input type="text" className="form-input" style={{ paddingLeft: '0.8rem' }} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Phone Number
            </label>
            <input type="tel" className="form-input" style={{ paddingLeft: '0.8rem' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
            Bio / Professional Summary
          </label>
          <textarea rows={4} className="form-input" style={{ paddingLeft: '0.8rem' }} placeholder="Tell local employers or clients about your experience..." value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Profile Photo URL
            </label>
            <input type="url" className="form-input" style={{ paddingLeft: '0.8rem' }} placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Resume Document URL
            </label>
            <input type="url" className="form-input" style={{ paddingLeft: '0.8rem' }} placeholder="https://..." value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} />
          </div>
        </div>

        {/* Skills Management */}
        <div style={{ backgroundColor: '#F8FAF9', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
            Skills & Qualifications
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
            {skills.map((s) => (
              <span key={s} className="tag-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>
                {s}
                <button type="button" onClick={() => handleRemoveSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '0.8rem', fontSize: '0.85rem' }}
              placeholder="Add skill (e.g. Plumbing, Bilingual, Customer Care)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button type="button" onClick={handleAddSkill} className="btn btn-outline btn-sm">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Add Work Experience */}
        <div style={{ backgroundColor: '#F8FAF9', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
            Add Experience Timeline Item
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <input type="text" className="form-input" style={{ paddingLeft: '0.8rem' }} placeholder="Job Title (e.g. Fulfillment Lead)" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} />
            <input type="text" className="form-input" style={{ paddingLeft: '0.8rem' }} placeholder="Company (e.g. Stamford Hub)" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
            Profile Privacy Controls
          </label>
          <select className="form-input" style={{ paddingLeft: '0.8rem' }} value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option value="PUBLIC">Public (Visible to all Norwalk employers and customers)</option>
            <option value="MEMBERS">Registered Members Only</option>
            <option value="PRIVATE">Private (Only visible when applying)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
