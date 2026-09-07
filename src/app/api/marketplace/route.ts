import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || '';
    const cond = searchParams.get('cond') || '';

    const whereClause: any = { status: 'AVAILABLE' };

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { seller: { name: { contains: q } } },
      ];
    }

    if (cat) {
      whereClause.category = { slug: cat };
    }

    if (cond) {
      whereClause.condition = cond;
    }

    const items = await prisma.marketplaceItem.findMany({
      where: whereClause,
      include: {
        seller: true,
        category: true,
        location: { include: { city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.marketplaceCategory.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ items, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, categoryId, description, price, condition, images } = body;

    if (!title || !categoryId || !description) {
      return NextResponse.json({ error: 'Missing required item details' }, { status: 400 });
    }

    const city = await prisma.city.findFirst({ where: { name: 'Norwalk' } });
    const location = await prisma.location.findFirst({ where: { cityId: city?.id } });

    const item = await prisma.marketplaceItem.create({
      data: {
        sellerId: session.userId,
        title,
        categoryId,
        description,
        price: parseFloat(price || '0'),
        condition: condition || 'GOOD',
        images: images ? JSON.stringify(images) : '[]',
        status: 'AVAILABLE',
        locationId: location?.id,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list item' }, { status: 500 });
  }
}
