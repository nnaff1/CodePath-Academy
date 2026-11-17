import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    let studentId: string | null = null;
    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (sessionCookie) {
      const decoded = await verifyAuthToken(sessionCookie);
      if (decoded?.userId) {
        studentId = decoded.userId;
      }
    }

    let user = null;
    if (studentId) {
      user = await prisma.user.findUnique({ where: { id: studentId } });
    }
    if (!user) {
      user = await prisma.user.findFirst({ where: { email: 'student@codepath.id' } });
    }

    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        mentor: { select: { name: true, role: true } },
        chapters: {
          select: {
            id: true,
            title: true,
            lessons: { select: { id: true, title: true } },
          },
        },
        enrollments: user ? { where: { userId: user.id } } : false,
      },
      orderBy: { createdAt: 'asc' },
    });

    const formatted = courses.map((c) => {
      const enrollment = user && Array.isArray(c.enrollments) && c.enrollments.length > 0 ? c.enrollments[0] : null;
      const totalLessons = c.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        level: c.level,
        price: c.price,
        mentorName: c.mentor.name,
        chaptersCount: c.chapters.length,
        lessonsCount: totalLessons,
        isEnrolled: Boolean(enrollment),
        progressPercent: enrollment ? enrollment.progressPercent : 0,
        completedAt: enrollment?.completedAt ? enrollment.completedAt.toISOString() : null,
      };
    });

    return NextResponse.json({ success: true, courses: formatted });
  } catch (error) {
    console.error('GET /api/student/courses error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses.' },
      { status: 500 }
    );
  }
}
