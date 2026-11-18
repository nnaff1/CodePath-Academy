import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { role, status } = body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const dataToUpdate: any = {};
    if (role && ['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      dataToUpdate.role = role;
    }
    if (status && ['ACTIVE', 'SUSPENDED'].includes(status)) {
      dataToUpdate.status = status;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        xpPoints: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${updated.name} updated successfully.`,
      user: updated,
    });
  } catch (error) {
    console.error('Super Admin User PATCH Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

