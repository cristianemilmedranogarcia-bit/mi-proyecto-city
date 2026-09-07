import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetType, targetId, reason, details } = await request.json();

    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: 'Missing report parameters' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: session.userId,
        targetType,
        targetId,
        reason,
        details: details || null,
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit report' }, { status: 500 });
  }
}
