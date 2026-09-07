'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Briefcase,
  Wrench,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Star,
  Tag,
  Activity
} from 'lucide-react';

interface SearchHeroProps {
  user?: any;
  cityName: string;
  stateCode?: string;
  latestJob?: any;
  latestService?: any;
  latestItem?: any;
}

export default function SearchHero({ user, cityName, stateCode = 'CT', latestJob, latestService, latestItem }: SearchHeroProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'job' | 'service' | 'marketplace'>('job');
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState('15 mi');

  const isAll = cityName.startsWith('All');
  const cleanCity = isAll ? (cityName.replace(/^All\s+/, '') || 'Connecticut') : cityName;
  const displayLocation = isAll ? cleanCity : `${cityName}, ${stateCode}`;
  const kickerLocation = isAll ? cleanCity.toUpperCase() : `${cityName.toUpperCase()}, ${stateCode.toUpperCase()}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'job') {
      router.push(`/jobs?q=${encodeURIComponent(query)}`);
    } else if (activeTab === 'service') {
      router.push(`/services?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/marketplace?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="studio-hero-open-section">
      {/* Background Norwalk CT Community Street Photo */}
      <img
        src="/images/norwalk_hero_bg.png"
        alt="Local Community"
        className="studio-hero-bg-img"
      />
      {/* Soft Directional Wash Layer */}
      <div className="studio-hero-bg-wash" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Main 2-Column Grid */}
        <div className="studio-hero-open-grid">
          {/* Left Column: Studio Mark & Print Editorial Content & Search */}
          <div className="studio-hero-open-left">
            {/* Studio Kicker with horizontal line prefix */}
            <div className="studio-kicker-badge">
              <MapPin size={14} color="#16845d" />
              <span>LIVE IN {kickerLocation} & LOCAL REGION</span>
            </div>

            {/* Title with Studio Italic Serif Accent */}
            <h1 className="studio-hero-open-title">
              Find local jobs. <br />
              Hire trusted pros. <br />
              <em className="studio-serif-italic">in {displayLocation}.</em>
            </h1>

            <p className="studio-hero-open-sub">
              The authentic community marketplace connecting workers, verified businesses, independent contractors, and local buyers across Fairfield County.
            </p>

            {/* Studio Segmented Tabs */}
            <div className="studio-segmented-row">
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'job' ? 'active' : ''}`}
                onClick={() => setActiveTab('job')}
              >
                <Briefcase size={16} />
                <span>Jobs</span>
                <span className="studio-tab-badge">30 hiring</span>
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'service' ? 'active' : ''}`}
                onClick={() => setActiveTab('service')}
              >
                <Wrench size={16} />
                <span>Services</span>
                <span className="studio-tab-badge">20 pros</span>
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
                onClick={() => setActiveTab('marketplace')}
              >
                <ShoppingBag size={16} />
                <span>Buy & Sell</span>
                <span className="studio-tab-badge">20 items</span>
              </button>
            </div>

            {/* Studio Search Card */}
            <form onSubmit={handleSearch} className="studio-floating-search-card">
              <div className="studio-search-inputs-group">
                {/* Search Input */}
                <div className="studio-input-cell">
                  <Search size={18} color="#16845d" className="studio-cell-icon" />
                  <input
                    type="text"
                    className="studio-input-element"
                    placeholder={
                      activeTab === 'job'
                        ? 'Job title, company or skill (e.g. Warehouse, Cook)'
                        : activeTab === 'service'
                          ? 'Service needed (e.g. Handyman, Cleaning)'
                          : 'Item for sale (e.g. MacBook, Tools, Sofa)'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="studio-cell-divider" />

                {/* Location Input */}
                <div className="studio-input-cell studio-loc-cell">
                  <MapPin size={18} color="#0e3b2e" className="studio-cell-icon" />
                  <input
                    type="text"
                    className="studio-input-element"
                    value={displayLocation}
                    readOnly
                  />
                </div>

                <div className="studio-cell-divider" />

                {/* Radius Select */}
                <div className="studio-input-cell studio-rad-cell">
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="studio-select-element"
                  >
                    <option value="5 mi">5 mi</option>
                    <option value="15 mi">15 mi</option>
                    <option value="25 mi">25 mi</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button type="submit" className="studio-main-search-btn">
                <span>Search {activeTab === 'job' ? 'Jobs' : activeTab === 'service' ? 'Services' : 'Items'}</span>
                <ArrowRight size={17} />
              </button>
            </form>

            {/* Trending Quick Chips */}
            <div className="studio-chips-row">
              <button type="button" className="studio-chip-btn" onClick={() => router.push('/jobs?cat=logistics-warehouse')}>
                Warehouse Jobs
              </button>
              <button type="button" className="studio-chip-btn" onClick={() => router.push('/services?cat=handyman')}>
                Handyman Repair
              </button>
              <button type="button" className="studio-chip-btn" onClick={() => router.push('/jobs?cat=restaurant-hospitality')}>
                Line Cook
              </button>
              <button type="button" className="studio-chip-btn" onClick={() => router.push('/marketplace?cat=electronics')}>
                Laptops & Tech
              </button>
              <button type="button" className="studio-chip-btn" onClick={() => router.push('/marketplace?cat=free-stuff')}>
                Free Local Items
              </button>
            </div>
          </div>

          {/* Right Column: Clean Floating Real Opportunity Cards */}
          <div className="studio-hero-open-right">
            <div className="studio-clean-stack">
              <div className="studio-stack-topbar">
                <div className="studio-stack-title">
                  <span>Real-Time Activity Near You</span>
                </div>
              </div>

              {/* Job Card (Most Recent) */}
              {latestJob ? (
                <div className="studio-live-card" onClick={() => router.push(`/jobs/${latestJob.id}`)}>
                  <div className="hero-card-header">
                    {latestJob.business?.logoUrl ? (
                      <img
                        src={latestJob.business.logoUrl}
                        alt={latestJob.business.name}
                        className="hero-card-avatar-img"
                      />
                    ) : (
                      <div className="hero-card-avatar-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' }}>
                        <Building2 size={22} color="#64748B" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hero-card-tag tag-urgent">
                        <Zap size={11} /> Recently Posted Job
                      </div>
                      <div className="hero-card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {latestJob.title}
                      </div>
                      <div className="hero-card-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {latestJob.business?.name || 'Local Employer'} · {latestJob.location?.neighborhood || cleanCity}
                      </div>
                    </div>
                  </div>
                  <div className="hero-card-footer">
                    <span className="hero-card-salary">
                      {latestJob.salaryMin
                        ? `$${latestJob.salaryMin}${latestJob.salaryMax ? ` - $${latestJob.salaryMax}` : ''} / ${latestJob.salaryType === 'hourly' ? 'hr' : 'yr'}`
                        : 'Competitive Pay'}
                    </span>
                    <span className="hero-card-action">Apply 1-Click →</span>
                  </div>
                </div>
              ) : (
                <div className="studio-live-card" onClick={() => router.push('/jobs')}>
                  <div className="hero-card-header">
                    <div className="hero-card-avatar-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' }}>
                      <Briefcase size={22} color="#16845d" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="hero-card-tag tag-urgent">
                        <Zap size={11} /> Hiring Immediately
                      </div>
                      <div className="hero-card-title">Explore Local Jobs</div>
                      <div className="hero-card-sub">Be the first to post a job in {cleanCity}</div>
                    </div>
                  </div>
                  <div className="hero-card-footer">
                    <span className="hero-card-salary">Multiple Roles</span>
                    <span className="hero-card-action">Browse Jobs →</span>
                  </div>
                </div>
              )}

              {/* Service Card (Most Recent) */}
              {latestService ? (
                <div className="studio-live-card" onClick={() => router.push(`/services/${latestService.id}`)}>
                  <div className="hero-card-header">
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {latestService.provider?.avatarUrl ? (
                        <img
                          src={latestService.provider.avatarUrl}
                          alt={latestService.provider.name}
                          className="hero-card-avatar-img avatar-circle"
                        />
                      ) : (
                        <div className="hero-card-avatar-img avatar-circle" style={{ backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0F172A' }}>
                          {latestService.provider?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                      <div className="hero-avatar-badge">
                        <ShieldCheck size={10} color="#FFFFFF" />
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hero-card-tag tag-verified">
                        <ShieldCheck size={11} /> Verified Local Pro
                      </div>
                      <div className="hero-card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {latestService.name}
                      </div>
                      <div className="hero-card-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {latestService.provider?.name} · {latestService.location?.neighborhood || cleanCity}
                      </div>
                    </div>
                  </div>
                  <div className="hero-card-footer">
                    <div className="hero-card-rating">
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <span>{(latestService.rating || 5.0).toFixed(1)} ({latestService.reviewCount || 0} reviews)</span>
                    </div>
                    <span className="hero-card-price">
                      {latestService.pricingType === 'contact_quote' ? 'Quote' : `$${latestService.priceAmount} / hr`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="studio-live-card" onClick={() => router.push('/services')}>
                  <div className="hero-card-header">
                    <div className="hero-card-avatar-img avatar-circle" style={{ backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wrench size={22} color="#16845d" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="hero-card-tag tag-verified">
                        <ShieldCheck size={11} /> Licensed Contractors
                      </div>
                      <div className="hero-card-title">Explore Local Services</div>
                      <div className="hero-card-sub">Handymen, Plumbers & Cleaners</div>
                    </div>
                  </div>
                  <div className="hero-card-footer">
                    <span className="hero-card-rating">⭐ Top Rated</span>
                    <span className="hero-card-price">Request Quote →</span>
                  </div>
                </div>
              )}

              {/* Marketplace Item Card (Most Recent) */}
              {latestItem ? (
                <div className="studio-live-card" onClick={() => router.push(`/marketplace/${latestItem.id}`)}>
                  <div className="hero-card-header">
                    <img
                      src={
                        JSON.parse(latestItem.images || '[]')[0] ||
                        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={latestItem.title}
                      className="hero-card-avatar-img item-img-rect"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hero-card-tag tag-marketplace">
                        <Tag size={11} /> Marketplace Deal
                      </div>
                      <div className="hero-card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {latestItem.title}
                      </div>
                      <div className="hero-card-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Seller: {latestItem.seller?.name?.split(' ')[0]} · {latestItem.location?.neighborhood || cleanCity}
                      </div>
                    </div>
                  </div>
                  <div className="hero-card-footer">
                    <span className="hero-card-price-green">
                      {latestItem.price === 0 ? 'FREE' : `$${latestItem.price.toFixed(0)}`}
                    </span>
                    <span className="hero-card-loc">
                      Pickup in {latestItem.location?.neighborhood || cleanCity}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="studio-live-card" onClick={() => router.push('/marketplace')}>
                  <div className="hero-card-header">
                    <div className="hero-card-avatar-img item-img-rect" style={{ backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={22} color="#16845d" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="hero-card-tag tag-marketplace">
                        <Tag size={11} /> Buy & Sell Deals
                      </div>
                      <div className="hero-card-title">Explore Marketplace</div>
                      <div className="hero-card-sub">Tech, Furniture, Tools & Free Items</div>
                    </div>
                  </div>
                  <div className="hero-card-footer">
                    <span className="hero-card-price-green">Best Local Deals</span>
                    <span className="hero-card-loc">Browse Items →</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Trust Pillars */}
        <div className="hero-trust-bar" style={{ marginTop: '3rem' }}>
          <div className="trust-pillar">
            <div className="trust-icon-wrap" style={{ backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' }}>
              <Building2 size={20} color="#16845d" />
            </div>
            <div>
              <div className="trust-pillar-title">10+ Verified Employers</div>
              <div className="trust-pillar-sub">Norwalk businesses hiring today</div>
            </div>
          </div>

          <div className="trust-pillar">
            <div className="trust-icon-wrap" style={{ backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' }}>
              <Zap size={20} color="#16845d" />
            </div>
            <div>
              <div className="trust-pillar-title">Direct 1-Click Apply</div>
              <div className="trust-pillar-sub">No external spam or redirects</div>
            </div>
          </div>

          <div className="trust-pillar">
            <div className="trust-icon-wrap" style={{ backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' }}>
              <Wrench size={20} color="#16845d" />
            </div>
            <div>
              <div className="trust-pillar-title">Verified Local Pros</div>
              <div className="trust-pillar-sub">Licensed handymen & contractors</div>
            </div>
          </div>

          <div className="trust-pillar">
            <div className="trust-icon-wrap" style={{ backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' }}>
              <ShieldCheck size={20} color="#16845d" />
            </div>
            <div>
              <div className="trust-pillar-title">Fairfield County Local</div>
              <div className="trust-pillar-sub">Exclusively Norwalk & CT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
