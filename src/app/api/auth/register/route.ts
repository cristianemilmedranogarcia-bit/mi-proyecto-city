import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name, role, phone, businessDetails } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role || 'JOB_SEEKER';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: phone || null,
        role: assignedRole,
        activeRole: assignedRole,
      },
    });

    // If registering a Business Account, automatically create the Business entity
    if (assignedRole === 'EMPLOYER') {
      const bName = businessDetails?.name || 'Local Business';
      const bCategory = businessDetails?.category || 'General Business';
      const bDesc = businessDetails?.description || 'Local business serving Norwalk & Fairfield County.';
      const bCity = businessDetails?.city || 'Norwalk';
      const bNeighborhood = businessDetails?.neighborhood || 'South Norwalk (SoNo)';
      const bAddress = businessDetails?.address || '';
      const bPhone = businessDetails?.phone || phone || null;
      const bWebsite = businessDetails?.website || null;

      // Find or connect City
      const cityObj = await prisma.city.findFirst({
        where: { name: { contains: bCity } },
      });

      let locationId = null;
      if (cityObj) {
        const loc = await prisma.location.create({
          data: {
            cityId: cityObj.id,
            addressLine: bAddress || null,
            neighborhood: bNeighborhood,
            zipCode: '06854',
          },
        });
        locationId = loc.id;
      }

      await prisma.business.create({
        data: {
          ownerId: user.id,
          name: bName,
          category: bCategory,
          description: bDesc,
          phone: bPhone,
          website: bWebsite,
          email: email,
          logoUrl: businessDetails?.logoUrl || '/images/empanada_bakery.png',
          locationId: locationId,
        },
      });
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      activeRole: user.activeRole,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeRole: user.activeRole,
      },
    });

    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
