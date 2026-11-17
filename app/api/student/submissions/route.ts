import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, githubUrl } = body;

    if (!githubUrl || !githubUrl.trim()) {
      return NextResponse.json(
        { success: false, message: 'GitHub repository URL is required.' },
        { status: 400 }
      );
    }

    // Identify student
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
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'USER' } });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Student account not found.' },
        { status: 404 }
      );
    }

    // Resolve lesson
    let targetLessonId = lessonId;
    if (!targetLessonId) {
      const defaultLesson = await prisma.lesson.findFirst({
        where: { title: { contains: 'Optimistic UI' } },
      });
      targetLessonId = defaultLesson?.id;
    }

    if (!targetLessonId) {
      const anyLesson = await prisma.lesson.findFirst();
      targetLessonId = anyLesson?.id;
    }

    if (!targetLessonId) {
      return NextResponse.json(
        { success: false, message: 'No lesson found to submit against.' },
        { status: 400 }
      );
    }

    // Create Submission in SQLite
    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        lessonId: targetLessonId,
        githubUrl: githubUrl.trim(),
        status: 'PENDING',
      },
      include: {
        lesson: { select: { title: true } },
      },
    });

    // Award +50 XP for submission
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { xpPoints: { increment: 50 } },
      select: { xpPoints: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment submitted successfully to the mentor queue!',
      submission: {
        id: submission.id,
        githubUrl: submission.githubUrl,
        status: submission.status,
        lessonTitle: submission.lesson.title,
        createdAt: submission.createdAt.toISOString(),
      },
      newXp: updatedUser.xpPoints,
    });
  } catch (error) {
    console.error('POST /api/student/submissions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit assignment.' },
      { status: 500 }
    );
  }
}

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

    if (!user) {
      return NextResponse.json({ success: true, submissions: [] });
    }

    const submissions = await prisma.submission.findMany({
      where: { userId: user.id },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: { select: { title: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      submissions: submissions.map((s) => ({
        id: s.id,
        lessonTitle: s.lesson.title,
        chapterTitle: s.lesson.chapter.title,
        courseTitle: s.lesson.chapter.course.title,
        githubUrl: s.githubUrl,
        status: s.status,
        feedback: s.feedback,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('GET /api/student/submissions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submissions.' },
      { status: 500 }
    );
  }
}
