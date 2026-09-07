'use client';

import React, { useState } from 'react';
import JobCard from '@/components/JobCard';
import ServiceCard from '@/components/ServiceCard';
import ItemCard from '@/components/ItemCard';
import { Bookmark } from 'lucide-react';

interface SavedTabsViewProps {
  jobs: any[];
  services: any[];
  items: any[];
  appliedJobIds?: string[];
}

export default function SavedTabsView({ jobs, services, items, appliedJobIds = [] }: SavedTabsViewProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'services' | 'items'>('jobs');

  return (
    <div>
      <div className="search-tabs" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`search-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Saved Jobs ({jobs.length})
        </button>
        <button
          className={`search-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Saved Services ({services.length})
        </button>
        <button
          className={`search-tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Saved Items ({items.length})
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Bookmark size={28} />
              </div>
              <h3>No saved jobs yet</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Bookmark jobs while searching to review later.
              </p>
            </div>
          ) : (
            <div className="grid-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} isSaved={true} isApplied={appliedJobIds.includes(job.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          {services.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Bookmark size={28} />
              </div>
              <h3>No saved services yet</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Save service providers to request quotes when needed.
              </p>
            </div>
          ) : (
            <div className="grid-2">
              {services.map((srv) => (
                <ServiceCard key={srv.id} service={srv} isSaved={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'items' && (
        <div>
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Bookmark size={28} />
              </div>
              <h3>No saved marketplace items yet</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Bookmark items for sale while browsing the marketplace.
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {items.map((itm) => (
                <ItemCard key={itm.id} item={itm} isSaved={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
