'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Bookmark, Tag } from 'lucide-react';

interface ItemCardProps {
  item: any;
  isSaved?: boolean;
}

export default function ItemCard({ item, isSaved: initialSaved = false }: ItemCardProps) {
  const [saved, setSaved] = useState(initialSaved);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch('/api/saved/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(data.saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const images = JSON.parse(item.images || '[]');
  const primaryImg = images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80';
  const locationText = item.location?.neighborhood
    ? `${item.location.neighborhood}, ${item.location.city.name}`
    : `${item.location?.city?.name || 'Norwalk'}, CT`;

  const conditionLabels: Record<string, string> = {
    NEW: 'Brand New',
    LIKE_NEW: 'Like New',
    GOOD: 'Good Condition',
    FAIR: 'Fair Condition',
  };

  return (
    <Link href={`/marketplace/${item.id}`} className="service-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', backgroundColor: '#F1F5F9' }}>
        <img src={primaryImg} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#FFFFFF',
            borderRadius: '50%',
            padding: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <button onClick={toggleSave} className={`save-btn ${saved ? 'saved' : ''}`} style={{ padding: '0.2rem' }}>
            <Bookmark size={16} fill={saved ? '#E05638' : 'none'} color={saved ? '#E05638' : '#0F172A'} />
          </button>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.1rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
          }}
        >
          {item.price === 0 ? 'FREE' : `$${item.price.toFixed(0)}`}
        </div>
      </div>

      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 className="service-title" style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>
            {item.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            <span className="tag-badge" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              {conditionLabels[item.condition] || item.condition}
            </span>
            <span className="tag-badge">{item.category?.name}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} color="#E05638" />
            <span>{locationText}</span>
          </div>
          <span>Seller: {item.seller?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </Link>
  );
}
