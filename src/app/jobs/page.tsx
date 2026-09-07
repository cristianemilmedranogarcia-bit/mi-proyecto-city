import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import JobCard from '@/components/JobCard';
import FilterSidebar from './FilterSidebar';
import { Search, MapPin, Briefcase } from 'lucide-react';

export const revalidate = 300;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    type?: string;
    schedule?: string;
    remote?: string;
    company?: string;
    lang?: string;
    sort?: string;
    state?: string;
    city?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const user = await getCurrentUser();

  const q = resolvedParams.q || '';
  const cat = resolvedParams.cat || '';
  const type = resolvedParams.type || '';
  const schedule = resolvedParams.schedule || '';
  const remote = resolvedParams.remote || '';
  const company = resolvedParams.company || '';
  const lang = resolvedParams.lang || '';
  const sort = resolvedParams.sort || 'newest';
  const state = resolvedParams.state || 'CT';
  const city = resolvedParams.city || 'All Connecticut';

  const whereClause: any = { status: 'active' };

  if (city && !city.startsWith('All') && city !== 'All Cities') {
    whereClause.location = {
      city: {
        name: { contains: city, mode: 'insensitive' }
      }
    };
  }

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { requirements: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (lang) {
    const langFilters = [];
    if (lang === 'spanish') {
      langFilters.push(
        { description: { contains: 'Spanish' } },
        { requirements: { contains: 'Spanish' } },
        { description: { contains: 'español' } },
        { requirements: { contains: 'español' } },
        { title: { contains: 'Spanish' } }
      );
    } else if (lang === 'bilingual') {
      langFilters.push(
        { description: { contains: 'Bilingual' } },
        { requirements: { contains: 'Bilingual' } },
        { description: { contains: 'bilingüe' } },
        { title: { contains: 'Bilingual' } }
      );
    } else if (lang === 'english') {
      langFilters.push(
        { description: { contains: 'English' } },
        { requirements: { contains: 'English' } },
        { title: { contains: 'English' } }
      );
    }
    if (whereClause.OR) {
      whereClause.AND = [{ OR: whereClause.OR }, { OR: langFilters }];
      delete whereClause.OR;
    } else {
      whereClause.OR = langFilters;
    }
  }

  if (company) {
    whereClause.business = { name: { contains: company } };
  }

  if (cat) {
    whereClause.category = { slug: cat };
  }

  if (type) {
    whereClause.employmentType = type;
  }

  if (schedule) {
    whereClause.schedule = schedule;
  }

  if (remote) {
    whereClause.isRemote = remote;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'salary_high') {
    orderBy = { salaryMin: 'desc' };
  }

  const [jobs, categories] = await Promise.all([
    prisma.job.findMany({
      where: whereClause,
      include: {
        business: { include: { location: { include: { city: true } } } },
        category: true,
        location: { include: { city: true } },
      },
      orderBy,
    }),
    prisma.jobCategory.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  let savedJobIds: string[] = [];
  let appliedJobIds: string[] = [];
  if (user) {
    const [sj, aj] = await Promise.all([
      prisma.savedJob.findMany({ where: { userId: user.id }, select: { jobId: true } }),
      prisma.jobApplication.findMany({ where: { applicantId: user.id }, select: { jobId: true } }),
    ]);
    savedJobIds = sj.map((i) => i.jobId);
    appliedJobIds = aj.map((i) => i.jobId);
  }

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase' }}>
            <Briefcase size={16} /> Job Search Engine
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>
            Local Jobs in {city.startsWith('All') ? (city.replace('All ', '') || state) : `${city}, ${state}`}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Showing {jobs.length} active positions matching your criteria
          </p>
        </div>

        {/* Filter Layout */}
        <div className="filter-layout">
          <FilterSidebar categories={categories} currentParams={resolvedParams} />

          <div>
            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Search size={28} />
                </div>
                <h3>Nothing matched your search</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '1rem' }}>
                  Try clearing some filters or expanding your search terms.
                </p>
                <a href={`/jobs?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`} className="btn btn-outline btn-sm">
                  Clear All Filters
                </a>
              </div>
            ) : (
              <div className="grid-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} isSaved={savedJobIds.includes(job.id)} isApplied={appliedJobIds.includes(job.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
