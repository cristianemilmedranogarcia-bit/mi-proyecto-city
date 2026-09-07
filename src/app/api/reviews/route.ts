import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceId, providerId, rating, comment } = await request.json();

    if (!serviceId || !providerId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    if (session.userId === providerId) {
      return NextResponse.json({ error: 'You cannot write a review for your own service' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        serviceId,
        providerId,
        reviewerId: session.userId,
        rating: parseInt(rating),
        comment,
      },
    });

    // Update service average rating
    const allReviews = await prisma.review.findMany({
      where: { serviceId },
    });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.service.update({
      where: { id: serviceId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
