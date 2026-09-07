import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, sellerId, offerAmount, message } = await request.json();

    if (!itemId || !sellerId || offerAmount === undefined) {
      return NextResponse.json({ error: 'Missing offer parameters' }, { status: 400 });
    }

    const offer = await prisma.itemOffer.create({
      data: {
        itemId,
        sellerId,
        buyerId: session.userId,
        offerAmount: parseFloat(offerAmount),
        message: message || null,
        status: 'PENDING',
      },
      include: { item: true },
    });

    // Notify seller
    await prisma.notification.create({
      data: {
        userId: sellerId,
        type: 'item_offer',
        title: 'New Offer Received!',
        message: `Someone offered $${offerAmount} for your item "${offer.item.title}".`,
        link: '/seller/dashboard',
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit offer' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { offerId, status } = await request.json();
    const validStatuses = ['PENDING', 'ACCEPTED', 'DECLINED', 'COUNTERED'];

    if (!offerId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const updatedOffer = await prisma.itemOffer.update({
      where: { id: offerId },
      data: { status },
      include: { item: true },
    });

    // Notify buyer
    await prisma.notification.create({
      data: {
        userId: updatedOffer.buyerId,
        type: 'item_offer',
        title: `Offer Update: ${status}`,
        message: `Your offer for "${updatedOffer.item.title}" was ${status}.`,
        link: '/messages',
      },
    });

    return NextResponse.json({ success: true, offer: updatedOffer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update offer' }, { status: 500 });
  }
}
