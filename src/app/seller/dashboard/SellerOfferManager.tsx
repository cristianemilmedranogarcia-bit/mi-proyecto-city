'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Check, X } from 'lucide-react';

interface SellerOfferManagerProps {
  offer: any;
}

export default function SellerOfferManager({ offer: initialOffer }: SellerOfferManagerProps) {
  const [offer, setOffer] = useState(initialOffer);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOffer(data.offer);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>
            Offer: ${offer.offerAmount}
          </span>{' '}
          <span className="badge badge-applied" style={{ fontSize: '0.7rem' }}>
            {offer.status}
          </span>
          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>From: {offer.buyer?.name}</div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
          {new Date(offer.createdAt).toLocaleDateString()}
        </div>
      </div>

      {offer.message && (
        <div style={{ backgroundColor: '#F8FAF9', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#334155', marginBottom: '0.6rem' }}>
          "{offer.message}"
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => updateStatus('ACCEPTED')} className="btn btn-outline btn-sm" style={{ color: '#059669' }} disabled={loading}>
          <Check size={14} /> Accept Offer
        </button>
        <button onClick={() => updateStatus('DECLINED')} className="btn btn-outline btn-sm" style={{ color: '#DC2626' }} disabled={loading}>
          <X size={14} /> Decline
        </button>
        <Link href={`/messages?userId=${offer.buyerId}&itemId=${offer.itemId}`} className="btn btn-dark btn-sm">
          <MessageSquare size={14} /> Message Buyer
        </Link>
      </div>
    </div>
  );
}
