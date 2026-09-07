'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, DollarSign, Send } from 'lucide-react';

interface ItemOfferModalProps {
  item: any;
  user: any;
  onClose: () => void;
}

export default function ItemOfferModal({ item, user, onClose }: ItemOfferModalProps) {
  const [offerAmount, setOfferAmount] = useState(item.price ? (item.price * 0.9).toFixed(0) : '0');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          sellerId: item.sellerId,
          offerAmount: parseFloat(offerAmount),
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit offer');
      }
      setSuccess(true);
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
            <h3 style={{ fontSize: '1.25rem' }}>Make an Offer</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              {item.title} (Listed at ${item.price})
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
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Offer Sent to Seller!</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              The seller ({item.seller?.name}) will receive your offer of ${offerAmount} and can accept, decline, or counter in messages.
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

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Your Offer Amount ($)
              </label>
              <div className="input-icon-group">
                <DollarSign size={18} />
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 750"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Message to Seller (Optional)
              </label>
              <textarea
                rows={3}
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                placeholder="Mention pickup availability, payment method (Cash, Venmo, Zelle)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }} disabled={submitting}>
                <Send size={18} />
                <span>{submitting ? 'Sending...' : 'Send Offer'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
