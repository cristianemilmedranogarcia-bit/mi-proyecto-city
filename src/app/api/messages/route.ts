import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Mark messages as read
      await prisma.message.updateMany({
        where: { conversationId, senderId: { not: session.userId }, isRead: false },
        data: { isRead: true },
      });

      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: { sender: true },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json({ messages });
    }

    // Fetch user conversations
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: session.userId }, { participant2Id: session.userId }],
      },
      include: {
        participant1: true,
        participant2: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, conversationId: existingConvId, text, relatedType, relatedId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Message text cannot be empty' }, { status: 400 });
    }

    let convId = existingConvId;

    if (!convId) {
      if (!recipientId) {
        return NextResponse.json({ error: 'Recipient required' }, { status: 400 });
      }

      // Find or create conversation
      let conv = await prisma.conversation.findFirst({
        where: {
          OR: [
            { participant1Id: session.userId, participant2Id: recipientId },
            { participant1Id: recipientId, participant2Id: session.userId },
          ],
        },
      });

      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            participant1Id: session.userId,
            participant2Id: recipientId,
            relatedType: relatedType || null,
            relatedId: relatedId || null,
          },
        });
      }
      convId = conv.id;
    }

    const message = await prisma.message.create({
      data: {
        conversationId: convId,
        senderId: session.userId,
        text,
        isRead: false,
      },
      include: { sender: true },
    });

    await prisma.conversation.update({
      where: { id: convId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, message, conversationId: convId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
}
