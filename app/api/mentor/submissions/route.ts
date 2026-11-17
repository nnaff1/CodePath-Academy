import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/mentor/submissions — list all PENDING submissions with full join
export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        lesson: {
          include: {
            chapter: {
              include: {
                course: { select: { id: true, title: true, slug: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const formatted = submissions.map((s) => ({
      id: s.id,
      studentName: s.user.name,
      studentEmail: s.user.email,
      courseTitle: s.lesson.chapter.course.title,
      chapterTitle: s.lesson.chapter.title,
      lessonTitle: s.lesson.title,
      githubUrl: s.githubUrl,
      status: s.status,
      feedback: s.feedback,
      createdAt: s.createdAt.toISOString(),
      userId: s.userId,
      lessonId: s.lessonId,
    }));

    return NextResponse.json({ success: true, submissions: formatted });
  } catch (error) {
    console.error('GET /api/mentor/submissions error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch submissions.' }, { status: 500 });
  }
}

// PATCH /api/mentor/submissions — update submission status + feedback
export async function PATCH(req: NextRequest) {
  try {
    const { submissionId, status, feedback } = await req.json();

    if (!submissionId || !status) {
      return NextResponse.json({ success: false, message: 'submissionId and status are required.' }, { status: 400 });
    }

    if (!['PENDING', 'APPROVED', 'REVISION'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status value.' }, { status: 400 });
    }

    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status,
        feedback: feedback ?? null,
      },
    });

    // If APPROVED, award XP to student (+150 xp)
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: updated.userId },
        data: { xpPoints: { increment: 150 } },
      });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error('PATCH /api/mentor/submissions error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update submission.' }, { status: 500 });
  }
}
