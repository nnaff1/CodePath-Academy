import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Identify student from session cookie or fallback to demo student
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
      user = await prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, name: true, email: true, role: true, xpPoints: true, bio: true, githubUsername: true },
      });
    }

    if (!user) {
      // Fallback to student@codepath.id or first USER
      user = await prisma.user.findFirst({
        where: { email: 'student@codepath.id' },
        select: { id: true, name: true, email: true, role: true, xpPoints: true, bio: true, githubUsername: true },
      });

      if (!user) {
        user = await prisma.user.findFirst({
          where: { role: 'USER' },
          select: { id: true, name: true, email: true, role: true, xpPoints: true, bio: true, githubUsername: true },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No student found in database.' },
        { status: 404 }
      );
    }

    // 2. Fetch Enrollments with course & certificate
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            level: true,
            price: true,
            mentor: { select: { name: true } },
          },
        },
        certificate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const activeEnrollments = enrollments.filter((e) => e.completedAt === null);
    const completedEnrollments = enrollments.filter((e) => e.completedAt !== null);

    const activeCoursesCount = activeEnrollments.length;
    const avgProgress =
      activeEnrollments.length > 0
        ? Math.round(
            activeEnrollments.reduce((acc, curr) => acc + curr.progressPercent, 0) /
              activeEnrollments.length
          )
        : 72;

    // 3. Fetch Certificates for this student
    const certificates = await prisma.certificate.findMany({
      where: {
        enrollment: { userId: user.id },
      },
      include: {
        enrollment: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    const latestCert = certificates.length > 0 ? certificates[0] : null;

    // 4. Fetch the active lesson (Optimistic UI Updates with useActionState)
    let currentLesson = await prisma.lesson.findFirst({
      where: {
        title: { contains: 'Optimistic UI Updates' },
      },
      include: {
        chapter: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
          },
        },
      },
    });

    // Fallback if not found
    if (!currentLesson) {
      currentLesson = await prisma.lesson.findFirst({
        include: {
          chapter: {
            include: {
              course: { select: { id: true, title: true, slug: true } },
            },
          },
        },
      });
    }

    // 5. Fetch recent student submissions
    const recentSubmissions = await prisma.submission.findMany({
      where: { userId: user.id },
      include: {
        lesson: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xpPoints: user.xpPoints,
        bio: user.bio || '',
        githubUsername: user.githubUsername || '',
      },
      kpis: {
        totalXp: user.xpPoints,
        activeCoursesCount,
        averageProgress: avgProgress,
        certificatesCount: certificates.length,
        latestCertificate: latestCert
          ? {
              code: latestCert.certificateCode,
              grade: latestCert.grade,
              score: latestCert.score,
              courseTitle: latestCert.enrollment.course.title,
            }
          : null,
      },
      currentLesson: currentLesson
        ? {
            id: currentLesson.id,
            title: currentLesson.title,
            order: currentLesson.order,
            chapterTitle: currentLesson.chapter.title,
            courseTitle: currentLesson.chapter.course.title,
            content: currentLesson.content,
            starterCode: currentLesson.starterCode,
            solutionHint: currentLesson.solutionHint,
          }
        : null,
      enrollments: enrollments.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        courseTitle: e.course.title,
        courseSlug: e.course.slug,
        courseLevel: e.course.level,
        progressPercent: e.progressPercent,
        completedAt: e.completedAt ? e.completedAt.toISOString() : null,
        certificateCode: e.certificate?.certificateCode || null,
      })),
      certificates: certificates.map((c) => ({
        id: c.id,
        certificateCode: c.certificateCode,
        grade: c.grade,
        score: c.score,
        issuedAt: c.issuedAt.toISOString(),
        courseTitle: c.enrollment.course.title,
        courseSlug: c.enrollment.course.slug,
      })),
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        lessonTitle: s.lesson.title,
        githubUrl: s.githubUrl,
        status: s.status,
        feedback: s.feedback,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('GET /api/student/dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch student dashboard data.' },
      { status: 500 }
    );
  }
}
