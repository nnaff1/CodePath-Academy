import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.course.update({
      where: { id },
      data: { status: 'PUBLISHED' },
      include: {
        mentor: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Course "${updated.title}" successfully approved and published to live catalog!`,
      course: updated,
    });
  } catch (error) {
    console.error('Course approve API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to approve course' },
      { status: 500 }
    );
  }
}

