import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await prisma.jobApplication.findMany({
      where: { applicantId: session.userId },
      include: {
        job: {
          include: {
            business: true,
            location: { include: { city: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role === 'EMPLOYER') {
      return NextResponse.json(
        { error: 'Business / Employer accounts cannot apply to job listings. Please use a personal account.' },
        { status: 403 }
      );
    }

    const { jobId, coverLetter, resumeUrl } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const existing = await prisma.jobApplication.findFirst({
      where: { jobId, applicantId: session.userId },
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        applicantId: session.userId,
        coverLetter: coverLetter || null,
        resumeUrl: resumeUrl || null,
        status: 'APPLIED',
      },
      include: {
        job: { include: { postedBy: true } },
      },
    });

    // Send notification to job poster
    if (application.job.postedById) {
      await prisma.notification.create({
        data: {
          userId: application.job.postedById,
          type: 'application_update',
          title: 'New Applicant Received',
          message: `Someone applied to your listing: ${application.job.title}`,
          link: '/employer/dashboard',
        },
      });
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to apply' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, status } = await request.json();
    const validStatuses = ['APPLIED', 'VIEWED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED', 'WITHDRAWN'];

    if (!applicationId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
    }

    const updatedApp = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status, statusUpdatedAt: new Date() },
      include: { job: true, applicant: true },
    });

    // Notify applicant of status change
    await prisma.notification.create({
      data: {
        userId: updatedApp.applicantId,
        type: 'application_update',
        title: `Application Status: ${status}`,
        message: `Your application status for "${updatedApp.job.title}" was updated to ${status}.`,
        link: '/applications',
      },
    });

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Status update failed' }, { status: 500 });
  }
}
