import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: jobId } = await params;
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job listing not found' }, { status: 404 });
    }

    // Verify ownership (must be posted by current user or business owner)
    if (existingJob.postedById !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to edit this job' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      responsibilities,
      requirements,
      benefits,
      galleryImages,
      salaryMin,
      salaryMax,
      salaryType,
      employmentType,
      schedule,
      experienceLevel,
      isRemote,
      languages,
      status,
    } = body;

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: title !== undefined ? title : existingJob.title,
        description: description !== undefined ? description : existingJob.description,
        responsibilities: responsibilities !== undefined ? responsibilities : existingJob.responsibilities,
        requirements: requirements !== undefined ? requirements : existingJob.requirements,
        benefits: benefits !== undefined ? benefits : existingJob.benefits,
        galleryImages: galleryImages !== undefined
          ? (typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages || []))
          : existingJob.galleryImages,
        salaryMin: salaryMin !== undefined ? (salaryMin ? parseFloat(salaryMin) : null) : existingJob.salaryMin,
        salaryMax: salaryMax !== undefined ? (salaryMax ? parseFloat(salaryMax) : null) : existingJob.salaryMax,
        salaryType: salaryType !== undefined ? salaryType : existingJob.salaryType,
        employmentType: employmentType !== undefined ? employmentType : existingJob.employmentType,
        schedule: schedule !== undefined ? schedule : existingJob.schedule,
        experienceLevel: experienceLevel !== undefined ? experienceLevel : existingJob.experienceLevel,
        isRemote: isRemote !== undefined ? isRemote : existingJob.isRemote,
        languages: languages !== undefined ? languages : existingJob.languages,
        status: status !== undefined ? status : existingJob.status,
      },
      include: {
        business: true,
        category: true,
        location: { include: { city: true } },
      },
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: jobId } = await params;
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job listing not found' }, { status: 404 });
    }

    if (existingJob.postedById !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to delete this job' }, { status: 403 });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete job' }, { status: 500 });
  }
}
