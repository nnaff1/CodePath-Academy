import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/mentor/lessons — create a new lesson in a chapter
export async function POST(req: NextRequest) {
  try {
    const { chapterId, title, videoUrl, content, starterCode, solutionHint, order } = await req.json();

    if (!chapterId || !title || !content) {
      return NextResponse.json(
        { success: false, message: 'chapterId, title, and content are required.' },
        { status: 400 }
      );
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      return NextResponse.json({ success: false, message: 'Chapter not found.' }, { status: 404 });
    }

    // Auto-calculate order if not provided
    const nextOrder =
      order ??
      ((await prisma.lesson.count({ where: { chapterId } })) + 1);

    const lesson = await prisma.lesson.create({
      data: {
        chapterId,
        title,
        videoUrl: videoUrl || null,
        content,
        starterCode: starterCode || null,
        solutionHint: solutionHint || null,
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, lesson }, { status: 201 });
  } catch (error) {
    console.error('POST /api/mentor/lessons error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create lesson.' }, { status: 500 });
  }
}

// GET /api/mentor/lessons?courseId=xxx — fetch chapters for a course (for dropdown)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      // Return all courses with their chapters
      const courses = await prisma.course.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          chapters: {
            select: { id: true, title: true, order: true },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json({ success: true, courses });
    }

    const chapters = await prisma.chapter.findMany({
      where: { courseId },
      select: { id: true, title: true, order: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, chapters });
  } catch (error) {
    console.error('GET /api/mentor/lessons error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch chapters.' }, { status: 500 });
  }
}
