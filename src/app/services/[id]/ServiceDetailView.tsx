'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, MapPin, ShieldCheck, Clock, Calendar, DollarSign, MessageSquare, Send, Bookmark, X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ServiceDetailViewProps {
  service: any;
  user: any;
  isSaved: boolean;
  initialQuoteOpen: boolean;
}

export default function ServiceDetailView({
  service,
  user,
  isSaved: initialSaved,
  initialQuoteOpen,
}: ServiceDetailViewProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [showQuoteModal, setShowQuoteModal] = useState(initialQuoteOpen);

  // Quote Form State
  const [quoteDescription, setQuoteDescription] = useState('');
  const [quoteBudget, setQuoteBudget] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [quoteTime, setQuoteTime] = useState('');
  const [quoteLocation, setQuoteLocation] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const toggleSave = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/saved/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: service.id }),
      });
      const data = await res.json();
      if (res.ok) setSaved(data.saved);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    setQuoteError('');
    setQuoteSubmitting(true);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          providerId: service.providerId,
          description: quoteDescription,
          budget: quoteBudget,
          preferredDate: quoteDate,
          preferredTime: quoteTime,
          locationDescription: quoteLocation,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }
      setQuoteSuccess(true);
    } catch (err: any) {
      setQuoteError(err.message);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    setReviewError('');
    setReviewSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          providerId: service.providerId,
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }
      setReviewSuccess(true);
      router.refresh();
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const portfolioImages = JSON.parse(service.portfolioImages || '[]');
  const providerName = service.provider?.name || 'Local Provider';
  const locationText = service.location?.neighborhood
    ? `${service.location.neighborhood}, ${service.location.city.name}`
    : `${service.location?.city?.name || 'Norwalk'}, CT`;

  return (
    <main className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/services" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E05638' }}>
          ← Back to All Services in Norwalk
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Left Column: Service Details, Portfolio, Reviews */}
        <div>
          {/* Header Profile Box */}
          <div className="search-box-wrapper" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              {service.provider?.avatarUrl ? (
                <img src={service.provider.avatarUrl} alt={providerName} className="provider-avatar" style={{ width: 72, height: 72 }} />
              ) : (
                <div className="provider-avatar" style={{ width: 72, height: 72, backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem' }}>
                  {providerName.charAt(0)}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h1 style={{ fontSize: '1.6rem' }}>{service.name}</h1>
                  {service.provider?.isVerified && (
                    <span title="Verified Provider">
                      <ShieldCheck size={20} color="#2563EB" />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                  Offered by {providerName} · {service.category?.name}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <div className="rating-badge">
                    <Star size={16} fill="#D97706" color="#D97706" />
                    <span style={{ fontSize: '0.95rem' }}>{service.rating.toFixed(1)}</span>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>({service.reviews.length} reviews)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748B' }}>
                    <MapPin size={15} color="#E05638" />
                    <span>{locationText} (Serves {service.serviceAreaRadius} mi)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
              <button onClick={() => setShowQuoteModal(true)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                <Send size={18} /> Request a Quote
              </button>
              <Link href={`/messages?userId=${service.providerId}&serviceId=${service.id}`} className="btn btn-dark btn-lg" style={{ flex: 1 }}>
                <MessageSquare size={18} /> Message Provider
              </Link>
              <button onClick={toggleSave} className="btn btn-outline btn-lg">
                <Bookmark size={18} fill={saved ? '#E05638' : 'none'} color={saved ? '#E05638' : 'currentColor'} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="search-box-wrapper" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>About this Service</h3>
            <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{service.description}</p>
          </div>

          {/* Portfolio Images */}
          {portfolioImages.length > 0 && (
            <div className="search-box-wrapper" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Work Portfolio & Photos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {portfolioImages.map((imgUrl: string, idx: number) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Portfolio ${idx + 1}`}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="search-box-wrapper">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Client Reviews ({service.reviews.length})</h3>

            {/* Write a review */}
            {user && (
              <div style={{ backgroundColor: '#F8FAF9', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>Write a Review</h4>
                {reviewSuccess ? (
                  <p style={{ color: '#059669', fontWeight: 600 }}>Thank you! Your review has been recorded.</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {reviewError && <p style={{ color: '#DC2626', fontSize: '0.85rem' }}>{reviewError}</p>}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>Rating:</label>
                      <select className="form-input" style={{ width: 'auto', padding: '0.2rem 0.5rem' }} value={newRating} onChange={(e) => setNewRating(parseInt(e.target.value))}>
                        <option value={5}>★★★★★ (5/5)</option>
                        <option value={4}>★★★★☆ (4/5)</option>
                        <option value={3}>★★★☆☆ (3/5)</option>
                        <option value={2}>★★☆☆☆ (2/5)</option>
                        <option value={1}>★☆☆☆☆ (1/5)</option>
                      </select>
                    </div>
                    <textarea
                      rows={3}
                      className="form-input"
                      style={{ paddingLeft: '0.8rem' }}
                      placeholder="Share your experience working with this service provider..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} disabled={reviewSubmitting}>
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Review List */}
            {service.reviews.length === 0 ? (
              <p style={{ color: '#64748B', fontStyle: 'italic' }}>No written reviews yet for this provider.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {service.reviews.map((rev: any) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <div style={{ fontWeight: 700 }}>{rev.reviewer?.name || 'Local Customer'}</div>
                      <div style={{ color: '#D97706', fontWeight: 700, fontSize: '0.9rem' }}>{'★'.repeat(rev.rating)}</div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{rev.comment}</p>
                    {rev.providerReply && (
                      <div style={{ backgroundColor: '#F1F5F9', padding: '0.6rem 0.8rem', borderRadius: '6px', marginTop: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                        <strong>Response from provider:</strong> {rev.providerReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          <div className="filter-box">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Provider Specs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Price Model:</span>
                <span style={{ fontWeight: 700 }}>{service.pricingType === 'contact_quote' ? 'Quote Required' : `From $${service.priceAmount}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Experience:</span>
                <span style={{ fontWeight: 700 }}>{service.experienceYears}+ years</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Response Time:</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>{service.responseTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Availability:</span>
                <span style={{ fontWeight: 600 }}>{service.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="modal-overlay" onClick={() => setShowQuoteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Request Quote from {providerName}</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{service.name}</span>
              </div>
              <button onClick={() => setShowQuoteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {quoteSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
                <h3>Quote Request Sent!</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
                  {providerName} will review your details and send a pricing estimate via messages.
                </p>
                <button onClick={() => setShowQuoteModal(false)} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {quoteError && (
                  <div style={{ color: '#DC2626', backgroundColor: '#FEF2F2', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    {quoteError}
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Describe the job or service needed
                  </label>
                  <textarea
                    rows={4}
                    className="form-input"
                    style={{ paddingLeft: '0.8rem' }}
                    placeholder="Provide details about what needs fixing, room size, or job specifications..."
                    value={quoteDescription}
                    onChange={(e) => setQuoteDescription(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Estimated Budget ($)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ paddingLeft: '0.8rem' }}
                      placeholder="e.g. 150"
                      value={quoteBudget}
                      onChange={(e) => setQuoteBudget(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      style={{ paddingLeft: '0.8rem' }}
                      value={quoteDate}
                      onChange={(e) => setQuoteDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Location / Address in Norwalk
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '0.8rem' }}
                    placeholder="e.g. South Norwalk near Washington St"
                    value={quoteLocation}
                    onChange={(e) => setQuoteLocation(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowQuoteModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={quoteSubmitting}>
                    {quoteSubmitting ? 'Sending Request...' : 'Send Quote Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
