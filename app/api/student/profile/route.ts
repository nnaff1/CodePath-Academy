import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
      user = await prisma.user.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          githubUsername: true,
          xpPoints: true,
          role: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: { email: 'student@codepath.id' },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          githubUsername: true,
          xpPoints: true,
          role: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: 'USER' },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          githubUsername: true,
          xpPoints: true,
          role: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Student not found.' },
        { status: 404 }
      );
    }

    // Fetch student's verified certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        enrollment: { userId: user.id },
      },
      include: {
        enrollment: {
          include: {
            course: { select: { title: true, slug: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        githubUsername: user.githubUsername || '',
        xpPoints: user.xpPoints,
        role: user.role,
        memberSince: user.createdAt.toISOString(),
      },
      certificates: certificates.map((c) => ({
        id: c.id,
        certificateCode: c.certificateCode,
        grade: c.grade,
        score: c.score,
        courseTitle: c.enrollment.course.title,
        courseSlug: c.enrollment.course.slug,
        issuedAt: c.issuedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('GET /api/student/profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch student profile.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, bio, githubUsername, currentPassword, newPassword } = body;

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

    // Build update payload
    const updateData: {
      name?: string;
      bio?: string | null;
      githubUsername?: string | null;
      password?: string;
    } = {};

    if (typeof name === 'string' && name.trim()) {
      updateData.name = name.trim();
    }

    if (typeof bio === 'string') {
      updateData.bio = bio.trim() || null;
    }

    if (typeof githubUsername === 'string') {
      // Clean up github username if user passed full URL or @
      const cleanUsername = githubUsername
        .replace(/^https?:\/\/github\.com\//, '')
        .replace(/^@/, '')
        .trim();
      updateData.githubUsername = cleanUsername || null;
    }

    // If password change is requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password is required to set a new password.' },
          { status: 400 }
        );
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'New password must be at least 6 characters.' },
          { status: 400 }
        );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    // Update in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        githubUsername: true,
        xpPoints: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('PATCH /api/student/profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
