import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bio, phone, avatarUrl, resumeUrl, privacy, skills, experienceTitle, experienceCompany } =
      await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: name || undefined,
        bio: bio !== undefined ? bio : undefined,
        phone: phone !== undefined ? phone : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        resumeUrl: resumeUrl !== undefined ? resumeUrl : undefined,
        privacy: privacy || undefined,
      },
      include: {
        skills: true,
        experiences: true,
        educations: true,
      },
    });

    if (skills && Array.isArray(skills)) {
      await prisma.userSkill.deleteMany({ where: { userId: session.userId } });
      for (const s of skills) {
        if (s.trim()) {
          await prisma.userSkill.create({
            data: { userId: session.userId, skillName: s.trim() },
          });
        }
      }
    }

    if (experienceTitle && experienceCompany) {
      await prisma.userExperience.create({
        data: {
          userId: session.userId,
          title: experienceTitle,
          company: experienceCompany,
          startDate: '2023-01',
        },
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Profile update failed' }, { status: 500 });
  }
}
