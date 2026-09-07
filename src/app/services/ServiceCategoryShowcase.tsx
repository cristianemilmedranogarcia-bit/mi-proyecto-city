'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Utensils,
  Car,
  Scissors,
  HeartHandshake,
  Sparkles,
  Droplets,
  Zap,
  Hammer,
  Trees,
  CheckCircle2,
  Clock,
  Star,
  ShieldCheck,
  Tag,
  Grid
} from 'lucide-react';

interface CategoryItem {
  id?: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
}

interface ServiceCategoryShowcaseProps {
  categories: CategoryItem[];
}

// Config mapping for category visual styles, rich gradients, badges, and icons
const CATEGORY_VISUALS: Record<string, {
  emoji: string;
  iconComponent: React.ComponentType<any>;
  gradient: string;
  glowColor: string;
  badge?: string;
  sublabel: string;
}> = {
  restaurants: {
    emoji: '🍔',
    iconComponent: Utensils,
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    glowColor: 'rgba(255, 107, 107, 0.35)',
    badge: 'DELICIOUS',
    sublabel: 'Food & Catering',
  },
  automotive: {
    emoji: '🚗',
    iconComponent: Car,
    gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    glowColor: 'rgba(33, 147, 176, 0.35)',
    badge: 'AUTO PRO',
    sublabel: 'Brakes & Repair',
  },
  beauty: {
    emoji: '💇‍♀️',
    iconComponent: Scissors,
    gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ff6a88 100%)',
    glowColor: 'rgba(255, 106, 136, 0.35)',
    badge: 'STYLE & SPA',
    sublabel: 'Haircut & Salon',
  },
  veterinary: {
    emoji: '🐾',
    iconComponent: HeartHandshake,
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    glowColor: 'rgba(255, 154, 158, 0.35)',
    badge: 'PET CARE',
    sublabel: 'Vet & Grooming',
  },
  cleaning: {
    emoji: '🧹',
    iconComponent: Sparkles,
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    glowColor: 'rgba(56, 239, 125, 0.35)',
    badge: 'EXPRESS',
    sublabel: 'Home & Office',
  },
  plumbing: {
    emoji: '🔧',
    iconComponent: Droplets,
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    glowColor: 'rgba(0, 114, 255, 0.35)',
    sublabel: 'Leaks & Drains',
  },
  electrical: {
    emoji: '⚡',
    iconComponent: Zap,
    gradient: 'linear-gradient(135deg, #F9D423 0%, #FF4E50 100%)',
    glowColor: 'rgba(249, 212, 35, 0.4)',
    badge: '24/7 PRO',
    sublabel: 'Lighting & Power',
  },
  handyman: {
    emoji: '🔨',
    iconComponent: Hammer,
    gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    glowColor: 'rgba(142, 45, 226, 0.35)',
    badge: 'POPULAR',
    sublabel: 'Home Repairs',
  },
  landscaping: {
    emoji: '🌿',
    iconComponent: Trees,
    gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    glowColor: 'rgba(86, 171, 47, 0.35)',
    sublabel: 'Lawn & Patio',
  },
};

