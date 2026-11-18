import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, courseSlug } = body as { lessonId: string; courseSlug: string };

    if (!lessonId || !courseSlug) {
      return NextResponse.json(
        { success: false, message: 'lessonId and courseSlug are required.' },
        { status: 400 }
      );
    }

    // Identify student
    let studentId: string | null = null;
    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (sessionCookie) {
      const decoded = await verifyAuthToken(sessionCookie);
      if (decoded?.userId) studentId = decoded.userId;
    }

    if (!studentId) {
      const fallback = await prisma.user.findUnique({
        where: { email: 'student@codepath.id' },
        select: { id: true },
      });
      studentId = fallback?.id ?? null;
    }

    if (!studentId) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    // Find course
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        chapters: {
          include: { lessons: { select: { id: true } } },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    // Find enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: studentId, courseId: course.id } },
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, message: 'Not enrolled in this course' }, { status: 403 });
    }

    // Count total lessons
    const totalLessons = course.chapters.reduce(
      (sum, ch) => sum + ch.lessons.length,
      0
    );

    if (totalLessons === 0) {
      return NextResponse.json({ success: false, message: 'No lessons in this course' }, { status: 400 });
    }

    // Increment progress by 1 lesson worth of percentage (capped at 100)
    const increment = Math.round(100 / totalLessons);
    const newProgressPercent = Math.min(100, enrollment.progressPercent + increment);

    // Award +25 XP for completing a lesson
    const XP_PER_LESSON = 25;

    // Update enrollment and award XP in a transaction
    const [updatedEnrollment, updatedUser] = await prisma.$transaction([
      prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercent: newProgressPercent,
          completedAt: newProgressPercent >= 100 ? new Date() : null,
        },
      }),
      prisma.user.update({
        where: { id: studentId },
        data: { xpPoints: { increment: XP_PER_LESSON } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      newProgressPercent: updatedEnrollment.progressPercent,
      newXp: updatedUser.xpPoints,
      xpAwarded: XP_PER_LESSON,
    });
  } catch (err) {
    console.error('[progress POST]', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

