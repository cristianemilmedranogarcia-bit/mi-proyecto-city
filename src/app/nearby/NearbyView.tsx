'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Search,
  MapPin,
  Briefcase,
  Wrench,
  ShoppingBag,
  Filter,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';

// Dynamically import Leaflet Map component with SSR disabled
const NearbyMap = dynamic(() => import('@/components/NearbyMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '480px',
        backgroundColor: '#e6f9ed',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0e3b2e',
        fontWeight: 700,
      }}
    >
      📍 Loading PostPlace Interactive Map...
    </div>
  ),
});

interface NearbyViewProps {
  initialUser?: any;
  initialCity?: string;
  initialState?: string;
}

export default function NearbyView({ initialUser, initialCity = 'Norwalk', initialState = 'CT' }: NearbyViewProps) {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedState, setSelectedState] = useState(initialState);
  const [activeType, setActiveType] = useState<'ALL' | 'JOBS' | 'SERVICES' | 'MARKETPLACE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState('25');
  const [sortBy, setSortBy] = useState('closest');
  const [mobileMode, setMobileMode] = useState<'map' | 'list'>('list');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({ center: { lat: 41.1177, lng: -73.4079 }, results: [] });
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Fetch Nearby Data from API
  const fetchNearbyData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        city: selectedCity,
        state: selectedState,
        type: activeType,
        search: searchQuery,
        radius: radius,
        sortBy: sortBy,
      });

      const res = await fetch(`/api/nearby?${query.toString()}`);
      const json = await res.json();
      if (res.ok) {
        setData(json);
        if (json.results && json.results.length > 0) {
          setSelectedItem(json.results[0]);
        } else {
          setSelectedItem(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyData();
  }, [selectedCity, selectedState, activeType, radius, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNearbyData();
  };

  const toggleSave = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!initialUser) {
      window.location.href = '/login';
      return;
    }

    const key = `${item.type}_${item.id}`;
    const isSaved = savedIds.has(key);
    const newSaved = new Set(savedIds);

    if (isSaved) {
      newSaved.delete(key);
    } else {
      newSaved.add(key);
    }
    setSavedIds(newSaved);

    try {
      let endpoint = '/api/saved/job';
      let bodyKey = 'jobId';
      if (item.type === 'SERVICE') {
        endpoint = '/api/saved/service';
        bodyKey = 'serviceId';
      } else if (item.type === 'MARKETPLACE') {
        endpoint = '/api/saved/item';
        bodyKey = 'itemId';
      }

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [bodyKey]: item.id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar currentUser={initialUser} />
      <main className="container nearby-container" style={{ padding: '1.75rem 1.5rem 5rem 1.5rem', maxWidth: '1560px' }}>
        {/* Mobile Map / List Toggle Buttons */}
        <div className="mobile-map-toggle-bar" style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            className={`mobile-toggle-btn ${mobileMode === 'list' ? 'active' : ''}`}
            onClick={() => setMobileMode('list')}
          >
            📋 List View ({data.results?.length || 0})
          </button>
          <button
            type="button"
            className={`mobile-toggle-btn ${mobileMode === 'map' ? 'active' : ''}`}
            onClick={() => setMobileMode('map')}
          >
            🗺️ Map View
          </button>
        </div>

        {/* Top Search & Filter Control Bar */}
        <div className="search-box-wrapper" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Segmented Filter Control */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div className="studio-segmented-row" style={{ marginBottom: 0 }}>
                <button
                  type="button"
                  className={`studio-tab-btn ${activeType === 'ALL' ? 'active' : ''}`}
                  onClick={() => setActiveType('ALL')}
                >
                  <Compass size={16} />
                  <span>All Opportunities</span>
                </button>
                <button
                  type="button"
                  className={`studio-tab-btn ${activeType === 'JOBS' ? 'active' : ''}`}
                  onClick={() => setActiveType('JOBS')}
                >
                  <Briefcase size={16} />
                  <span>Jobs</span>
                </button>
                <button
                  type="button"
                  className={`studio-tab-btn ${activeType === 'SERVICES' ? 'active' : ''}`}
                  onClick={() => setActiveType('SERVICES')}
                >
                  <Wrench size={16} />
                  <span>Services</span>
                </button>
                <button
                  type="button"
                  className={`studio-tab-btn ${activeType === 'MARKETPLACE' ? 'active' : ''}`}
                  onClick={() => setActiveType('MARKETPLACE')}
                >
                  <ShoppingBag size={16} />
                  <span>Buy & Sell</span>
                </button>
              </div>

              {/* Radius & Sort Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                  <span>Distance:</span>
                  <select
                    className="form-input"
                    style={{ padding: '0.4rem 0.8rem', width: 'auto', borderRadius: '20px' }}
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                  >
                    <option value="5">Within 5 miles</option>
                    <option value="10">Within 10 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                  <span>Sort:</span>
                  <select
                    className="form-input"
                    style={{ padding: '0.4rem 0.8rem', width: 'auto', borderRadius: '20px' }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="closest">Closest First</option>
                    <option value="newest">Newest First</option>
                    {activeType === 'JOBS' && <option value="salary">Highest Salary</option>}
                    {activeType === 'SERVICES' && <option value="rating">Highest Rated</option>}
                    {activeType === 'MARKETPLACE' && <option value="price_asc">Lowest Price</option>}
                    {activeType === 'MARKETPLACE' && <option value="price_desc">Highest Price</option>}
                  </select>
                </div>
              </div>
            </div>

            {/* Keyword Search Input Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="input-icon-group" style={{ flex: 1 }}>
                <Search size={18} color="#16845d" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search jobs, services or items... (e.g. warehouse, handyman, macbook, sofa)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                Search Nearby
              </button>
            </div>
          </form>
        </div>

        {/* Desktop Split View / Mobile Toggle Container */}
        <div className="nearby-grid-layout">
          {/* Left Column: Results List (Hidden on mobile if Map Mode active) */}
          <div className={`nearby-list-col ${mobileMode === 'map' ? 'mobile-hidden' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0e3b2e' }}>
                {loading ? 'Searching area...' : `${data.results?.length || 0} listings found within ${radius} miles`}
              </span>
              {selectedCity && (
                <span className="brand-badge" style={{ fontSize: '0.75rem' }}>
                  📍 {selectedCity}, {selectedState}
                </span>
              )}
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                <Compass className="spin-slow" size={32} color="#16845d" style={{ margin: '0 auto 0.75rem auto' }} />
                <p>Locating active opportunities near you...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && data.results?.length === 0 && (
              <div className="search-box-wrapper" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <Compass size={44} color="#16845d" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>No results nearby</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem auto' }}>
                  We couldn't find any listings matching your search within {radius} miles of {selectedCity}.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { setRadius('50'); fetchNearbyData(); }}
                    className="btn btn-primary btn-sm"
                  >
                    Expand to 50 miles
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setActiveType('ALL'); setRadius('25'); fetchNearbyData(); }}
                    className="btn btn-outline btn-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Results Scrollable List */}
            {!loading && data.results?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
                {data.results.map((item: any) => {
                  const isSelected = selectedItem?.id === item.id;
                  const itemSavedKey = `${item.type}_${item.id}`;
                  const isSaved = savedIds.has(itemSavedKey);

                  return (
                    <div
                      key={`${item.type}_${item.id}`}
                      onClick={() => setSelectedItem(item)}
                      className={`nearby-result-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        {/* Avatar / Thumbnail Image */}
                        <div className="nearby-card-thumb">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} />
                          ) : item.logoUrl ? (
                            <img src={item.logoUrl} alt={item.subtitle} />
                          ) : item.avatarUrl ? (
                            <img src={item.avatarUrl} alt={item.subtitle} />
                          ) : (
                            <div className="nearby-thumb-fallback" style={{ backgroundColor: item.type === 'JOB' ? '#0e3b2e' : item.type === 'SERVICE' ? '#16845d' : '#765066' }}>
                              {item.type === 'JOB' ? <Briefcase size={20} color="#FFF" /> : item.type === 'SERVICE' ? <Wrench size={20} color="#FFF" /> : <ShoppingBag size={20} color="#FFF" />}
                            </div>
                          )}
                        </div>

                        {/* Content Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <span className="nearby-type-badge" style={{ backgroundColor: item.type === 'JOB' ? '#e6f9ed' : item.type === 'SERVICE' ? '#f0fdf4' : '#faf5f8', color: item.type === 'JOB' ? '#0e3b2e' : item.type === 'SERVICE' ? '#16845d' : '#765066' }}>
                              {item.type === 'JOB' ? '💼 JOB' : item.type === 'SERVICE' ? '🔧 SERVICE' : '🏷️ BUY & SELL'}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16845d' }}>
                              📍 {item.distance} miles away
                            </span>
                          </div>

                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem', color: '#0e3b2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </h4>

                          <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginBottom: '0.5rem' }}>
                            {item.subtitle} {item.isVerified && <ShieldCheck size={14} color="#16845d" style={{ display: 'inline', verticalAlign: 'middle' }} />}
                          </div>

                          {/* Extra Metadata Pill Row */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                            {item.salary && <span className="salary-tag" style={{ fontSize: '0.8rem', padding: '0.15rem 0.6rem' }}>{item.salary}</span>}
                            {item.price && <span className="salary-tag" style={{ fontSize: '0.8rem', padding: '0.15rem 0.6rem', backgroundColor: '#e6f9ed', color: '#0e3b2e' }}>{item.price}</span>}
                            {item.rating && (
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Star size={13} fill="#d97706" /> {item.rating} ({item.reviewCount})
                              </span>
                            )}
                            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{item.locationText}</span>
                          </div>

                          {/* Action Links */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f4f1eb' }}>
                            <Link href={item.link} className="see-all-link" style={{ fontSize: '0.85rem' }}>
                              View {item.type === 'JOB' ? 'Job Details' : item.type === 'SERVICE' ? 'Service Profile' : 'Item Listing'} →
                            </Link>

                            <button
                              type="button"
                              onClick={(e) => toggleSave(item, e)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', color: isSaved ? '#16845d' : '#64748B' }}
                              title="Save Listing"
                            >
                              <Bookmark size={16} fill={isSaved ? '#16845d' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Interactive Leaflet Map (Hidden on mobile if List Mode active) */}
          <div className={`nearby-map-col ${mobileMode === 'list' ? 'mobile-hidden' : ''}`} style={{ position: 'relative' }}>
            <NearbyMap
              center={data.center}
              results={data.results || []}
              selectedItem={selectedItem}
              onSelectItem={(item) => setSelectedItem(item)}
              onSearchThisArea={(lat, lng) => {
                fetchNearbyData();
              }}
            />

            {/* PostPlace Floating Map Selection Detail Card */}
            {selectedItem && (
              <div className="nearby-floating-detail-card">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="floating-close-btn"
                  title="Close preview"
                >
                  <X size={16} />
                </button>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div className="nearby-card-thumb" style={{ width: 60, height: 60 }}>
                    {selectedItem.imageUrl ? (
                      <img src={selectedItem.imageUrl} alt={selectedItem.title} />
                    ) : selectedItem.logoUrl ? (
                      <img src={selectedItem.logoUrl} alt={selectedItem.subtitle} />
                    ) : selectedItem.avatarUrl ? (
                      <img src={selectedItem.avatarUrl} alt={selectedItem.subtitle} />
                    ) : (
                      <div className="nearby-thumb-fallback" style={{ backgroundColor: selectedItem.type === 'JOB' ? '#0e3b2e' : selectedItem.type === 'SERVICE' ? '#16845d' : '#765066' }}>
                        {selectedItem.type === 'JOB' ? <Briefcase size={24} color="#FFF" /> : selectedItem.type === 'SERVICE' ? <Wrench size={24} color="#FFF" /> : <ShoppingBag size={24} color="#FFF" />}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="nearby-type-badge" style={{ backgroundColor: selectedItem.type === 'JOB' ? '#e6f9ed' : selectedItem.type === 'SERVICE' ? '#f0fdf4' : '#faf5f8', color: selectedItem.type === 'JOB' ? '#0e3b2e' : selectedItem.type === 'SERVICE' ? '#16845d' : '#765066' }}>
                        {selectedItem.type === 'JOB' ? '💼 JOB' : selectedItem.type === 'SERVICE' ? '🔧 SERVICE' : '🏷️ BUY & SELL'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16845d' }}>
                        📍 {selectedItem.distance} mi away
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0e3b2e', lineHeight: 1.2, marginBottom: '0.25rem' }}>
                      {selectedItem.title}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginBottom: '0.4rem' }}>
                      {selectedItem.subtitle} {selectedItem.isVerified && <ShieldCheck size={14} color="#16845d" style={{ display: 'inline', verticalAlign: 'middle' }} />}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4, marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {selectedItem.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Link
                        href={selectedItem.link}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <span>View Full Details →</span>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => toggleSave(selectedItem, e)}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '0.3rem', color: savedIds.has(`${selectedItem.type}_${selectedItem.id}`) ? '#16845d' : 'inherit' }}
                      >
                        <Bookmark size={14} fill={savedIds.has(`${selectedItem.type}_${selectedItem.id}`) ? '#16845d' : 'none'} />
                        <span>{savedIds.has(`${selectedItem.type}_${selectedItem.id}`) ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
