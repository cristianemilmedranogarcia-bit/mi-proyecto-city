'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, MessageSquare, Check, X } from 'lucide-react';

interface ProviderQuoteManagerProps {
  quote: any;
}

export default function ProviderQuoteManager({ quote: initialQuote }: ProviderQuoteManagerProps) {
  const [quote, setQuote] = useState(initialQuote);
  const [quoteAmount, setQuoteAmount] = useState(initialQuote.quoteAmount || '');
  const [quoteNotes, setQuoteNotes] = useState(initialQuote.quoteNotes || '');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: quote.id,
          status,
          quoteAmount,
          quoteNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuote(data.quote);
        setShowQuoteForm(false);
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
        borderRadius: '10px',
        padding: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div>
          <span className="badge badge-applied" style={{ marginBottom: '0.3rem', display: 'inline-block' }}>
            {quote.status}
          </span>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{quote.customer?.name || 'Customer'}</h4>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>For: {quote.service?.name}</span>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748B' }}>
          Requested: {new Date(quote.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div style={{ backgroundColor: '#F8FAF9', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '0.8rem', color: '#334155' }}>
        <strong>Request Details:</strong> "{quote.description}"
        {quote.budget && <div style={{ marginTop: '0.3rem' }}>Customer Budget: ${quote.budget}</div>}
        {quote.locationDescription && <div style={{ marginTop: '0.2rem' }}>Location: {quote.locationDescription}</div>}
      </div>

      {quote.quoteAmount && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', color: '#065F46', marginBottom: '0.8rem' }}>
          <strong>Your Quote Sent:</strong> ${quote.quoteAmount}
          {quote.quoteNotes && <span> — {quote.quoteNotes}</span>}
        </div>
      )}

      {showQuoteForm ? (
        <div style={{ backgroundColor: '#F1F5F9', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Submit Formal Quote</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <input
              type="number"
              className="form-input"
              style={{ paddingLeft: '0.6rem', fontSize: '0.85rem' }}
              placeholder="Price ($)"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '0.6rem', fontSize: '0.85rem' }}
              placeholder="Quote breakdown notes..."
              value={quoteNotes}
              onChange={(e) => setQuoteNotes(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => updateStatus('QUOTED')} className="btn btn-primary btn-sm" disabled={loading}>
              Send Quote
            </button>
            <button onClick={() => setShowQuoteForm(false)} className="btn btn-outline btn-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setShowQuoteForm(true)} className="btn btn-primary btn-sm">
            <DollarSign size={14} /> Send Quote
          </button>
          <button onClick={() => updateStatus('ACCEPTED')} className="btn btn-outline btn-sm" style={{ color: '#059669' }}>
            <Check size={14} /> Accept
          </button>
          <button onClick={() => updateStatus('DECLINED')} className="btn btn-outline btn-sm" style={{ color: '#DC2626' }}>
            <X size={14} /> Decline
          </button>
          <Link
            href={`/messages?userId=${quote.customerId}&quoteId=${quote.id}`}
            className="btn btn-dark btn-sm"
          >
            <MessageSquare size={14} /> Message
          </Link>
        </div>
      )}
    </div>
  );
}
