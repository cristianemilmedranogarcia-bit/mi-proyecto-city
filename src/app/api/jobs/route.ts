import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || '';
    const type = searchParams.get('type') || '';
    const schedule = searchParams.get('schedule') || '';
    const remote = searchParams.get('remote') || '';
    const city = searchParams.get('city') || 'Norwalk';
    const sort = searchParams.get('sort') || 'newest';

    const whereClause: any = {
      status: 'active',
    };

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { requirements: { contains: q } },
        { business: { name: { contains: q } } },
      ];
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

    if (city) {
      whereClause.location = {
        city: { name: city },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'salary_high') {
      orderBy = { salaryMin: 'desc' };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        business: true,
        category: true,
        location: { include: { city: true } },
      },
      orderBy,
    });

    const categories = await prisma.jobCategory.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ jobs, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch jobs' }, { status: 500 });
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
      title,
      categoryId,
      description,
      responsibilities,
      requirements,
      benefits,
      galleryImages,
      salaryMin,
      salaryMax,
      salaryType,
      employmentType,
      schedule,
      experienceLevel,
      isRemote,
      languages,
      businessId,
    } = body;

    if (!title || !categoryId || !description) {
      return NextResponse.json({ error: 'Missing title, category, or description' }, { status: 400 });
    }

    // Verification check for EMPLOYER users posting jobs
    if (session.role === 'EMPLOYER') {
      const biz = await prisma.business.findFirst({ where: { ownerId: session.userId } });
      if (!biz) {
        return NextResponse.json({ error: 'Please complete your business profile before posting jobs.' }, { status: 400 });
      }
      if (!biz.isVerified) {
        return NextResponse.json(
          { error: 'Your business account is pending administrator verification. Once an administrator approves your business profile in the admin portal, you will be able to post jobs.' },
          { status: 403 }
        );
      }
    }

    // Default location to Norwalk
    const city = await prisma.city.findFirst({ where: { name: 'Norwalk' } });
    const location = await prisma.location.findFirst({ where: { cityId: city?.id } });

    const job = await prisma.job.create({
      data: {
        postedById: session.userId,
        businessId: businessId || null,
        title,
        categoryId,
        description,
        responsibilities,
        requirements,
        benefits,
        galleryImages: typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages || []),
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        salaryType: salaryType || 'hourly',
        employmentType: employmentType || 'full-time',
        schedule: schedule || 'flexible',
        experienceLevel: experienceLevel || 'entry',
        isRemote: isRemote || 'onsite',
        languages: languages || 'English Required',
        status: 'active',
        locationId: location?.id,
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create job' }, { status: 500 });
  }
}
