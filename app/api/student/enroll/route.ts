import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required.' },
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
      return NextResponse.json(
        { success: false, message: 'Student account not found.' },
        { status: 404 }
      );
    }

    // Check existing enrollment
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled in this course.',
        enrollment: existing,
      });
    }

    // Create Enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        paymentStatus: 'PAID',
        progressPercent: 0,
      },
    });

    // Award +100 XP for enrolling in a new track
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { xpPoints: { increment: 100 } },
      select: { xpPoints: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled!',
      enrollment,
      newXp: updatedUser.xpPoints,
    });
  } catch (error) {
    console.error('POST /api/student/enroll error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to enroll in course.' },
      { status: 500 }
    );
  }
}
