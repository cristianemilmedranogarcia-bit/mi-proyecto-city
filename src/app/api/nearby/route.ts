import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getHaversineDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Norwalk: { lat: 41.1177, lng: -73.4079 },
  Stamford: { lat: 41.0534, lng: -73.5387 },
  Greenwich: { lat: 41.0262, lng: -73.6282 },
  Danbury: { lat: 41.3948, lng: -73.4540 },
  Hartford: { lat: 41.7658, lng: -72.6734 },
  'New Haven': { lat: 41.3083, lng: -72.9279 },
  'New York City': { lat: 40.7128, lng: -74.0060 },
  Brooklyn: { lat: 40.6782, lng: -73.9442 },
  Queens: { lat: 40.7282, lng: -73.7949 },
  Albany: { lat: 42.6526, lng: -73.7562 },
  Newark: { lat: 40.7357, lng: -74.1724 },
  Phoenix: { lat: 33.4484, lng: -112.0740 },
  Miami: { lat: 25.7617, lng: -80.1918 },
  Boston: { lat: 42.3601, lng: -71.0589 },
  Austin: { lat: 30.2672, lng: -97.7431 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get('city') || 'Norwalk';
    const stateCode = searchParams.get('state') || 'CT';
    const type = searchParams.get('type') || 'ALL'; // ALL, JOBS, SERVICES, MARKETPLACE
    const search = searchParams.get('search')?.toLowerCase() || '';
    const radiusMiles = parseFloat(searchParams.get('radius') || '25');
    const sortBy = searchParams.get('sortBy') || 'closest'; // closest, newest, salary, rating, price

    // Target center coordinates
    const cityCoords = CITY_COORDINATES[cityName] || { lat: 41.1177, lng: -73.4079 };
    const centerLat = parseFloat(searchParams.get('lat') || cityCoords.lat.toString());
    const centerLng = parseFloat(searchParams.get('lng') || cityCoords.lng.toString());

    let results: any[] = [];

    // 1. Fetch Jobs if applicable
    if (type === 'ALL' || type === 'JOBS') {
      const jobs = await prisma.job.findMany({
        where: { status: 'active' },
        include: {
          business: true,
          category: true,
          location: { include: { city: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      jobs.forEach((job, idx) => {
        const itemLat = job.location?.lat || centerLat + (idx % 3 === 0 ? 0.012 : idx % 3 === 1 ? -0.015 : 0.008);
        const itemLng = job.location?.lng || centerLng + (idx % 2 === 0 ? -0.014 : 0.011);
        const distance = getHaversineDistanceMiles(centerLat, centerLng, itemLat, itemLng);

        // Filter by radius & search term
        const matchesSearch =
          !search ||
          job.title.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search) ||
          job.category.name.toLowerCase().includes(search) ||
          (job.business?.name && job.business.name.toLowerCase().includes(search));

        if (distance <= radiusMiles && matchesSearch) {
          results.push({
            id: job.id,
            type: 'JOB',
            title: job.title,
            subtitle: job.business?.name || 'Local Business',
            category: job.category.name,
            description: job.description,
            salary: job.salaryMin ? `$${job.salaryMin}${job.salaryMax ? `–$${job.salaryMax}` : ''}/${job.salaryType === 'hourly' ? 'hr' : 'yr'}` : null,
            employmentType: job.employmentType,
            locationText: job.location?.neighborhood ? `${job.location.neighborhood}, ${cityName} ${stateCode}` : `${cityName}, ${stateCode}`,
            distance,
            lat: itemLat,
            lng: itemLng,
            logoUrl: job.business?.logoUrl || null,
            isVerified: job.business?.isVerified || false,
            link: `/jobs/${job.id}`,
            createdAt: job.createdAt,
            rawSalary: job.salaryMin || 0,
          });
        }
      });
    }

    // 2. Fetch Services if applicable
    if (type === 'ALL' || type === 'SERVICES') {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        include: {
          provider: true,
          category: true,
          location: { include: { city: true } },
        },
        orderBy: { rating: 'desc' },
      });

      services.forEach((service, idx) => {
        const itemLat = service.location?.lat || centerLat + (idx % 2 === 0 ? -0.018 : 0.014);
        const itemLng = service.location?.lng || centerLng + (idx % 3 === 0 ? 0.016 : -0.009);
        const distance = getHaversineDistanceMiles(centerLat, centerLng, itemLat, itemLng);

        const matchesSearch =
          !search ||
          service.name.toLowerCase().includes(search) ||
          service.description.toLowerCase().includes(search) ||
          service.category.name.toLowerCase().includes(search) ||
          service.provider.name.toLowerCase().includes(search);

        if (distance <= radiusMiles && matchesSearch) {
          results.push({
            id: service.id,
            type: 'SERVICE',
            title: service.name,
            subtitle: service.provider.name,
            category: service.category.name,
            description: service.description,
            price: service.priceAmount ? `From $${service.priceAmount}` : 'Contact for Quote',
            rating: service.rating,
            reviewCount: service.reviewCount,
            locationText: service.location?.neighborhood ? `Serves ${service.location.neighborhood} & surrounding areas` : `Serves ${cityName} & surrounding areas`,
            distance,
            lat: itemLat,
            lng: itemLng,
            avatarUrl: service.provider.avatarUrl || null,
            isVerified: service.provider.isVerified || false,
            link: `/services/${service.id}`,
            createdAt: service.createdAt,
            rawRating: service.rating || 0,
          });
        }
      });
    }

    // 3. Fetch Marketplace Items if applicable
    if (type === 'ALL' || type === 'MARKETPLACE') {
      const items = await prisma.marketplaceItem.findMany({
        where: { status: 'AVAILABLE' },
        include: {
          seller: true,
          category: true,
          location: { include: { city: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      items.forEach((item, idx) => {
        const itemLat = item.location?.lat || centerLat + (idx % 4 === 0 ? 0.021 : idx % 2 === 0 ? -0.011 : 0.018);
        const itemLng = item.location?.lng || centerLng + (idx % 3 === 0 ? -0.022 : 0.015);
        const distance = getHaversineDistanceMiles(centerLat, centerLng, itemLat, itemLng);

        let parsedImages: string[] = [];
        try { parsedImages = JSON.parse(item.images || '[]'); } catch (e) {}

        const matchesSearch =
          !search ||
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.category.name.toLowerCase().includes(search) ||
          item.seller.name.toLowerCase().includes(search);

        if (distance <= radiusMiles && matchesSearch) {
          results.push({
            id: item.id,
            type: 'MARKETPLACE',
            title: item.title,
            subtitle: `Sold by ${item.seller.name}`,
            category: item.category.name,
            description: item.description,
            price: item.price === 0 ? 'FREE' : `$${item.price.toFixed(0)}`,
            condition: item.condition.replace('_', ' '),
            locationText: item.location?.neighborhood ? `${item.location.neighborhood}, ${cityName}` : `${cityName}, ${stateCode}`,
            distance,
            lat: itemLat,
            lng: itemLng,
            imageUrl: parsedImages[0] || null,
            isVerified: item.seller.isVerified || false,
            link: `/marketplace/${item.id}`,
            createdAt: item.createdAt,
            rawPrice: item.price,
          });
        }
      });
    }

    // 4. Sorting logic
    if (sortBy === 'closest') {
      results.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'salary') {
      results.sort((a, b) => (b.rawSalary || 0) - (a.rawSalary || 0));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => (b.rawRating || 0) - (a.rawRating || 0));
    } else if (sortBy === 'price_asc') {
      results.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => (b.rawPrice || 0) - (a.rawPrice || 0));
    }

    return NextResponse.json({
      center: cityCoords,
      cityName,
      stateCode,
      total: results.length,
      radiusMiles,
      results,
    });
  } catch (error: any) {
    console.error('Error fetching nearby data:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby listings' }, { status: 500 });
  }
}
