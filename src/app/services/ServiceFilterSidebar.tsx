'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';

interface ServiceFilterSidebarProps {
  categories: any[];
  currentParams: any;
}

export default function ServiceFilterSidebar({ categories, currentParams }: ServiceFilterSidebarProps) {
  const router = useRouter();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/services?${params.toString()}`);
  };

  const clearAll = () => {
    const savedState = (typeof window !== 'undefined' && localStorage.getItem('postplace_state')) || 'CT';
    const savedCity = (typeof window !== 'undefined' && localStorage.getItem('postplace_city')) || 'All Connecticut';
    const newParams = new URLSearchParams();
    if (savedState) newParams.set('state', savedState);
    if (savedCity) newParams.set('city', savedCity);
    router.push(`/services?${newParams.toString()}`);
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
            <Filter size={16} /> Service Filters
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
          <div className="filter-title">Service Category</div>
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

        {/* Minimum Rating */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="filter-title">Minimum Rating</div>
          {['4.5', '4.0', '3.5'].map((r) => (
            <label key={r} className="filter-option">
              <input
                type="radio"
                name="rating"
                checked={currentParams.rating === r}
                onChange={() => updateParam('rating', currentParams.rating === r ? '' : r)}
              />
              <span>★ {r}+ Stars</span>
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
      </div>
    </aside>
  );
}