function ServiceCategoryShowcaseContent({ categories }: ServiceCategoryShowcaseProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCat = searchParams.get('cat') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentFilter = searchParams.get('filter') || '';
  const currentCity = searchParams.get('city') || 'Norwalk';

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentCat === slug) {
      params.delete('cat');
    } else {
      params.set('cat', slug);
    }
    router.push(`/services?${params.toString()}`);
  };

  const handleFilterPill = (filterType: string, ratingValue?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filterType === 'all') {
      params.delete('cat');
      params.delete('rating');
      params.delete('filter');
    } else if (filterType === 'rating') {
      if (currentRating === ratingValue) {
        params.delete('rating');
      } else {
        params.set('rating', ratingValue || '4.5');
      }
    } else {
      if (currentFilter === filterType) {
        params.delete('filter');
      } else {
        params.set('filter', filterType);
      }
    }
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="uber-services-showcase">
      {/* Banner Title / Header */}
      <div className="uber-showcase-header">
        <h2 className="uber-showcase-title">
          What service do you need today in {currentCity.startsWith('All') ? (currentCity.replace('All ', '') || 'Connecticut') : currentCity}?
        </h2>
        <p className="uber-showcase-subtitle">
          Discover top-rated restaurants, auto mechanics, salons, vets, cleaners, and verified local experts in seconds.
        </p>
      </div>

      {/* Main Uber Eats Style Visual Icons Carousel / Grid */}
      <div className="uber-category-grid">
        {/* "All Services" Icon Card */}
        <button
          type="button"
          onClick={() => handleFilterPill('all')}
          className={`uber-cat-card ${!currentCat ? 'active' : ''}`}
        >
          <div className="uber-cat-icon-wrapper uber-cat-all-gradient">
            <Grid size={32} className="uber-cat-icon" />
            <span className="uber-emoji-floating">✨</span>
          </div>
          <div className="uber-cat-meta">
            <span className="uber-cat-name">All Services</span>
            <span className="uber-cat-sub font-mono">View All</span>
          </div>
        </button>

        {/* Dynamic Categories from DB or Config */}
        {categories.map((cat) => {
          const config = CATEGORY_VISUALS[cat.slug] || {
            emoji: '🛠️',
            iconComponent: Hammer,
            gradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
            glowColor: 'rgba(75, 108, 183, 0.35)',
            sublabel: cat.name,
          };
          const IconComp = config.iconComponent;
          const isSelected = currentCat === cat.slug;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryClick(cat.slug)}
              className={`uber-cat-card ${isSelected ? 'active' : ''}`}
              style={{
                '--glow-color': config.glowColor,
              } as React.CSSProperties}
            >
              <div
                className="uber-cat-icon-wrapper"
                style={{ background: config.gradient }}
              >
                <IconComp size={30} className="uber-cat-icon" />
                <span className="uber-emoji-floating">{config.emoji}</span>
              </div>
              <div className="uber-cat-meta">
                <span className="uber-cat-name">{cat.name}</span>
                <span className="uber-cat-sub">{config.sublabel}</span>
              </div>
              {isSelected && <CheckCircle2 size={16} className="uber-cat-check" />}
            </button>
          );
        })}
      </div>

      {/* Quick Filter Pills (Uber Eats Style) */}
      <div className="uber-pills-bar">
        <button
          type="button"
          onClick={() => handleFilterPill('all')}
          className={`uber-pill ${!currentCat && !currentRating && !currentFilter ? 'active' : ''}`}
        >
          <Grid size={15} /> All Services
        </button>

        <button
          type="button"
          onClick={() => handleFilterPill('today')}
          className={`uber-pill ${currentFilter === 'today' ? 'active' : ''}`}
        >
          <Clock size={15} className="text-amber-500" /> ⚡ Same Day / Express
        </button>

        <button
          type="button"
          onClick={() => handleFilterPill('rating', '4.5')}
          className={`uber-pill ${currentRating === '4.5' ? 'active' : ''}`}
        >
          <Star size={15} className="text-yellow-400 fill-yellow-400" /> ⭐ 4.5+ Top Rated
        </button>

        <button
          type="button"
          onClick={() => handleFilterPill('verified')}
          className={`uber-pill ${currentFilter === 'verified' ? 'active' : ''}`}
        >
          <ShieldCheck size={15} className="text-emerald-500" /> 🛡️ Verified Pros
        </button>

        <button
          type="button"
          onClick={() => handleFilterPill('offer')}
          className={`uber-pill ${currentFilter === 'offer' ? 'active' : ''}`}
        >
          <Tag size={15} className="text-rose-500" /> 🏷️ Special Offers
        </button>
      </div>
    </div>
  );
}

export default function ServiceCategoryShowcase(props: ServiceCategoryShowcaseProps) {
  return (
    <React.Suspense fallback={null}>
      <ServiceCategoryShowcaseContent {...props} />
    </React.Suspense>
  );
}

