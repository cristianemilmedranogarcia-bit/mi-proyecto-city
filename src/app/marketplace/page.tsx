import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import ItemCard from '@/components/ItemCard';
import MarketplaceFilterSidebar from './MarketplaceFilterSidebar';
import { ShoppingBag, Search } from 'lucide-react';

export const revalidate = 60;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    cond?: string;
    minPrice?: string;
    maxPrice?: string;
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
  const cond = resolvedParams.cond || '';
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;
  const lang = resolvedParams.lang || '';
  const sort = resolvedParams.sort || 'newest';
  const state = resolvedParams.state || 'CT';
  const city = resolvedParams.city || 'All Connecticut';

  const whereClause: any = { status: 'AVAILABLE' };

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
      { seller: { name: { contains: q, mode: 'insensitive' } } },
    ];
  }

  if (lang) {
    const langFilters = [];
    if (lang === 'spanish') {
      langFilters.push(
        { description: { contains: 'Spanish' } },
        { description: { contains: 'español' } },
        { title: { contains: 'Spanish' } }
      );
    } else if (lang === 'bilingual') {
      langFilters.push(
        { description: { contains: 'Bilingual' } },
        { title: { contains: 'Bilingual' } }
      );
    } else if (lang === 'english') {
      langFilters.push(
        { description: { contains: 'English' } },
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

  if (cat) {
    whereClause.category = { slug: cat };
  }

  if (cond) {
    whereClause.condition = cond;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) whereClause.price.gte = minPrice;
    if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  const items = await prisma.marketplaceItem.findMany({
    where: whereClause,
    include: {
      seller: true,
      category: true,
      location: { include: { city: true } },
    },
    orderBy,
  });

  const categories = await prisma.marketplaceCategory.findMany({
    orderBy: { name: 'asc' },
  });

  let savedItemIds: string[] = [];
  if (user) {
    const si = await prisma.savedItem.findMany({ where: { userId: user.id }, select: { itemId: true } });
    savedItemIds = si.map((i) => i.itemId);
  }

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase' }}>
            <ShoppingBag size={16} /> Local Buy & Sell Marketplace
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>
            Marketplace Items in {city.startsWith('All') ? (city.replace('All ', '') || state) : `${city}, ${state}`}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Showing {items.length} local items for sale from neighbors and local sellers
          </p>
        </div>

        <div className="filter-layout">
          <MarketplaceFilterSidebar categories={categories} currentParams={resolvedParams} />

          <div>
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Search size={28} />
                </div>
                <h3>No marketplace items matched your search</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '1rem' }}>
                  Try resetting your category or price filters.
                </p>
                <a href={`/marketplace?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`} className="btn btn-outline btn-sm">
                  Clear All Filters
                </a>
              </div>
            ) : (
              <div className="grid-3">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} isSaved={savedItemIds.includes(item.id)} />
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
