'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Bookmark, Flag, Send, MessageSquare, Tag, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import ItemOfferModal from './ItemOfferModal';
import ItemCard from '@/components/ItemCard';

interface ItemDetailViewProps {
  item: any;
  user: any;
  isSaved: boolean;
  existingOffer: any;
  similarItems: any[];
  initialOfferOpen: boolean;
}

export default function ItemDetailView({
  item,
  user,
  isSaved: initialSaved,
  existingOffer,
  similarItems,
  initialOfferOpen,
}: ItemDetailViewProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [showOfferModal, setShowOfferModal] = useState(initialOfferOpen);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const images = JSON.parse(item.images || '[]');
  const primaryImg = images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

  const toggleSave = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/saved/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (res.ok) setSaved(data.saved);
    } catch (e) {
      console.error(e);
    }
  };

  const conditionLabels: Record<string, string> = {
    NEW: 'Brand New',
    LIKE_NEW: 'Like New',
    GOOD: 'Good Condition',
    FAIR: 'Fair Condition',
  };

  const sellerName = item.seller?.name || 'Local Seller';
  const locationText = item.location?.neighborhood
    ? `${item.location.neighborhood}, ${item.location.city.name} CT`
    : `${item.location?.city?.name || 'Norwalk'}, CT`;

  return (
    <main className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/marketplace" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E05638' }}>
          ← Back to Marketplace in Norwalk
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Left Column: Photos & Details */}
        <div>
          {/* Main Photo Gallery */}
          <div className="search-box-wrapper" style={{ padding: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
              <img
                src={images[selectedImgIndex] || primaryImg}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                {images.map((imgUrl: string, idx: number) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setSelectedImgIndex(idx)}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: selectedImgIndex === idx ? '2px solid #E05638' : '1px solid #E2E8F0',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Item Description */}
          <div className="search-box-wrapper">
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{item.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', color: '#64748B', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                {item.price === 0 ? 'FREE' : `$${item.price.toFixed(0)}`}
              </span>
              <span className="tag-badge" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '0.85rem' }}>
                {conditionLabels[item.condition] || item.condition}
              </span>
              <span className="tag-badge" style={{ fontSize: '0.85rem' }}>{item.category?.name}</span>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Description</h3>
            <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{item.description}</p>
          </div>
        </div>

        {/* Right Column: Actions & Seller Info */}
        <div>
          <div className="filter-box" style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              {item.price === 0 ? 'FREE ITEM' : `$${item.price.toFixed(0)}`}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {existingOffer ? (
                <div style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 700, padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                  Offer Sent: ${existingOffer.offerAmount} ({existingOffer.status})
                </div>
              ) : (
                <button
                  onClick={() => (user ? setShowOfferModal(true) : router.push('/login'))}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <DollarSign size={18} /> Make an Offer
                </button>
              )}

              <Link
                href={`/messages?userId=${item.sellerId}&itemId=${item.id}`}
                className="btn btn-dark btn-lg"
                style={{ width: '100%' }}
              >
                <MessageSquare size={18} /> Message Seller
              </Link>

              <button onClick={toggleSave} className="btn btn-outline btn-lg" style={{ width: '100%', gap: '0.4rem' }}>
                <Bookmark size={18} fill={saved ? '#E05638' : 'none'} color={saved ? '#E05638' : 'currentColor'} />
                <span>{saved ? 'Saved Item' : 'Save Item'}</span>
              </button>
            </div>

            {/* Seller Specs */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Seller Information
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                {item.seller?.avatarUrl ? (
                  <img src={item.seller.avatarUrl} alt={sellerName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {sellerName.charAt(0)}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700 }}>{sellerName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Norwalk Member</div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} color="#E05638" />
                <span>Pickup Location: {locationText}</span>
              </div>
            </div>
          </div>

          {/* Similar Items */}
          {similarItems.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Similar Items in Norwalk</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {similarItems.map((si) => (
                  <ItemCard key={si.id} item={si} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <ItemOfferModal item={item} user={user} onClose={() => setShowOfferModal(false)} />
      )}
    </main>
  );
}
