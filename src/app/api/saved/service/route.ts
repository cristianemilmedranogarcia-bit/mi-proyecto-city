import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceId } = await request.json();
    if (!serviceId) {
      return NextResponse.json({ error: 'Missing serviceId' }, { status: 400 });
    }

    const existing = await prisma.savedService.findFirst({
      where: { userId: session.userId, serviceId },
    });

    if (existing) {
      await prisma.savedService.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedService.create({
        data: { userId: session.userId, serviceId },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Save service toggle failed' }, { status: 500 });
  }
}
