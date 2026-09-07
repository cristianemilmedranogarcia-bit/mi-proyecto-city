'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Send, ShieldAlert } from 'lucide-react';

interface PostServiceFormProps {
  user: any;
  categories: any[];
}

export default function PostServiceForm({ user, categories }: PostServiceFormProps) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState('starting_at');
  const [priceAmount, setPriceAmount] = useState('');
  const [serviceAreaRadius, setServiceAreaRadius] = useState('10');
  const [experienceYears, setExperienceYears] = useState('2');
  const [availability, setAvailability] = useState('Mon - Sat: 8:00 AM - 6:00 PM');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const portfolioImages = portfolioUrl ? [portfolioUrl] : [];
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          categoryId,
          description,
          pricingType,
          priceAmount,
          serviceAreaRadius,
          experienceYears,
          availability,
          portfolioImages,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create service');
      }
      router.push(`/services/${data.service.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="search-box-wrapper" style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
          <Wrench size={24} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.3rem' }}>Offer a Service in Norwalk, CT</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Create a professional service profile to receive quote requests</p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
            Service Listing Title *
          </label>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '1rem' }}
            placeholder="e.g. Carlos General Handyman & Home Repair, Eco-Friendly Cleaning"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Service Category *
            </label>
            <select
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Service Area Radius (Miles)
            </label>
            <select
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={serviceAreaRadius}
              onChange={(e) => setServiceAreaRadius(e.target.value)}
            >
              <option value="5">Within 5 miles of Norwalk</option>
              <option value="10">Within 10 miles (Norwalk, Westport, Darien)</option>
              <option value="20">Within 20 miles (Lower Fairfield County)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
            Service Description *
          </label>
          <textarea
            rows={5}
            className="form-input"
            style={{ paddingLeft: '1rem' }}
            placeholder="Describe your services, tools, experience, and what customers should expect..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Pricing Model
            </label>
            <select className="form-input" style={{ paddingLeft: '1rem' }} value={pricingType} onChange={(e) => setPricingType(e.target.value)}>
              <option value="starting_at">Starting Price ($)</option>
              <option value="fixed">Fixed Price ($)</option>
              <option value="contact_quote">Contact for Custom Quote</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Price Amount ($)
            </label>
            <input
              type="number"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. 75"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              disabled={pricingType === 'contact_quote'}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Years of Experience
            </label>
            <input
              type="number"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Portfolio Image URL (Optional)
            </label>
            <input
              type="url"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="https://images.unsplash.com/..."
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
            Weekly Availability
          </label>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '1rem' }}
            placeholder="e.g. Mon - Sat: 8:00 AM - 6:00 PM"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
          <Send size={18} />
          <span>{submitting ? 'Publishing Service...' : 'Publish Service Listing'}</span>
        </button>
      </form>
    </div>
  );
}
