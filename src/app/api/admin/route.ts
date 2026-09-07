import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { action, targetId, data } = await request.json();

    if (action === 'verify_business') {
      await prisma.business.update({
        where: { id: targetId },
        data: { isVerified: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'verify_user') {
      await prisma.user.update({
        where: { id: targetId },
        data: { isVerified: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_job') {
      await prisma.job.delete({ where: { id: targetId } });
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_service') {
      await prisma.service.delete({ where: { id: targetId } });
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_marketplace_item') {
      await prisma.marketplaceItem.delete({ where: { id: targetId } });
      return NextResponse.json({ success: true });
    }

    if (action === 'resolve_report') {
      await prisma.report.update({
        where: { id: targetId },
        data: { status: 'resolved' },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'add_city') {
      const { name, state, zipCodes, lat, lng } = data;
      const city = await prisma.city.create({
        data: {
          name,
          state: state || 'CT',
          zipCodes: zipCodes || '',
          lat: parseFloat(lat || '41.1'),
          lng: parseFloat(lng || '-73.4'),
          isActive: true,
        },
      });
      return NextResponse.json({ success: true, city });
    }

    return NextResponse.json({ error: 'Unknown admin action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Admin action failed' }, { status: 500 });
  }
}
