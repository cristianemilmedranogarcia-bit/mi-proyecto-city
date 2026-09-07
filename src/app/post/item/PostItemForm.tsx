'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Send, ShieldAlert } from 'lucide-react';

interface PostItemFormProps {
  user: any;
  categories: any[];
}

export default function PostItemForm({ user, categories }: PostItemFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('GOOD');
  const [imageUrl, setImageUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const images = imageUrl ? [imageUrl] : [];
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          categoryId,
          description,
          price: price ? parseFloat(price) : 0,
          condition,
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to list item');
      }
      router.push(`/marketplace/${data.item.id}`);
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
        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
          <Tag size={24} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.3rem' }}>Sell an Item in Norwalk, CT</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>List your item on the local marketplace for neighbors to buy</p>
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
            Listing Title *
          </label>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '1rem' }}
            placeholder="e.g. Apple MacBook Pro 16, West Elm Leather Sofa, Power Tools"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Category *
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
              Item Condition
            </label>
            <select className="form-input" style={{ paddingLeft: '1rem' }} value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option value="NEW">Brand New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good Condition</option>
              <option value="FAIR">Fair Condition</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Price ($ USD) — Enter 0 for FREE items
            </label>
            <input
              type="number"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. 150"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Photo Image URL (Optional)
            </label>
            <input
              type="url"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
            Item Description *
          </label>
          <textarea
            rows={5}
            className="form-input"
            style={{ paddingLeft: '1rem' }}
            placeholder="Describe features, dimensions, reason for selling, and pickup details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
          <Send size={18} />
          <span>{submitting ? 'Publishing Listing...' : 'Publish Item for Sale'}</span>
        </button>
      </form>
    </div>
  );
}
