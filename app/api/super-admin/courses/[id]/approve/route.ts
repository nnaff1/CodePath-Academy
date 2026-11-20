import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const targetStatus = body?.action === 'REJECT' ? 'REJECTED' : 'PUBLISHED';

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
      data: { status: targetStatus },
      include: {
        mentor: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message:
        targetStatus === 'PUBLISHED'
          ? `Course "${updated.title}" successfully approved and published to live catalog!`
          : `Course "${updated.title}" was rejected and returned to draft.`,
      course: updated,
    });
  } catch (error) {
    console.error('Course approve API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process course approval decision' },
      { status: 500 }
    );
  }
}
