import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerQuotes = await prisma.quoteRequest.findMany({
      where: { customerId: session.userId },
      include: {
        service: true,
        provider: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const providerQuotes = await prisma.quoteRequest.findMany({
      where: { providerId: session.userId },
      include: {
        service: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ customerQuotes, providerQuotes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceId, providerId, description, budget, preferredDate, preferredTime, locationDescription } =
      await request.json();

    if (!serviceId || !providerId || !description) {
      return NextResponse.json({ error: 'Missing required quote details' }, { status: 400 });
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        customerId: session.userId,
        providerId,
        serviceId,
        description,
        budget: budget ? parseFloat(budget) : null,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        locationDescription: locationDescription || null,
        status: 'PENDING',
      },
      include: {
        service: true,
      },
    });

    // Send notification to service provider
    await prisma.notification.create({
      data: {
        userId: providerId,
        type: 'quote_request',
        title: 'New Service Quote Requested',
        message: `A customer requested a quote for "${quote.service.name}".`,
        link: '/provider/dashboard',
      },
    });

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to request quote' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quoteId, status, quoteAmount, quoteNotes } = await request.json();
    const validStatuses = ['PENDING', 'ACCEPTED', 'DECLINED', 'QUOTED', 'COMPLETED'];

    if (!quoteId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const updatedQuote = await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: {
        status,
        quoteAmount: quoteAmount ? parseFloat(quoteAmount) : undefined,
        quoteNotes: quoteNotes || undefined,
      },
      include: { service: true },
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: updatedQuote.customerId,
        type: 'quote_request',
        title: `Quote Update: ${status}`,
        message: `Your quote request for "${updatedQuote.service.name}" was updated to ${status}.`,
        link: '/messages',
      },
    });

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Quote update failed' }, { status: 500 });
  }
}
