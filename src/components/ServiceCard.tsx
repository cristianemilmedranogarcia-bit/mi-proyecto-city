'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, ShieldCheck, Bookmark, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: any;
  isSaved?: boolean;
}

export default function ServiceCard({ service, isSaved: initialSaved = false }: ServiceCardProps) {
  const [saved, setSaved] = useState(initialSaved);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch('/api/saved/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: service.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(data.saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const providerName = service.provider?.name || 'Local Provider';
  const avatarUrl = service.provider?.avatarUrl;
  const locationText = service.location?.neighborhood
    ? `${service.location.neighborhood}, ${service.location.city.name}`
    : `${service.location?.city?.name || 'Norwalk'}, CT`;

  return (
    <div className="service-card">
      <div className="provider-header">
        {avatarUrl ? (
          <img src={avatarUrl} alt={providerName} className="provider-avatar" />
        ) : (
          <div className="provider-avatar" style={{ backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {providerName.charAt(0)}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h4 className="provider-name">{providerName}</h4>
            {service.provider?.isVerified && (
              <span title="Verified Provider">
                <ShieldCheck size={16} color="#2563EB" />
              </span>
            )}
          </div>
          <div className="rating-badge">
            <Star size={14} fill="#D97706" color="#D97706" />
            <span>{service.rating.toFixed(1)}</span>
            <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.8rem' }}>({service.reviewCount} reviews)</span>
          </div>
        </div>
        <button onClick={toggleSave} className={`save-btn ${saved ? 'saved' : ''}`}>
          <Bookmark size={18} fill={saved ? '#E05638' : 'none'} />
        </button>
      </div>

      <div className="service-card-body">
        <h3 className="service-title">{service.name}</h3>
        <p className="service-desc">{service.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.75rem' }}>
          <MapPin size={15} color="#E05638" />
          <span>{locationText} · Serves {service.serviceAreaRadius} mi radius</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Pricing</span>
            <span className="price-indicator">
              {service.pricingType === 'contact_quote' ? 'Contact for Quote' : `From $${service.priceAmount}`}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', backgroundColor: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
            {service.responseTime}
          </span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
        <Link href={`/services/${service.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          View Profile
        </Link>
        <Link href={`/services/${service.id}?quote=1`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          Request Quote
        </Link>
      </div>
    </div>
  );
}
