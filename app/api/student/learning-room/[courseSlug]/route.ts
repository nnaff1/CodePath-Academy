import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  try {
    const { courseSlug } = await params;

    // Identify student
    let studentId: string | null = null;
    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (sessionCookie) {
      const decoded = await verifyAuthToken(sessionCookie);
      if (decoded?.userId) studentId = decoded.userId;
    }

    // Fallback to demo student
    if (!studentId) {
      const fallback = await prisma.user.findUnique({
        where: { email: 'student@codepath.id' },
        select: { id: true },
      });
      studentId = fallback?.id ?? null;
    }

    if (!studentId) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Fetch course with chapters and lessons
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        mentor: { select: { name: true } },
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch student enrollment for this course
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: studentId, courseId: course.id } },
      include: {
        certificate: true,
      },
    });

    // Fetch student info
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true, xpPoints: true },
    });

    // Calculate total lessons
    const totalLessons = course.chapters.reduce(
      (sum, ch) => sum + ch.lessons.length,
      0
    );
    const progressPercent = enrollment?.progressPercent ?? 0;
    const completedCount = Math.round((progressPercent / 100) * totalLessons);

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        level: course.level,
        mentorName: course.mentor.name,
      },
      chapters: course.chapters,
      enrollment: enrollment
        ? {
            id: enrollment.id,
            progressPercent: enrollment.progressPercent,
            completedAt: enrollment.completedAt,
            certificate: enrollment.certificate,
          }
        : null,
      student,
      totalLessons,
      completedCount,
    });
  } catch (err) {
    console.error('[learning-room GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

