import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();
    const specialization = searchParams.get('specialization');

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { mentor: { name: { contains: search } } },
        { codeTag: { contains: search } },
      ];
    }

    if (specialization && specialization !== 'ALL') {
      if (specialization === 'BACKEND') {
        where.OR = [
          { title: { contains: 'Backend' } },
          { title: { contains: 'Microservices' } },
          { title: { contains: 'Kafka' } },
          { codeTag: { contains: 'GO' } },
          { codeTag: { contains: 'NODE' } },
        ];
      } else if (specialization === 'FRONTEND') {
        where.OR = [
          { title: { contains: 'Frontend' } },
          { title: { contains: 'UI' } },
          { title: { contains: 'React' } },
        ];
      } else if (specialization === 'AI') {
        where.OR = [
          { title: { contains: 'AI' } },
          { title: { contains: 'Engineering' } },
        ];
      } else if (specialization === 'DEVOPS') {
        where.OR = [
          { title: { contains: 'Kubernetes' } },
          { title: { contains: 'Cloud' } },
          { codeTag: { contains: 'K8S' } },
        ];
      }
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        chapters: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
      },
    });

    const formatted = courses.map((course) => {
      const moduleCount = course.chapters.length || 8;
      const labCount =
        course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0) || 24;

      // Extract initials
      const mentorInitials = (course.mentor.name || 'Mentor')
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        level: course.level,
        price: course.price,
        formattedPrice: `Rp ${course.price.toLocaleString('id-ID')}`,
        status: course.status,
        codeTag: course.codeTag || 'DEV/CORE',
        isFeatured: course.isFeatured,
        featuredSlot: course.featuredSlot,
        createdAt: course.createdAt,
        mentor: {
          id: course.mentor.id,
          name: course.mentor.name,
          email: course.mentor.email,
          initials: mentorInitials,
          title: course.mentor.role === 'ADMIN' ? 'Lead Instructor' : 'Instructor',
        },
        moduleCount,
        labCount,
      };
    });

    return NextResponse.json({
      success: true,
      courses: formatted,
    });
  } catch (error) {
    console.error('Super Admin Courses GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, courseIds, courseId, status } = body;

    if (action === 'bulk-approve' && Array.isArray(courseIds)) {
      await prisma.course.updateMany({
        where: { id: { in: courseIds } },
        data: { status: 'PUBLISHED' },
      });

      return NextResponse.json({
        success: true,
        message: `${courseIds.length} courses approved and published successfully.`,
      });
    }

    if (courseId && status) {
      const updated = await prisma.course.update({
        where: { id: courseId },
        data: { status },
      });

      return NextResponse.json({
        success: true,
        course: updated,
        message: `Course ${updated.title} updated to ${status}.`,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action or parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Super Admin Courses PATCH Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update course' },
      { status: 500 }
    );
  }
}
