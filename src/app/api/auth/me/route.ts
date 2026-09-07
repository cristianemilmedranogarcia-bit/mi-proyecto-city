import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Get unread counts
    const unreadNotifications = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    const unreadMessages = await prisma.message.count({
      where: {
        isRead: false,
        conversation: {
          OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
        },
        senderId: { not: user.id },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeRole: user.activeRole,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        phone: user.phone,
        isVerified: user.isVerified,
        location: user.location,
        businesses: (user as any).businesses || [],
        business: (user as any).businesses?.[0] || null,
      },
      unreadNotifications,
      unreadMessages,
    });
  } catch (error: any) {
    return NextResponse.json({ user: null });
  }
}
