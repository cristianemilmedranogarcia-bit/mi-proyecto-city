import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await request.json();
    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
    }

    const existing = await prisma.savedItem.findFirst({
      where: { userId: session.userId, itemId },
    });

    if (existing) {
      await prisma.savedItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedItem.create({
        data: { userId: session.userId, itemId },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Save item toggle failed' }, { status: 500 });
  }
}
