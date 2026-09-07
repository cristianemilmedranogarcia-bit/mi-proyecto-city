'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';

interface MarketplaceFilterSidebarProps {
  categories: any[];
  currentParams: any;
}

export default function MarketplaceFilterSidebar({ categories, currentParams }: MarketplaceFilterSidebarProps) {
  const router = useRouter();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/marketplace?${params.toString()}`);
  };

  const clearAll = () => {
    const savedState = (typeof window !== 'undefined' && localStorage.getItem('postplace_state')) || 'CT';
    const savedCity = (typeof window !== 'undefined' && localStorage.getItem('postplace_city')) || 'All Connecticut';
    const newParams = new URLSearchParams();
    if (savedState) newParams.set('state', savedState);
    if (savedCity) newParams.set('city', savedCity);
    router.push(`/marketplace?${newParams.toString()}`);
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
            <Filter size={16} /> Filters
          </div>
          <button
            onClick={clearAll}
            style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'none', border: 'none', color: '#E05638', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Location / City Filter */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="filter-title">City / Location</div>
          <select
            className="form-input"
            style={{ paddingLeft: '0.75rem', fontSize: '0.85rem' }}
            value={currentParams.city || 'All Connecticut'}
            onChange={(e) => updateParam('city', e.target.value)}
          >
            <option value="All Connecticut">All Connecticut</option>
            <option value="Norwalk">Norwalk</option>
            <option value="Stamford">Stamford</option>
            <option value="Greenwich">Greenwich</option>
            <option value="Danbury">Danbury</option>
            <option value="Hartford">Hartford</option>
            <option value="New Haven">New Haven</option>
          </select>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="filter-title">Category</div>
          <select
            className="form-input"
            style={{ paddingLeft: '0.75rem', fontSize: '0.85rem' }}
            value={currentParams.cat || ''}
            onChange={(e) => updateParam('cat', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="filter-title">Item Condition</div>
          {[
            { id: 'NEW', label: 'Brand New' },
            { id: 'LIKE_NEW', label: 'Like New' },
            { id: 'GOOD', label: 'Good' },
            { id: 'FAIR', label: 'Fair' },
          ].map((c) => (
            <label key={c.id} className="filter-option">
              <input
                type="radio"
                name="cond"
                checked={currentParams.cond === c.id}
                onChange={() => updateParam('cond', currentParams.cond === c.id ? '' : c.id)}
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>

        {/* Language Requirement */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="filter-title">Language Spoken / Idioma</div>
          {[
            { id: 'english', label: 'English' },
            { id: 'spanish', label: 'Spanish / Español' },
            { id: 'bilingual', label: 'Bilingual (EN / ES)' },
          ].map((l) => (
            <label key={l.id} className="filter-option">
              <input
                type="radio"
                name="lang"
                checked={currentParams.lang === l.id}
                onChange={() => updateParam('lang', currentParams.lang === l.id ? '' : l.id)}
              />
              <span>{l.label}</span>
            </label>
          ))}
        </div>

        {/* Sort */}
        <div>
          <div className="filter-title">Sort By</div>
          <select
            className="form-input"
            style={{ paddingLeft: '0.75rem', fontSize: '0.85rem' }}
            value={currentParams.sort || 'newest'}
            onChange={(e) => updateParam('sort', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
