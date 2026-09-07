import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || '';
    const rating = searchParams.get('rating') || '';

    const whereClause: any = { isActive: true };

    if (q) {
      whereClause.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { provider: { name: { contains: q } } },
      ];
    }

    if (cat) {
      whereClause.category = { slug: cat };
    }

    if (rating) {
      whereClause.rating = { gte: parseFloat(rating) };
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

    return NextResponse.json({ services, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      categoryId,
      description,
      pricingType,
      priceAmount,
      serviceAreaRadius,
      experienceYears,
      availability,
      portfolioImages,
    } = body;

    if (!name || !categoryId || !description) {
      return NextResponse.json({ error: 'Missing required service fields' }, { status: 400 });
    }

    const city = await prisma.city.findFirst({ where: { name: 'Norwalk' } });
    const location = await prisma.location.findFirst({ where: { cityId: city?.id } });

    const service = await prisma.service.create({
      data: {
        providerId: session.userId,
        name,
        categoryId,
        description,
        pricingType: pricingType || 'starting_at',
        priceAmount: priceAmount ? parseFloat(priceAmount) : null,
        serviceAreaRadius: serviceAreaRadius ? parseInt(serviceAreaRadius) : 10,
        experienceYears: experienceYears ? parseInt(experienceYears) : 1,
        availability: availability || 'Flexible',
        portfolioImages: portfolioImages ? JSON.stringify(portfolioImages) : '[]',
        locationId: location?.id,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: 500 });
  }
}
