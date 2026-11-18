import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get('role');
    const search = searchParams.get('search')?.toLowerCase();

    const where: any = {};

    if (roleFilter && roleFilter !== 'ALL') {
      if (roleFilter === 'MENTORS') {
        where.role = 'ADMIN';
      } else if (roleFilter === 'ADMINS') {
        where.role = 'SUPER_ADMIN';
      } else if (roleFilter === 'STUDENTS') {
        where.role = 'USER';
      } else {
        where.role = roleFilter;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { id: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        xpPoints: true,
        bio: true,
        githubUsername: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            courses: true,
          },
        },
      },
    });

    const formatted = users.map((u) => {
      const initials = (u.name || 'User')
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

      return {
        ...u,
        initials,
        enrollmentCount: u._count.enrollments,
        courseCount: u._count.courses,
      };
    });

    return NextResponse.json({
      success: true,
      users: formatted,
      totalCount: users.length,
    });
  } catch (error) {
    console.error('Super Admin Users GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role, password } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password || 'codepath123', 10);
    const assignedRole = role || 'USER';

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: assignedRole,
        status: 'ACTIVE',
        xpPoints: assignedRole === 'SUPER_ADMIN' ? 5000 : assignedRole === 'ADMIN' ? 3000 : 0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        xpPoints: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${newUser.name} created successfully as ${newUser.role}.`,
      user: newUser,
    });
  } catch (error) {
    console.error('Super Admin Users POST Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
