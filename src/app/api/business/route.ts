import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find business owned by user
    const business = await prisma.business.findFirst({
      where: { ownerId: session.userId },
      include: { location: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      phone,
      email,
      website,
      logoUrl,
      addressLine,
      neighborhood,
    } = body;

    // Handle location update/creation
    let locationId = business.locationId;
    if (addressLine !== undefined || neighborhood !== undefined) {
      if (business.locationId) {
        await prisma.location.update({
          where: { id: business.locationId },
          data: {
            addressLine: addressLine !== undefined ? addressLine : undefined,
            neighborhood: neighborhood !== undefined ? neighborhood : undefined,
          },
        });
      } else {
        const city = await prisma.city.findFirst({ where: { name: 'Norwalk' } });
        if (!city) {
          return NextResponse.json({ error: 'Default city not found' }, { status: 500 });
        }
        const newLocation = await prisma.location.create({
          data: {
            addressLine: addressLine || 'Downtown Norwalk',
            neighborhood: neighborhood || 'Downtown Norwalk',
            cityId: city.id,
          },
        });
        locationId = newLocation.id;
      }
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: business.id },
      data: {
        name: name || business.name,
        description: description !== undefined ? description : business.description,
        category: category || business.category,
        phone: phone !== undefined ? phone : business.phone,
        email: email !== undefined ? email : business.email,
        website: website !== undefined ? website : business.website,
        logoUrl: logoUrl !== undefined ? logoUrl : business.logoUrl,
        locationId,
      },
      include: {
        location: {
          include: {
            city: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, business: updatedBusiness });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update business profile' }, { status: 500 });
  }
}
