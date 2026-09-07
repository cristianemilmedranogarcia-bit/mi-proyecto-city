import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import SearchHero from '@/components/SearchHero';
import JobCard from '@/components/JobCard';
import ServiceCard from '@/components/ServiceCard';
import ItemCard from '@/components/ItemCard';
import ScrollReveal from '@/components/ScrollReveal';
import { Briefcase, Wrench, ShoppingBag, Building2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const revalidate = 300;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ city?: string; state?: string }> }) {
  const resolvedParams = await searchParams;
  const user = await getCurrentUser();
  const selectedCityName = resolvedParams?.city || 'All Connecticut';
  const selectedStateCode = resolvedParams?.state || 'CT';

  let jobs: any[] = [];
  let services: any[] = [];
  let items: any[] = [];
  let businesses: any[] = [];

  let savedJobIds: string[] = [];
  let savedServiceIds: string[] = [];
  let savedItemIds: string[] = [];
  let appliedJobIds: string[] = [];

  try {
    const isAll = selectedCityName.startsWith('All');
    const city = !isAll ? await prisma.city.findFirst({
      where: { name: selectedCityName },
    }) : null;

    const locationFilter = isAll ? {} : (city?.id ? { location: { cityId: city.id } } : {});

    jobs = await prisma.job.findMany({
      where: { status: 'active', ...locationFilter },
      include: {
        business: true,
        category: true,
        location: { include: { city: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    services = await prisma.service.findMany({
      where: { isActive: true, ...locationFilter },
      include: {
        provider: true,
        category: true,
        location: { include: { city: true } },
      },
      orderBy: { rating: 'desc' },
      take: 6,
    });

    items = await prisma.marketplaceItem.findMany({
      where: { status: 'AVAILABLE', ...locationFilter },
      include: {
        seller: true,
        category: true,
        location: { include: { city: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    businesses = await prisma.business.findMany({
      take: 4,
      include: { location: { include: { city: true } } },
    });

    if (user) {
      const sj = await prisma.savedJob.findMany({ where: { userId: user.id }, select: { jobId: true } });
      const ss = await prisma.savedService.findMany({ where: { userId: user.id }, select: { serviceId: true } });
      const si = await prisma.savedItem.findMany({ where: { userId: user.id }, select: { itemId: true } });
      const aj = await prisma.jobApplication.findMany({ where: { applicantId: user.id }, select: { jobId: true } });
      savedJobIds = sj.map((item) => item.jobId);
      savedServiceIds = ss.map((item) => item.serviceId);
      savedItemIds = si.map((item) => item.itemId);
      appliedJobIds = aj.map((item) => item.jobId);
    }
  } catch (err) {
    console.error('HomePage data fetch error:', err);
  }

  return (
    <>
      <Navbar currentUser={user} />
      <main>
        {/* Search Hero */}
        <SearchHero
          user={user}
          cityName={selectedCityName}
          stateCode={selectedStateCode}
          latestJob={jobs?.[0]}
          latestService={services?.[0]}
          latestItem={items?.[0]}
        />

        {/* Personalized Welcome Banner if Logged In */}
        {user && (
          <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1.25rem 0' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase' }}>
                  Local Dashboard Summary
                </span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '0.1rem' }}>
                  Welcome back, {user.name.split(' ')[0]} ({user.activeRole.replace('_', ' ')})
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {user.activeRole === 'JOB_SEEKER' && (
                  <Link href="/applications" className="btn btn-outline btn-sm">
                    Track My Applications
                  </Link>
                )}
                {user.activeRole === 'EMPLOYER' && (
                  <Link href="/employer/dashboard" className="btn btn-dark btn-sm">
                    Manage Employer Jobs
                  </Link>
                )}
                {user.activeRole === 'SERVICE_PROVIDER' && (
                  <Link href="/provider/dashboard" className="btn btn-dark btn-sm">
                    View Quote Requests
                  </Link>
                )}
                {user.activeRole === 'SELLER' && (
                  <Link href="/seller/dashboard" className="btn btn-dark btn-sm">
                    Seller Dashboard
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}



        {/* Recent Jobs Section */}
        <section style={{ padding: '3.5rem 0 2.5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="studio-section-kicker">
                  <Briefcase size={14} /> Immediate Opportunities
                </span>
                <h2 className="section-title">Jobs Nearby in {selectedCityName}, CT</h2>
                <p className="section-subtitle">Real full-time, part-time, and skilled labor positions hiring today</p>
              </div>
              <Link href="/jobs" className="see-all-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>View all jobs ({jobs.length})</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="empty-state">
                <p>No job listings found in {selectedCityName} yet.</p>
              </div>
            ) : (
              <div className="grid-3">
                {jobs.map((job, idx) => (
                  <ScrollReveal key={job.id} delay={(idx % 3) * 90}>
                    <JobCard job={job} isSaved={savedJobIds.includes(job.id)} isApplied={appliedJobIds.includes(job.id)} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Local Buy & Sell Marketplace Section */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '3.5rem 0', borderTop: '1px solid #ece7df', borderBottom: '1px solid #ece7df' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="studio-section-kicker">
                  <ShoppingBag size={14} /> Buy & Sell Deals
                </span>
                <h2 className="section-title">Marketplace Items in {selectedCityName}</h2>
                <p className="section-subtitle">Electronics, furniture, vehicles, tools, and free local pickups from neighbors</p>
              </div>
              <Link href="/marketplace" className="see-all-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Explore all items ({items.length})</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="empty-state">
                <p>No marketplace items listed in {selectedCityName} yet.</p>
              </div>
            ) : (
              <div className="grid-4">
                {items.map((itm, idx) => (
                  <ScrollReveal key={itm.id} delay={(idx % 4) * 80}>
                    <ItemCard item={itm} isSaved={savedItemIds.includes(itm.id)} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Local Services Section */}
        <section style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="studio-section-kicker">
                  <Wrench size={14} /> Local Professionals
                </span>
                <h2 className="section-title">Top Rated Services in {selectedCityName}</h2>
                <p className="section-subtitle">Handymen, cleaners, plumbers, and independent local contractors</p>
              </div>
              <Link href="/services" className="see-all-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Explore all services</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-3">
              {services.map((service, idx) => (
                <ScrollReveal key={service.id} delay={(idx % 3) * 90}>
                  <ServiceCard service={service} isSaved={savedServiceIds.includes(service.id)} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Businesses Hiring */}
        <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #ece7df', padding: '3.5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="studio-section-kicker">
                  <Building2 size={14} /> Local Employers
                </span>
                <h2 className="section-title">Businesses Hiring in {selectedCityName}</h2>
                <p className="section-subtitle">Verified local employers actively seeking local talent</p>
              </div>
            </div>

            <div className="grid-2">
              {businesses.map((biz, idx) => (
                <ScrollReveal key={biz.id} delay={(idx % 2) * 110}>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '10px',
                        backgroundColor: '#F1F5F9',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      {biz.logoUrl ? (
                        <img src={biz.logoUrl} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building2 size={28} color="#64748B" />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontSize: '1.15rem' }}>{biz.name}</h3>
                        {biz.isVerified && <ShieldCheck size={18} color="#2563EB" />}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.6rem' }}>
                        {biz.category} · {biz.location?.neighborhood || selectedCityName}, CT
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {biz.description}
                      </p>
                      <Link href={`/jobs?company=${encodeURIComponent(biz.name)}`} className="btn btn-outline btn-sm">
                        View Open Jobs
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MobileNav />
    </>
  );
}
