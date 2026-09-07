import { NextResponse } from 'next/server';
import { getSession, createToken, TOKEN_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activeRole } = await request.json();
    const validRoles = ['JOB_SEEKER', 'EMPLOYER', 'SERVICE_PROVIDER', 'CUSTOMER', 'ADMIN'];

    if (!validRoles.includes(activeRole)) {
      return NextResponse.json({ error: 'Invalid role selection' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { activeRole },
    });

    const token = createToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      activeRole: updatedUser.activeRole,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        activeRole: updatedUser.activeRole,
      },
    });

    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Role switch failed' }, { status: 500 });
  }
}
