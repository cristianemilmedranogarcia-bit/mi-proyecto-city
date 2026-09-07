import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import ServiceCard from '@/components/ServiceCard';
import ServiceFilterSidebar from './ServiceFilterSidebar';
import ServiceCategoryShowcase from './ServiceCategoryShowcase';
import { Search } from 'lucide-react';

export const revalidate = 60;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    rating?: string;
    filter?: string;
    lang?: string;
    state?: string;
    city?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const user = await getCurrentUser();

  const q = resolvedParams.q || '';
  const cat = resolvedParams.cat || '';
  const rating = resolvedParams.rating || '';
  const filter = resolvedParams.filter || '';
  const lang = resolvedParams.lang || '';
  const state = resolvedParams.state || 'CT';
  const city = resolvedParams.city || 'All Connecticut';

  const whereClause: any = { isActive: true };

  if (city && !city.startsWith('All') && city !== 'All Cities') {
    whereClause.location = {
      city: {
        name: { contains: city, mode: 'insensitive' }
      }
    };
  }

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { provider: { name: { contains: q, mode: 'insensitive' } } },
    ];
  }

  if (lang) {
    const langFilters = [];
    if (lang === 'spanish') {
      langFilters.push(
        { description: { contains: 'Spanish' } },
        { description: { contains: 'español' } },
        { name: { contains: 'Spanish' } },
        { name: { contains: 'español' } }
      );
    } else if (lang === 'bilingual') {
      langFilters.push(
        { description: { contains: 'Bilingual' } },
        { description: { contains: 'bilingüe' } },
        { name: { contains: 'Bilingual' } }
      );
    } else if (lang === 'english') {
      langFilters.push(
        { description: { contains: 'English' } },
        { name: { contains: 'English' } }
      );
    }
    if (whereClause.OR) {
      whereClause.AND = [{ OR: whereClause.OR }, { OR: langFilters }];
      delete whereClause.OR;
    } else {
      whereClause.OR = langFilters;
    }
  }

  if (cat) {
    whereClause.category = { slug: cat };
  }

  if (rating) {
    whereClause.rating = { gte: parseFloat(rating) };
  }

  if (filter === 'verified') {
    whereClause.provider = { isVerified: true };
  }

  const services = await prisma.service.findMany({
    where: whereClause,
    include: {
      provider: true,
      category: true,
      location: { include: { city: true } },
    },
    orderBy: { rating: 'desc' },
  });

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { name: 'asc' },
  });

  let savedServiceIds: string[] = [];
  if (user) {
    const ss = await prisma.savedService.findMany({ where: { userId: user.id }, select: { serviceId: true } });
    savedServiceIds = ss.map((i) => i.serviceId);
  }

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        {/* Uber Eats Style Category Showcase Header & Icons Bar */}
        <ServiceCategoryShowcase categories={categories} />

        <div className="filter-layout">
          <ServiceFilterSidebar categories={categories} currentParams={resolvedParams} />

          <div>
            {services.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Search size={28} />
                </div>
                <h3>No services matched your search</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '1rem' }}>
                  Try resetting your category or rating filters.
                </p>
                <a href={`/services?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`} className="btn btn-outline btn-sm">
                  Clear Filters
                </a>
              </div>
            ) : (
              <div className="grid-2">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} isSaved={savedServiceIds.includes(service.id)} />
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
